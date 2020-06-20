import { ApiManagerService } from 'src/spot-ai/services/api-manager/api-manager.service';
import { VideoUrlDto } from 'src/spot-ai/dto/video-url.dto';
import { ApiResponse } from 'src/spot-ai/models/api-response.model';
import { LoginDto } from 'src/spot-ai/dto/login.dto';
export declare class ExternalApiController {
    private apiManager;
    constructor(apiManager: ApiManagerService);
    login(loginDto: LoginDto): Promise<ApiResponse>;
    saveVideoUrl(videoUrlDto: VideoUrlDto): ApiResponse;
    search(query: string): Promise<ApiResponse>;
    getAllVideos(): ApiResponse;
    deleteVideos(videoDbId: string): ApiResponse;
}
