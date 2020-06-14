import { WebResult } from "./web-result.model";
import { Video } from "./video.model";

export class Data {
  private webResults: WebResult[];
  private lectureVideos: Video[];
  private youtubeResults: Video[];

  constructor() {
    this.webResults = [];
    this.lectureVideos = [];
    this.youtubeResults = [];
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
}
