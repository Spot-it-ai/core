import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as diskDb from 'diskdb';
import { Url } from 'src/utils/interfaces/url.interface';
import { VideoUrl } from 'src/spot-ai/models/video-url.model';

@Injectable()
export class DbService {
  private db: any;

  constructor(configService: ConfigService) {
    this.db = diskDb.connect(configService.get<string>("DB_PATH"));
  }

  saveVideoUrl(url: Url): void {
    try {
      this.db.loadCollections(["videos"]);
      let urlObj = new VideoUrl();
      urlObj.setUrl(url.getUrl())
      if (!this.db.videos.findOne(urlObj)) {
        this.db.videos.save(url);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

}
