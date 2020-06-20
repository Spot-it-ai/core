"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
class Data {
    constructor() {
        this.webResults = [];
        this.lectureVideos = [];
        this.youtubeResults = [];
        this.allVideos = [];
    }
    setToken(token) {
        this.token = token;
    }
    setWebResults(results) {
        this.webResults = results;
    }
    setLectureVideos(results) {
        this.lectureVideos = results;
    }
    setYoutuubeResults(results) {
        this.youtubeResults = results;
    }
    setAllVideos(videos) {
        this.allVideos = videos;
    }
}
exports.Data = Data;
//# sourceMappingURL=data.model.js.map