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
exports.DbService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const diskDb = require("diskdb");
const url_interface_1 = require("../../interfaces/url.interface");
const video_url_model_1 = require("../../../spot-ai/models/video-url.model");
let DbService = (() => {
    let DbService = class DbService {
        constructor(configService) {
            this.VIDEO_LIST = "videos";
            this.VIDEO_TRANSCRIPTIONS = "/transcriptions/";
            this.db = diskDb.connect(configService.get("DB_PATH"));
        }
        deleteVideo(id) {
            try {
                this.db.loadCollections([this.VIDEO_LIST]);
                let video = this.db[this.VIDEO_LIST].findOne({ _id: id });
                let transcription = this.VIDEO_TRANSCRIPTIONS + video.id;
                this.db[this.VIDEO_LIST].remove({ _id: id });
                this.db.loadCollections([transcription]);
                return this.db[transcription].remove();
            }
            catch (e) {
                console.log(e);
            }
        }
        saveVideoUrl(url) {
            try {
                this.db.loadCollections([this.VIDEO_LIST]);
                let urlObj = new video_url_model_1.VideoUrl();
                urlObj.setUrl(url.getUrl());
                if (!this.db[this.VIDEO_LIST].findOne(urlObj)) {
                    return this.db[this.VIDEO_LIST].save(url);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        getAllVideos() {
            try {
                this.db.loadCollections([this.VIDEO_LIST]);
                return this.db[this.VIDEO_LIST].find();
            }
            catch (e) {
                console.log(e);
            }
        }
        saveVideoTranscription(videoId, json) {
            try {
                let collection = this.VIDEO_TRANSCRIPTIONS + videoId;
                this.db.loadCollections([collection]);
                return this.db[collection].save(json);
            }
            catch (e) {
                console.log(e);
            }
        }
        findTotalCountofTranscriptions(videoId) {
            try {
                let collection = this.VIDEO_TRANSCRIPTIONS + videoId;
                this.db.loadCollections([collection]);
                return this.db[collection].count();
            }
            catch (e) {
                console.log(e);
            }
        }
        findVideoTranscriptions(videoId) {
            try {
                let collection = this.VIDEO_TRANSCRIPTIONS + videoId;
                this.db.loadCollections([collection]);
                return this.db[collection].find();
            }
            catch (e) {
                console.log(e);
            }
        }
        findAllVideos() {
            try {
                this.db.loadCollections([this.VIDEO_LIST]);
                return this.db.videos.find();
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    DbService = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [config_1.ConfigService])
    ], DbService);
    return DbService;
})();
exports.DbService = DbService;
//# sourceMappingURL=db.service.js.map