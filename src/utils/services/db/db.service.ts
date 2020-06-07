import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as diskDb from 'diskdb';
import { Url } from 'src/utils/interfaces/url.interface';
import { VideoUrl } from 'src/spot-ai/models/video-url.model';

@Injectable()
export class DbService {

  private readonly VIDEO_LIST = "videos";
  private readonly VIDEO_TRANSCRIPTIONS = "/transcriptions/";
  private db: any;

  constructor(configService: ConfigService) {
    this.db = diskDb.connect(configService.get<string>("DB_PATH"));
  }

  saveVideoUrl(url: Url): void {
    try {
      this.db.loadCollections([this.VIDEO_LIST]);
      let urlObj = new VideoUrl();
      urlObj.setUrl(url.getUrl())
      if (!this.db.videos.findOne(urlObj)) {
        return this.db.videos.save(url);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  saveVideoTranscription(videoId: string, json: any): void {
    try {
      let collection = this.VIDEO_TRANSCRIPTIONS + videoId;
      this.db.loadCollections([collection]);
      return this.db[collection].save(json);
    }
    catch (e) {
      console.log(e);
    }
  }

  findVideoTranscriptions(videoId: string): any[] {
    try {
      let collection = this.VIDEO_TRANSCRIPTIONS + videoId;
      this.db.loadCollections([collection]);
      return this.db[collection].find();
    }
    catch (e) {
      console.log(e);
    }
  }

  findAllVideos() {
    try {
      this.db.loadCollections([this.VIDEO_LIST]);
      return this.db.videos.find();
    }
    catch (e) {
      console.log(e);
    }
  }
}
