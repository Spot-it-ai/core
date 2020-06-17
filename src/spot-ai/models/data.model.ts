import { WebResult } from "./web-result.model";
import { Video } from "./video.model";
import { VideoUrl } from "./video-url.model";

export class Data {
  private webResults: WebResult[];
  private lectureVideos: Video[];
  private youtubeResults: Video[];
  private allVideos: VideoUrl[];

  constructor() {
    this.webResults = [];
    this.lectureVideos = [];
    this.youtubeResults = [];
    this.allVideos = [];
  }

  setWebResults(results: WebResult[]): void {
    this.webResults = results;
  }

  setLectureVideos(results: Video[]): void {
    this.lectureVideos = results;
  }

  setYoutuubeResults(results: Video[]): void {
    this.youtubeResults = results;
  }

  setAllVideos(videos: VideoUrl[]): void {
    this.allVideos = videos;
  }
}
