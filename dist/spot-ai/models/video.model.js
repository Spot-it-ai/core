"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const video_url_model_1 = require("./video-url.model");
class Video extends video_url_model_1.VideoUrl {
    constructor(title, url, id) {
        super(title, url, id);
        this.startTimes = [];
        this.isWatchFull = false;
    }
    setWatchFull(watch) {
        this.isWatchFull = watch;
    }
    setStartTime(times) {
        this.startTimes = times;
    }
    getStartTime() {
        return this.startTimes;
    }
    addStartTime(time) {
        if (this.startTimes.length > 0) {
            this.startTimes.push(time);
        }
        else {
            this.startTimes = [time];
        }
    }
    setThumbnails(thumbnails) {
        this.thumbnails = thumbnails;
    }
    setChannelName(name) {
        this.channelName = name;
    }
    setDescription(desc) {
        this.description = desc;
    }
    setPublishTime(time) {
        this.publishTime = time;
    }
}
exports.Video = Video;
//# sourceMappingURL=video.model.js.map