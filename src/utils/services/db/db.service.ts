import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as diskDb from 'diskdb';
import { Url } from 'src/utils/interfaces/url.interface';
import { VideoUrl } from 'src/spot-ai/models/video-url.model';

@Injectable()
export class DbService {

  private readonly VIDEO_LIST = "videos";
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
