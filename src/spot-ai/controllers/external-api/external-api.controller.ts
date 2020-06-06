import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiManagerService } from 'src/spot-ai/services/api-manager/api-manager.service';
import { VideoUrlDto } from 'src/spot-ai/dto/video-url.dto';

@Controller('api')
export class ExternalApiController {
  private apiManager: ApiManagerService;

  constructor(apiManager: ApiManagerService) {
    this.apiManager = apiManager;
  }

  @Post("video-url")
  saveVideoUrl(@Body() videoUrlDto: VideoUrlDto): void {
    return this.apiManager.saveVideoUrl(videoUrlDto)
  }

  @Get("search")
  async search(@Query("query") query: string): Promise<any> {
    return await this.apiManager.searchQuery(query);
  }
}
