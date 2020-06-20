import { WebResult } from "./web-result.model";
import { Video } from "./video.model";
import { VideoUrl } from "./video-url.model";
export declare class Data {
    private webResults;
    private lectureVideos;
    private youtubeResults;
    private allVideos;
    private token;
    constructor();
    setToken(token: string): void;
    setWebResults(results: WebResult[]): void;
    setLectureVideos(results: Video[]): void;
    setYoutuubeResults(results: Video[]): void;
    setAllVideos(videos: VideoUrl[]): void;
}
