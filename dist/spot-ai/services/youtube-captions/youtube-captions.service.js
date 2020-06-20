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
exports.YoutubeCaptionsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const video_url_model_1 = require("../../models/video-url.model");
const fetch = require("node-fetch");
const jsdom_1 = require("jsdom");
const form_urlencoded_1 = require("form-urlencoded");
const xml2js = require("xml2js");
const db_service_1 = require("../../../utils/services/db/db.service");
const youtube_captions_scraper_1 = require("youtube-captions-scraper");
let YoutubeCaptionsService = (() => {
    let YoutubeCaptionsService = class YoutubeCaptionsService {
        constructor(configService, db) {
            this.configService = configService;
            this.db = db;
        }
        async transcribe(video) {
            var _a;
            try {
                let jsonSrt = await youtube_captions_scraper_1.getSubtitles({
                    videoID: video.getVideoId(),
                    lang: 'en'
                });
                if (jsonSrt) {
                    this.db.saveVideoTranscription(video.getVideoId(), jsonSrt);
                    return true;
                }
                else {
                    let captionsList = await this.getCaptionsListSrt(video);
                    let xmlSrt = captionsList ?
                        await this.extractEnglishSrt(captionsList) : null;
                    let jsonSrt = xmlSrt ? await this.xmlToJson(xmlSrt) : null;
                    if (jsonSrt) {
                        this.db.saveVideoTranscription(video.getVideoId(), (_a = jsonSrt === null || jsonSrt === void 0 ? void 0 : jsonSrt.transcript) === null || _a === void 0 ? void 0 : _a.text);
                        return true;
                    }
                }
                return false;
            }
            catch (e) {
                console.log(e);
            }
        }
        xmlToJson(xml) {
            try {
                return new Promise((resolve, reject) => {
                    xml2js.parseString(xml, (err, result) => {
                        if (err) {
                            reject();
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
            }
            catch (e) {
            }
        }
        getCaptionsListSrt(video) {
            try {
                let url = this.configService.get("YOUTUBE_CAPTIONS_URL");
                let headers = {
                    "Accept-Language": "en-US,en;",
                    "Accept": "test/html,application/xhtml+xml,\
        application/xml;q=0.9,*/*;q=0.8",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Referer": url,
                    "Origin": url,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) \
        AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
                };
                return new Promise((resolve, reject) => {
                    fetch(url, {
                        method: 'POST',
                        headers: headers,
                        body: form_urlencoded_1.default({ url: video.getUrl() })
                    })
                        .then((res) => res.text())
                        .then(res => resolve(res));
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        extractEnglishSrt(domResult) {
            var _a;
            try {
                let parser = new jsdom_1.JSDOM(domResult);
                let doc = (_a = parser === null || parser === void 0 ? void 0 : parser.window) === null || _a === void 0 ? void 0 : _a.document;
                return new Promise((resolve, reject) => {
                    doc.querySelectorAll("[name='sub_url']").forEach((b) => {
                        var _a;
                        if ((_a = b === null || b === void 0 ? void 0 : b.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("english")) {
                            if (b.value) {
                                fetch(b.value)
                                    .then(res => res.text())
                                    .then(res => resolve(res));
                            }
                            else {
                                reject();
                            }
                        }
                    });
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    YoutubeCaptionsService = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [config_1.ConfigService, db_service_1.DbService])
    ], YoutubeCaptionsService);
    return YoutubeCaptionsService;
})();
exports.YoutubeCaptionsService = YoutubeCaptionsService;
//# sourceMappingURL=youtube-captions.service.js.map