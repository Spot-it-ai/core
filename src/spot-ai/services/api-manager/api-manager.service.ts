import { Injectable, HttpService } from '@nestjs/common';
import * as fs from "fs";
import * as childProcess from "child_process";
import * as stemmer from 'stemmer';
import { DbService } from 'src/utils/services/db/db.service';
import { VideoUrlDto } from 'src/spot-ai/dto/video-url.dto';
import { VideoUrl } from 'src/spot-ai/models/video-url.model';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from 'src/spot-ai/models/api-response.model';
import { Data } from 'src/spot-ai/models/data.model';
import { SearchResultsScrapperService } from '../search-results-scrapper/search-results-scrapper.service';

@Injectable()
export class ApiManagerService {
  private dbService: DbService;
  private configService: ConfigService;
  private http: HttpService;
  private webSearch: SearchResultsScrapperService;

  constructor(
    dbService: DbService,
    configService: ConfigService,
    http: HttpService,
    webSearch: SearchResultsScrapperService
  ) {
    this.dbService = dbService;
    this.configService = configService;
    this.http = http;
    this.webSearch = webSearch;
  }

  async searchQuery(query: string): Promise<ApiResponse> {
    if (query) {
      let apiResponse = new ApiResponse();
      let dataResponse = new Data();
      try {
        let correctQuery = await this.spellCheck(query);
        let searchQuery = correctQuery?.suggestion ?? query;
        let witAiResponse = await this.queryWitAi(searchQuery);
        let witProcessed = this.processWitAiResponse(witAiResponse);

        let matchedVideos = this.findVideosMatchingSearch(witProcessed);

        console.log(matchedVideos);

        // @todo uncomment when needed to avoid hitting bing unnecessarily
        // let webSearchResults = await this.webSearch.search(searchQuery);
        // dataResponse.setWebResults(webSearchResults);

        apiResponse.setData(dataResponse);
        return apiResponse;
      }
      catch (e) {
        console.log(e);
      }
    }
    else {
      // error
    }
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

  private processWitAiResponse(res: any) {
    if (res) {
      let entities = res?.entities;
      if (entities["topic:topic"] && entities["course:course"]) {
        let topic = entities["topic:topic"][0]?.value;
        let course = entities["course:course"][0]?.value;
        return {
          topic: stemmer(topic),
          course: stemmer(course)
        }
      }
    }

    return null;
  }

  private findVideosMatchingSearch(query: any) {
    let videos = this.dbService.findAllVideos();
    let resultVideos = []

    videos.forEach((video: VideoUrlDto) => {
      let title = video.title;
      if (title.includes(query.topic) || title.includes(query.course)) {
        resultVideos.push(video);
      }
    });

    return resultVideos;
  }

  // @note: Keep this as backup
  // private webSearch(query: string): Promise<any> {
  //   let url = this.configService.get<string>("WEB_SEARCH_API_URL");
  //   let token = this.configService.get<string>("WEB_SEARCH_API_KEY");
  //   let queryUrl = url + query.trim();
  //   let headers = {
  //     "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
  //     "x-rapidapi-key": token,
  //     "useQueryString": true
  //   };
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .get(queryUrl, {headers: headers})
  //       .subscribe((res: any) => {
  //         resolve(res.data);
  //       })
  //   });
  // }

  private spellCheck(query: string): Promise<any> {
    let url = this.configService.get<string>("SPELL_CHECK_API_URL");
    let token = this.configService.get<string>("SPELL_CHECK_API_KEY");
    let queryUrl = url + query.trim();
    let headers = {
      "x-rapidapi-host": "montanaflynn-spellcheck.p.rapidapi.com",
      "x-rapidapi-key": token,
      "useQueryString": true
    };
    return new Promise((resolve, reject) => {
      this.http
        .get(queryUrl, {headers: headers})
        .subscribe((res: any) => {
          resolve(res.data);
        })
    });
  }

  private queryWitAi(query: string): Promise<any>{
    let url = this.configService.get<string>("WIT_AI_API_URL");
    let token = this.configService.get<string>("WIT_AI_API_KEY");
    let queryUrl = url + query.trim();
    let headers = {"Authorization": "Bearer " + token};
    return new Promise((resolve, reject) => {
      this.http
        .get(queryUrl, {headers: headers})
        .subscribe((res: any) => {
          resolve(res.data);
        })
    });
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
