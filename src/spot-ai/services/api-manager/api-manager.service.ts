import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as childProcess from "child_process";
import { DbService } from 'src/utils/services/db/db.service';
import { VideoUrlDto } from 'src/spot-ai/dto/video-url.dto';
import { VideoUrl } from 'src/spot-ai/models/video-url.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiManagerService {
  private dbService: DbService;
  private configService: ConfigService;

  constructor(dbService: DbService, configService: ConfigService) {
    this.dbService = dbService;
    this.configService = configService;
  }

  saveVideoUrl(urlDto: VideoUrlDto): void {
    if (urlDto.title.trim() && urlDto.url.trim()) {
      let videoUrl = new VideoUrl();
      videoUrl.setUrl(urlDto.url.trim());
      videoUrl.setTitle(urlDto.title.trim());
      try {
        this.transcribeVideo(videoUrl.getUrl());
        return this.dbService.saveVideoUrl(videoUrl);
      }
      catch (e) {
        console.log(e);
      }
    }
    else {
      // error
    }
  }

  private transcribeVideo(url: string): void {
    let videoId = this.getVideoId(url);
    if (!this.hasVideoAlreadyTranscribed(videoId)) {
      try {
        childProcess.spawn("python", ["./transcribe.py", videoId]);
      }
      catch (e) {
        console.log(e);
      }
    }
  }

  private hasVideoAlreadyTranscribed(videoId: string): boolean {
    let path = this.configService.get<string>("DB_PATH") + "/transcriptions";
    // @reF: https://stackoverflow.com/a/2727191
    fs.readdirSync(path).forEach((file) => {
      let fileName = file.substring(0, file.indexOf(".json"));
      if (fileName === videoId) {
        return true;
      }
    })
    return false;
  }

  private getVideoId(url: string): string {
    try {
      // @ref: https://stackoverflow.com/a/3452617
      let videoId = url.split("v=")[1];
      let ampersandPos = videoId.indexOf("&");
      if (ampersandPos != -1) {
        videoId = videoId.substring(0, ampersandPos);
      }

      return videoId;
    }
    catch (e) {
      return null;
    }
  }
}
