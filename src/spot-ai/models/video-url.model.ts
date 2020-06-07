import { Url } from "src/utils/interfaces/url.interface";

export class VideoUrl implements Url {
  protected title: string;
  protected url: string;
  protected id: string;

  constructor(title?: string, url?: string, id?: string) {
    this.id = id ? id : "";
    this.url = url ? url : "";
    this.title = title ? title : "";
  }

  getTitle(): string {
    return this.title;
  }

  getUrl(): string {
    return this.url;
  }

  setUrl(url: string): void {
    this.url = url;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  setVideoId(id: string): void {
    this.id = id
  }

  getVideoId(): string {
    return this.id;
  }
}
