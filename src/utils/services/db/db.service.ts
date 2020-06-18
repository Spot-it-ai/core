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

  deleteVideo(id: string) {
    try {
      this.db.loadCollections([this.VIDEO_LIST]);
      let video = this.db[this.VIDEO_LIST].findOne({_id: id});
      let transcription = this.VIDEO_TRANSCRIPTIONS + video.id;
      this.db[this.VIDEO_LIST].remove({_id: id});
      this.db.loadCollections([transcription]);
      return this.db[transcription].remove();
    }
    catch (e) {
      console.log(e);
    }
  }

  saveVideoUrl(url: Url) {
    try {
      this.db.loadCollections([this.VIDEO_LIST]);
      let urlObj = new VideoUrl();
      urlObj.setUrl(url.getUrl())
      if (!this.db[this.VIDEO_LIST].findOne(urlObj)) {
        return this.db[this.VIDEO_LIST].save(url);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  getAllVideos() {
    try {
      this.db.loadCollections([this.VIDEO_LIST]);
      return this.db[this.VIDEO_LIST].find();
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

  findTotalCountofTranscriptions(videoId: string): number {
    try {
      let collection = this.VIDEO_TRANSCRIPTIONS + videoId;
      this.db.loadCollections([collection]);
      return this.db[collection].count();
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
