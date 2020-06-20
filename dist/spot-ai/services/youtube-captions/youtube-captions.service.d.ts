import { ConfigService } from '@nestjs/config';
import { VideoUrl } from 'src/spot-ai/models/video-url.model';
import { DbService } from 'src/utils/services/db/db.service';
export declare class YoutubeCaptionsService {
    private configService;
    private db;
    constructor(configService: ConfigService, db: DbService);
    transcribe(video: VideoUrl): Promise<boolean>;
    private xmlToJson;
    private getCaptionsListSrt;
    private extractEnglishSrt;
}
