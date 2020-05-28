import { Injectable } from '@nestjs/common';
import { DbService } from 'src/utils/services/db/db.service';
import { VideoUrlDto } from 'src/spot-ai/dto/video-url.dto';
import { VideoUrl } from 'src/spot-ai/models/video-url.model';

@Injectable()
export class ApiManagerService {
  private dbService: DbService;

  constructor(dbService: DbService) {
    this.dbService = dbService;
  }

  saveVideoUrl(urlDto: VideoUrlDto): void {
    if (urlDto.title.trim() && urlDto.url.trim()) {
      let videoUrl = new VideoUrl();
      videoUrl.setUrl(urlDto.url.trim());
      videoUrl.setTitle(urlDto.title.trim());
      try {
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
}
