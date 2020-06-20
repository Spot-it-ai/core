import { Url } from "src/utils/interfaces/url.interface";
export declare class VideoUrl implements Url {
    protected title: string;
    protected url: string;
    protected id: string;
    protected _id: string;
    constructor(title?: string, url?: string, id?: string, _id?: string);
    getTitle(): string;
    getUrl(): string;
    setUrl(url: string): void;
    setTitle(title: string): void;
    setVideoId(id: string): void;
    getVideoId(): string;
}
