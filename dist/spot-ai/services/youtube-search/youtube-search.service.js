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
exports.YoutubeSearchService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const video_model_1 = require("../../models/video.model");
let YoutubeSearchService = (() => {
    let YoutubeSearchService = class YoutubeSearchService {
        constructor(configService, http) {
            this.configService = configService;
            this.http = http;
        }
        async searchYoutube(query) {
            let endpoint = this.configService.get("YOUTUBE_SEARCH_ENDPOINT");
            endpoint += query;
            return await this.getAndProcess(endpoint);
        }
        async getAndProcess(endpoint) {
            let results = await this.getResults(endpoint);
            let items = results.items;
            let op = [];
            items.forEach((item) => {
                var _a, _b, _c, _d, _e, _f;
                let id = (_a = item === null || item === void 0 ? void 0 : item.id) === null || _a === void 0 ? void 0 : _a.videoId;
                let url = "https://www.youtube.com/watch?v=" + id;
                let description = (_b = item === null || item === void 0 ? void 0 : item.snippet) === null || _b === void 0 ? void 0 : _b.description;
                let title = (_c = item === null || item === void 0 ? void 0 : item.snippet) === null || _c === void 0 ? void 0 : _c.title;
                let thumbnails = (_d = item === null || item === void 0 ? void 0 : item.snippet) === null || _d === void 0 ? void 0 : _d.thumbnails;
                let channelTitle = (_e = item === null || item === void 0 ? void 0 : item.snippet) === null || _e === void 0 ? void 0 : _e.channelTitle;
                let publishTime = (_f = item === null || item === void 0 ? void 0 : item.snippet) === null || _f === void 0 ? void 0 : _f.publishTime;
                let v = new video_model_1.Video(title, url, id);
                v.setDescription(description);
                v.setThumbnails(thumbnails);
                v.setChannelName(channelTitle);
                v.setPublishTime(publishTime);
                op.push(v);
            });
            return op;
        }
        getResults(endpoint) {
            return new Promise((resolve, reject) => {
                this.http
                    .get(endpoint)
                    .subscribe((res) => {
                    resolve(res.data);
                });
            });
        }
    };
    YoutubeSearchService = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [config_1.ConfigService, common_1.HttpService])
    ], YoutubeSearchService);
    return YoutubeSearchService;
})();
exports.YoutubeSearchService = YoutubeSearchService;
//# sourceMappingURL=youtube-search.service.js.map