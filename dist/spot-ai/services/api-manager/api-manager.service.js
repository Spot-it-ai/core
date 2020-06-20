"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiManagerService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const argon2 = require("argon2");
const stemmer = require("stemmer");
const db_service_1 = require("../../../utils/services/db/db.service");
const video_url_dto_1 = require("../../dto/video-url.dto");
const video_url_model_1 = require("../../models/video-url.model");
const config_1 = require("@nestjs/config");
const api_response_model_1 = require("../../models/api-response.model");
const data_model_1 = require("../../models/data.model");
const search_results_scrapper_service_1 = require("../search-results-scrapper/search-results-scrapper.service");
const youtube_captions_service_1 = require("../youtube-captions/youtube-captions.service");
const video_model_1 = require("../../models/video.model");
const youtube_search_service_1 = require("../youtube-search/youtube-search.service");
const login_dto_1 = require("../../dto/login.dto");
const jwt_token_service_1 = require("../jwt-token/jwt-token.service");
let ApiManagerService = (() => {
    let ApiManagerService = class ApiManagerService {
        constructor(dbService, configService, http, webSearch, youtubeCaptions, youtubeSearch, jwtToken) {
            this.dbService = dbService;
            this.configService = configService;
            this.http = http;
            this.webSearch = webSearch;
            this.youtubeCaptions = youtubeCaptions;
            this.youtubeSearch = youtubeSearch;
            this.jwtToken = jwtToken;
        }
        async searchQuery(query) {
            var _a;
            if (query) {
                let apiResponse = new api_response_model_1.ApiResponse();
                let dataResponse = new data_model_1.Data();
                try {
                    let correctQuery = await this.spellCheck(query);
                    let searchQuery = (_a = correctQuery === null || correctQuery === void 0 ? void 0 : correctQuery.suggestion) !== null && _a !== void 0 ? _a : query;
                    let witAiResponse = await this.queryWitAi(searchQuery);
                    let witProcessed = this.processWitAiResponse(witAiResponse);
                    if (witProcessed) {
                        console.log(witProcessed);
                        let shortenedQuery = witProcessed.topic + " " + witProcessed.course;
                        let matchedVideos = this.findVideosMatchingSearch(witProcessed);
                        let lectureVideos = this.findQueryInVideoTranscriptions(witProcessed, matchedVideos);
                        dataResponse.setLectureVideos(lectureVideos);
                        let webSearchResults = await this.webSearch.search(shortenedQuery);
                        dataResponse.setWebResults(webSearchResults);
                        let youtubeResults = await this.youtubeSearch.searchYoutube(shortenedQuery);
                        dataResponse.setYoutuubeResults(youtubeResults);
                        apiResponse.setData(dataResponse);
                        return apiResponse;
                    }
                    else {
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
            }
        }
        deleteVideo(id) {
            let apiResponse = new api_response_model_1.ApiResponse();
            try {
                console.log(id);
                if (this.dbService.deleteVideo(id)) {
                    apiResponse.setData(null);
                    return apiResponse;
                }
                else {
                    return null;
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        getAllVideos() {
            let apiResponse = new api_response_model_1.ApiResponse();
            let dataResponse = new data_model_1.Data();
            try {
                let res = [];
                let videos = this.dbService.findAllVideos();
                videos.forEach((v) => {
                    let video = new video_url_model_1.VideoUrl(v.title, v.url, v.id, v._id);
                    res.push(video);
                });
                dataResponse.setAllVideos(res);
                apiResponse.setData(dataResponse);
                return apiResponse;
            }
            catch (e) {
                console.log(e);
            }
        }
        async loginUser(loginDto) {
            let apiResponse = new api_response_model_1.ApiResponse();
            let dataResponse = new data_model_1.Data();
            let username = this.configService.get("USER_NAME");
            if (loginDto.username && loginDto.username === username && loginDto.password) {
                if (await this.validatePwd(loginDto.password)) {
                    let secret = this.configService.get("TOKEN_SECRET");
                    let username = this.configService.get("USERNAME");
                    let token = this.jwtToken.sign({ user: username }, secret);
                    dataResponse.setToken(token);
                    apiResponse.setData(dataResponse);
                    return apiResponse;
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }
        saveVideoUrl(urlDto) {
            if (urlDto.title.trim() && urlDto.url.trim()) {
                let videoUrl = new video_url_model_1.VideoUrl(urlDto.title.trim(), urlDto.url.trim(), this.getVideoId(urlDto.url.trim()));
                let apiResponse = new api_response_model_1.ApiResponse();
                let dataResponse = new data_model_1.Data();
                try {
                    if (this.youtubeCaptions.transcribe(videoUrl)) {
                        if (this.dbService.saveVideoUrl(videoUrl)) {
                            return apiResponse;
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
            }
        }
        async validatePwd(password) {
            try {
                let hash = this.configService.get("PASSWORD");
                return await argon2.verify(hash, password);
            }
            catch (e) {
                console.log(e);
            }
        }
        processWitAiResponse(res) {
            var _a, _b;
            if (res) {
                let entities = res === null || res === void 0 ? void 0 : res.entities;
                if (entities["topic:topic"] && entities["course:course"]) {
                    let topic = (_a = entities["topic:topic"][0]) === null || _a === void 0 ? void 0 : _a.value;
                    let course = (_b = entities["course:course"][0]) === null || _b === void 0 ? void 0 : _b.value;
                    return {
                        stemmed: {
                            topic: stemmer(topic.toLowerCase()),
                            course: stemmer(course.toLowerCase()),
                        },
                        topic: topic.toLowerCase(),
                        course: course.toLowerCase(),
                    };
                }
            }
            return null;
        }
        findQueryInVideoTranscriptions(query, videos) {
            let videosResult = [];
            videos.forEach((video) => {
                var _a, _b, _c, _d, _e, _f;
                let v = new video_model_1.Video(video.title, video.url, video.id);
                let transcriptions = this.dbService.findVideoTranscriptions(video.id);
                let lastFind = (_c = Number((_b = (_a = transcriptions[0]) === null || _a === void 0 ? void 0 : _a.start) === null || _b === void 0 ? void 0 : _b.split(".")[0])) !== null && _c !== void 0 ? _c : Number((_f = (_e = (_d = transcriptions[0]) === null || _d === void 0 ? void 0 : _d.$) === null || _e === void 0 ? void 0 : _e.start) === null || _f === void 0 ? void 0 : _f.split(".")[0]);
                if (lastFind <= 300) {
                    v.setWatchFull(true);
                    videosResult.push(v);
                }
                else {
                    lastFind = 0;
                    let lastFindDiff = 300;
                    transcriptions.reverse().forEach((transcription) => {
                        var _a, _b, _c, _d, _e, _f, _g;
                        let time = (_b = (_a = transcription === null || transcription === void 0 ? void 0 : transcription.start) === null || _a === void 0 ? void 0 : _a.split(".")[0]) !== null && _b !== void 0 ? _b : (_d = (_c = transcription === null || transcription === void 0 ? void 0 : transcription.$) === null || _c === void 0 ? void 0 : _c.start) === null || _d === void 0 ? void 0 : _d.split(".")[0];
                        let t = (_e = transcription === null || transcription === void 0 ? void 0 : transcription.text) !== null && _e !== void 0 ? _e : transcription === null || transcription === void 0 ? void 0 : transcription._;
                        if (((_f = t === null || t === void 0 ? void 0 : t.toLowerCase()) === null || _f === void 0 ? void 0 : _f.includes((_g = query === null || query === void 0 ? void 0 : query.stemmed) === null || _g === void 0 ? void 0 : _g.topic)) &&
                            Number(time) > lastFind) {
                            lastFind = Number(time) + lastFindDiff;
                            v.addStartTime(Number(time));
                        }
                    });
                    if (v.getStartTime().length > 0) {
                        let total = this.dbService.findTotalCountofTranscriptions(video.id);
                        if (v.getStartTime().length / total > 0.20) {
                            v.setWatchFull(true);
                        }
                        videosResult.push(v);
                    }
                }
            });
            return videosResult;
        }
        findVideosMatchingSearch(query) {
            let videos = this.dbService.findAllVideos();
            let resultVideos = [];
            videos.forEach((video) => {
                let stemmed = query === null || query === void 0 ? void 0 : query.stemmed;
                let title = video.title.toLowerCase().replace(/[:-;|_@(),]/g, "");
                if (title.includes(stemmed === null || stemmed === void 0 ? void 0 : stemmed.topic) || title.includes(stemmed === null || stemmed === void 0 ? void 0 : stemmed.course)) {
                    resultVideos.push(video);
                }
            });
            return resultVideos;
        }
        spellCheck(query) {
            let url = this.configService.get("SPELL_CHECK_API_URL");
            let token = this.configService.get("SPELL_CHECK_API_KEY");
            let queryUrl = url + query.trim();
            let headers = {
                "x-rapidapi-host": "montanaflynn-spellcheck.p.rapidapi.com",
                "x-rapidapi-key": token,
                "useQueryString": true
            };
            return new Promise((resolve, reject) => {
                this.http
                    .get(queryUrl, { headers: headers })
                    .subscribe((res) => {
                    resolve(res.data);
                });
            });
        }
        queryWitAi(query) {
            let url = this.configService.get("WIT_AI_API_URL");
            let token = this.configService.get("WIT_AI_API_KEY");
            let queryUrl = url + query.trim();
            let headers = { "Authorization": "Bearer " + token };
            return new Promise((resolve, reject) => {
                this.http
                    .get(queryUrl, { headers: headers })
                    .subscribe((res) => {
                    resolve(res.data);
                });
            });
        }
        hasVideoAlreadyTranscribed(videoId) {
            let path = this.configService.get("DB_PATH") + "/transcriptions";
            fs.readdirSync(path).forEach((file) => {
                let fileName = file.substring(0, file.indexOf(".json"));
                if (fileName === videoId) {
                    return true;
                }
            });
            return false;
        }
        getVideoId(url) {
            try {
                let videoId = url.split("v=")[1];
                let ampersandPos = videoId.indexOf("&");
                if (ampersandPos != -1) {
                    videoId = videoId.substring(0, ampersandPos);
                }
                return videoId;
            }
            catch (e) {
                return null;
            }
        }
    };
    ApiManagerService = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [db_service_1.DbService,
            config_1.ConfigService,
            common_1.HttpService,
            search_results_scrapper_service_1.SearchResultsScrapperService,
            youtube_captions_service_1.YoutubeCaptionsService,
            youtube_search_service_1.YoutubeSearchService,
            jwt_token_service_1.JwtTokenService])
    ], ApiManagerService);
    return ApiManagerService;
})();
exports.ApiManagerService = ApiManagerService;
//# sourceMappingURL=api-manager.service.js.map