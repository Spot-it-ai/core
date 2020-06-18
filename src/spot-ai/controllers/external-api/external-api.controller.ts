import { Controller, Post, Body, Get, Query, UseGuards, Delete, Param } from '@nestjs/common';
import { ApiManagerService } from 'src/spot-ai/services/api-manager/api-manager.service';
import { VideoUrlDto } from 'src/spot-ai/dto/video-url.dto';
import { ApiResponse } from 'src/spot-ai/models/api-response.model';
import { LoginDto } from 'src/spot-ai/dto/login.dto';
import { AuthGuard } from 'src/spot-ai/services/auth.guard';

@Controller('api')
export class ExternalApiController {
  private apiManager: ApiManagerService;

  constructor(apiManager: ApiManagerService) {
    this.apiManager = apiManager;
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse> {
    return await this.apiManager.loginUser(loginDto);
  }

  @Post("video")
  @UseGuards(AuthGuard)
  saveVideoUrl(@Body() videoUrlDto: VideoUrlDto): ApiResponse {
    return this.apiManager.saveVideoUrl(videoUrlDto)
  }

  @Get("search")
  @UseGuards(AuthGuard)
  async search(@Query("query") query: string): Promise<ApiResponse> {
    return await this.apiManager.searchQuery(query);
  }

  @Get("video")
  @UseGuards(AuthGuard)
  getAllVideos(): ApiResponse {
    return this.apiManager.getAllVideos();
  }

  @Delete("video/:videoDbId")
  @UseGuards(AuthGuard)
  deleteVideos(@Param("videoDbId") videoDbId: string): ApiResponse {
    return this.apiManager.deleteVideo(videoDbId);
  }
}
