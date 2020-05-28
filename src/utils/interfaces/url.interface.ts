export interface Url {
  getUrl(): string;
  getTitle(): string;
  setTitle(title: string): void;
  setUrl(url: string): void;
}
