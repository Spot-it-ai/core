import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiManagerService } from 'src/spot-ai/services/api-manager/api-manager.service';
import { VideoUrlDto } from 'src/spot-ai/dto/video-url.dto';
import { ApiResponse } from 'src/spot-ai/models/api-response.model';

@Controller('api')
export class ExternalApiController {
  private apiManager: ApiManagerService;

  constructor(apiManager: ApiManagerService) {
    this.apiManager = apiManager;
  }

  @Post("video")
  saveVideoUrl(@Body() videoUrlDto: VideoUrlDto): ApiResponse {
    return this.apiManager.saveVideoUrl(videoUrlDto)
  }

  @Get("search")
  async search(@Query("query") query: string): Promise<ApiResponse> {
    return await this.apiManager.searchQuery(query);
  }

  @Get("video")
  getAllVideos(): ApiResponse {
    return this.apiManager.getAllVideos();
  }
}
