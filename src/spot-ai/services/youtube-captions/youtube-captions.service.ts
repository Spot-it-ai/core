import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VideoUrl } from 'src/spot-ai/models/video-url.model';
import * as fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import formurlencoded from 'form-urlencoded';
import * as xml2js from 'xml2js';
import { DbService } from 'src/utils/services/db/db.service';

@Injectable()
export class YoutubeCaptionsService {

  private configService: ConfigService;
  private db: DbService;

  constructor(configService: ConfigService, db: DbService) {
    this.configService = configService;
    this.db = db;
  }

  async transcribe(video: VideoUrl): Promise<boolean> {
    try {
      let captionsList = await this.getCaptionsListSrt(video);
      let xmlSrt = captionsList ?
        await this.extractEnglishSrt(captionsList) : null;
      let jsonSrt = xmlSrt ? await this.xmlToJson(xmlSrt) : null;
      if (jsonSrt) {
        this.db.saveVideoTranscription(
          video.getVideoId(),
          jsonSrt?.transcript?.text
        );
        return true;
      }

      return false;
    }
    catch (e) {
      console.log(e);
    }
  }

  private xmlToJson(xml: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
          if (err){
            reject()
          }
          else {
            resolve(result);
          }
        })
      })
    }
    catch (e) {

    }
  }

  private getCaptionsListSrt(video: VideoUrl): Promise<any> {
    try {
      let url = this.configService.get<string>("YOUTUBE_CAPTIONS_URL");

      // @ref: https://oxylabs.io/blog/5-key-http-headers-for-web-scraping
      let headers = {
        "Accept-Language": "en-US,en;",
        // "Accept-Encoding": "gzip, deflate",
        "Accept": "test/html,application/xhtml+xml,\
        application/xml;q=0.9,*/*;q=0.8",
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": url,
        "Origin": url,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) \
        AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
      }

      return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'POST',
          headers: headers,
          body: formurlencoded({url: video.getUrl()})
        })
        .then((res) => res.text())
        .then(res => resolve(res));
      })
    }
    catch(e) {
      console.log(e);
    }
  }

  private extractEnglishSrt(domResult: string): Promise<any> {
    try {
      let parser = new JSDOM(domResult);
      let doc = parser?.window?.document;
      return new Promise((resolve, reject) => {
        doc.querySelectorAll("[name='sub_url']").forEach((b) => {
          if (b?.textContent?.toLowerCase().includes("english")) {
            if (b.value) {
              fetch(b.value)
              .then(res => res.text())
              .then(res => resolve(res))
            }
            else {
              reject()
            }
          }
        })
      })
    }
    catch (e) {
      console.log(e);
    }
  }
}
