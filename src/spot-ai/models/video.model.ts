import { VideoUrl } from "./video-url.model";

export class Video extends VideoUrl {
  private startTimes: number[];
  private isWatchFull: boolean;
  private thumbnails: [];
  private description: string;
  private publishTime: string;
  private channelName: string;

  constructor(title: string, url: string, id?: string) {
    super(title, url, id);
    this.startTimes = [];
    this.isWatchFull = false;
  }

  setWatchFull(watch: boolean): void {
    this.isWatchFull = watch;
  }

  setStartTime(times: number[]): void {
    this.startTimes = times;
  }

  getStartTime(): number[] {
    return this.startTimes;
  }

  addStartTime(time: number): void {
    if (this.startTimes.length > 0) {
      this.startTimes.push(time);
    }
    else {
      this.startTimes = [time];
    }
  }

  setThumbnails(thumbnails: []): void {
    this.thumbnails = thumbnails;
  }

  setChannelName(name: string): void {
    this.channelName = name;
  }

  setDescription(desc: string): void {
    this.description = desc;
  }

  setPublishTime(time: string): void {
    this.publishTime = time;
  }
}
