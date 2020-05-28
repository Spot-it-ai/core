import { Url } from "src/utils/interfaces/url.interface";

export class VideoUrl implements Url {
  private title: string;
  private url: string;

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
}
