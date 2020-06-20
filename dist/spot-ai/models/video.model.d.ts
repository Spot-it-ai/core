import { VideoUrl } from "./video-url.model";
export declare class Video extends VideoUrl {
    private startTimes;
    private isWatchFull;
    private thumbnails;
    private description;
    private publishTime;
    private channelName;
    constructor(title: string, url: string, id?: string);
    setWatchFull(watch: boolean): void;
    setStartTime(times: number[]): void;
    getStartTime(): number[];
    addStartTime(time: number): void;
    setThumbnails(thumbnails: []): void;
    setChannelName(name: string): void;
    setDescription(desc: string): void;
    setPublishTime(time: string): void;
}
