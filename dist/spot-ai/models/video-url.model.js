"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoUrl = void 0;
const url_interface_1 = require("../../utils/interfaces/url.interface");
class VideoUrl {
    constructor(title, url, id, _id) {
        this.id = id ? id : "";
        this.url = url ? url : "";
        this.title = title ? title : "";
        this._id = _id ? _id : "";
    }
    getTitle() {
        return this.title;
    }
    getUrl() {
        return this.url;
    }
    setUrl(url) {
        this.url = url;
    }
    setTitle(title) {
        this.title = title;
    }
    setVideoId(id) {
        this.id = id;
    }
    getVideoId() {
        return this.id;
    }
}
exports.VideoUrl = VideoUrl;
//# sourceMappingURL=video-url.model.js.map