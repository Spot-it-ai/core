import { HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Video } from 'src/spot-ai/models/video.model';
export declare class YoutubeSearchService {
    private configService;
    private http;
    constructor(configService: ConfigService, http: HttpService);
    searchYoutube(query: string): Promise<Video[]>;
    private getAndProcess;
    private getResults;
}
