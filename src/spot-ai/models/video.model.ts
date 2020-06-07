import { VideoUrl } from "./video-url.model";

export class Video extends VideoUrl {
  private startTimes: number[];

  addStartTime(time: number): void {
    if (this.startTimes.length > 0) {
      this.startTimes.push(time);
    }
    else {
      this.startTimes = [time];
    }
  }
}
