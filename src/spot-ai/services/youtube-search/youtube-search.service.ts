import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Video } from 'src/spot-ai/models/video.model';

@Injectable()
export class YoutubeSearchService {
  private configService: ConfigService;
  private http: HttpService;

  constructor(configService: ConfigService, http: HttpService) {
    this.configService = configService;
    this.http = http;
  }

  async searchYoutube(query: string): Promise<Video[]> {
    let endpoint = this.configService.get<string>("YOUTUBE_SEARCH_ENDPOINT");
    endpoint += query;
    return await this.getAndProcess(endpoint);
  }

  private async getAndProcess(endpoint: string): Promise<Video[]> {
    let results = await this.getResults(endpoint);
    let items: any[] = (results as any).items;
    let op: Video[] = [];
    items.forEach((item: any) => {
      let id = item?.id?.videoId;
      let url = "https://www.youtube.com/watch?v=" + id;
      let description = item?.snippet?.description;
      let title = item?.snippet?.title;
      let thumbnails = item?.snippet?.thumbnails;
      let channelTitle = item?.snippet?.channelTitle;
      let publishTime = item?.snippet?.publishTime;
      let v = new Video(title, url, id);
      v.setDescription(description);
      v.setThumbnails(thumbnails);
      v.setChannelName(channelTitle);
      v.setPublishTime(publishTime);
      op.push(v);
    });

    return op;
  }

  private getResults(endpoint: string): any {
    return new Promise((resolve, reject) => {
      this.http
        .get(endpoint)
        .subscribe((res: any) => {
          resolve(res.data);
        })
    });
  }
}
