import { Controller, Post, Body } from '@nestjs/common';
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
}
