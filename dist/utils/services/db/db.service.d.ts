import { ConfigService } from '@nestjs/config';
import { Url } from 'src/utils/interfaces/url.interface';
export declare class DbService {
    private readonly VIDEO_LIST;
    private readonly VIDEO_TRANSCRIPTIONS;
    private db;
    constructor(configService: ConfigService);
    deleteVideo(id: string): any;
    saveVideoUrl(url: Url): any;
    getAllVideos(): any;
    saveVideoTranscription(videoId: string, json: any): void;
    findTotalCountofTranscriptions(videoId: string): number;
    findVideoTranscriptions(videoId: string): any[];
    findAllVideos(): any;
}
