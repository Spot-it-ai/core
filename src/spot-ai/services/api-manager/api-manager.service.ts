import { Injectable, HttpService } from '@nestjs/common';
import * as fs from "fs";
import * as childProcess from "child_process";
import * as argon2 from "argon2";
import * as stemmer from 'stemmer';
import { DbService } from 'src/utils/services/db/db.service';
import { VideoUrlDto } from 'src/spot-ai/dto/video-url.dto';
import { VideoUrl } from 'src/spot-ai/models/video-url.model';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from 'src/spot-ai/models/api-response.model';
import { Data } from 'src/spot-ai/models/data.model';
import { SearchResultsScrapperService } from '../search-results-scrapper/search-results-scrapper.service';
import { YoutubeCaptionsService } from '../youtube-captions/youtube-captions.service';
import { Video } from 'src/spot-ai/models/video.model';
import { YoutubeSearchService } from '../youtube-search/youtube-search.service';
import { LoginDto } from 'src/spot-ai/dto/login.dto';
import { JwtTokenService } from '../jwt-token/jwt-token.service';

@Injectable()
export class ApiManagerService {
  private dbService: DbService;
  private configService: ConfigService;
  private http: HttpService;
  private webSearch: SearchResultsScrapperService;
  private youtubeCaptions: YoutubeCaptionsService;
  private youtubeSearch: YoutubeSearchService;
  private jwtToken: JwtTokenService;

  constructor(
    dbService: DbService,
    configService: ConfigService,
    http: HttpService,
    webSearch: SearchResultsScrapperService,
    youtubeCaptions: YoutubeCaptionsService,
    youtubeSearch: YoutubeSearchService,
    jwtToken: JwtTokenService
  ) {
    this.dbService = dbService;
    this.configService = configService;
    this.http = http;
    this.webSearch = webSearch;
    this.youtubeCaptions = youtubeCaptions;
    this.youtubeSearch = youtubeSearch;
    this.jwtToken = jwtToken;
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

        if (witProcessed) {
          console.log(witProcessed);
          let shortenedQuery = witProcessed.topic + " " + witProcessed.course;
          let matchedVideos = this.findVideosMatchingSearch(witProcessed);

          let lectureVideos =
              this.findQueryInVideoTranscriptions(witProcessed, matchedVideos);
          dataResponse.setLectureVideos(lectureVideos);

          // @todo uncomment when needed to avoid hitting bing unnecessarily
          let webSearchResults = await this.webSearch.search(shortenedQuery);
          dataResponse.setWebResults(webSearchResults);


          let youtubeResults = await this.youtubeSearch.searchYoutube(
            shortenedQuery
          );
          dataResponse.setYoutuubeResults(youtubeResults);

          apiResponse.setData(dataResponse);
          return apiResponse;
        }
        else {
          // show error
        }
      }
      catch (e) {
        console.log(e);
      }
    }
    else {
      // error
    }
  }

  deleteVideo(id: string): ApiResponse {
    let apiResponse = new ApiResponse();
    try {
      console.log(id);
      if (this.dbService.deleteVideo(id)) {
        apiResponse.setData(null);
        return apiResponse;
      }
      else {
        return null;
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  getAllVideos(): ApiResponse {
    let apiResponse = new ApiResponse();
    let dataResponse = new Data();
    try {
      let res = [];
      let videos = this.dbService.findAllVideos();
      videos.forEach((v: any) => {
        let video = new VideoUrl(v.title, v.url, v.id, v._id);
        res.push(video);
      })
      dataResponse.setAllVideos(res);
      apiResponse.setData(dataResponse);
      return apiResponse;
    }
    catch (e) {
      console.log(e);
    }
  }

  async loginUser(loginDto: LoginDto): Promise<ApiResponse> {
    let apiResponse = new ApiResponse();
    let dataResponse = new Data();
    if (loginDto.username && loginDto.password) {
      if (await this.validatePwd(loginDto.password)) {
        let secret = this.configService.get<string>("TOKEN_SECRET");
        let username = this.configService.get<string>("USERNAME");
        let token = this.jwtToken.sign(
          { user: username},
          secret
        )
        dataResponse.setToken(token);
        apiResponse.setData(dataResponse);
        return apiResponse;
      }
      else {
        return null;
      }
    }
    else {
      return null;
    }
  }

  saveVideoUrl(urlDto: VideoUrlDto): ApiResponse {
    if (urlDto.title.trim() && urlDto.url.trim()) {
      let videoUrl = new VideoUrl(
        urlDto.title.trim(),
        urlDto.url.trim(),
        this.getVideoId(urlDto.url.trim())
      );
      let apiResponse = new ApiResponse();
      let dataResponse = new Data();

      try {
        if (this.youtubeCaptions.transcribe(videoUrl)) {
          if (this.dbService.saveVideoUrl(videoUrl)) {
            return apiResponse;
          }
        }
      }
      catch (e) {
        console.log(e);
      }
    }
    else {
      // error
    }
  }

  private async validatePwd(password: string): Promise<boolean> {
    try {
      let hash = this.configService.get<string>("PASSWORD");
      return await argon2.verify(hash, password);
    }
    catch (e) {
      console.log(e);
    }
  }

  private processWitAiResponse(res: any) {
    if (res) {
      let entities = res?.entities;
      if (entities["topic:topic"] && entities["course:course"]) {
        let topic = entities["topic:topic"][0]?.value;
        let course = entities["course:course"][0]?.value;
        return {
          stemmed : {
            topic: stemmer(topic.toLowerCase()),
            course: stemmer(course.toLowerCase()),
          },
          topic: topic.toLowerCase(),
          course: course.toLowerCase(),
        }
      }
    }

    return null;
  }

  private findQueryInVideoTranscriptions(
    query: any,
    videos: VideoUrlDto[]
  ): Video[]
  {
    let videosResult = [];
    videos.forEach((video: VideoUrlDto) => {
      let v = new Video(video.title, video.url, video.id);
      let transcriptions = this.dbService.findVideoTranscriptions(video.id);
      let lastFind = Number(transcriptions[0]?.$?.start?.split(".")[0]);
      if (lastFind <= 300) {
        // if video is less than 5 mins long, then watch full
        v.setWatchFull(true);
        videosResult.push(v);
      }
      else {
        let lastFindDiff = 300; // 5 minutes
        transcriptions.forEach((transcription: any) => {
          let time = transcription?.$?.start?.split(".")[0];
          if (transcription?._?.toLowerCase()?.includes(query?.stemmed?.topic) &&
              Number(time) < lastFind
            ) {
              lastFind = Number(time) - lastFindDiff;
            v.addStartTime(Number(time));
          }
        });

        if (v.getStartTime().length > 0) {
          let total = this.dbService.findTotalCountofTranscriptions(video.id);
          // console.log(total);
          // console.log(v.getStartTime().length)
          // console.log(v.getStartTime().length / total);
          v.getStartTime().sort();
          if (v.getStartTime().length / total > 0.20) {
            // watch full video if more than 15% of the transcriptions match
            v.setWatchFull(true);
          }
          videosResult.push(v);
        }
      }
    });

    return videosResult;
  }

  private findVideosMatchingSearch(query: any) {
    let videos = this.dbService.findAllVideos();
    let resultVideos = []
    videos.forEach((video: VideoUrlDto) => {
      let stemmed = query?.stemmed;
      let title = video.title.toLowerCase().replace(/[:-;|_@(),]/g, "");
      if (title.includes(stemmed?.topic) || title.includes(stemmed?.course)) {
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
