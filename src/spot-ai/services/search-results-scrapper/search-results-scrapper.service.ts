import { Injectable, HttpService } from '@nestjs/common';
import { WebResult } from 'src/spot-ai/models/web-result.model';
import { ConfigService } from '@nestjs/config';
import { JSDOM } from 'jsdom';
import * as fetch from 'node-fetch';


@Injectable()
export class SearchResultsScrapperService {

  // Duck Duck Go
  private readonly ADS_ELEMENT_CLASS = ".b_ad";
  private readonly RESULT_CLASS = "li.b_algo";
  private readonly TITLES_CLASS = "h2";
  private readonly URL_CLASS = "a";
  private readonly DESCRIPTION_CLASS = "p";

  private configService: ConfigService;
  private http: HttpService;

  constructor(configService: ConfigService, http: HttpService) {
    this.configService = configService;
    this.http = http;
  }

  async search(query: string): Promise<WebResult[]> {
    try {
      let searchResults = await this.getResultsFromSearchEngine(query);
      return this.extractResults(searchResults);
    }
    catch (e) {
      console.log(e);
    }
  }

  // @ref: https://blog.bitsrc.io/how-to-perform-web-scraping-using-node-js-part-2-7a365aeedb43
  private getResultsFromSearchEngine(query: string): Promise<any> {
    try {
      let url = this.configService.get<string>("SEARCH_ENGINE_URL");
      let queryUrl = url + query.replace(" ", "+");
      // @ref: https://oxylabs.io/blog/5-key-http-headers-for-web-scraping
      let headers = {
        "Accept-Language": "en-US,en;",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "test/html,application/xhtml+xml,\
        application/xml;q=0.9,*/*;q=0.8",
        "Referer": "http://www.google.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) \
        AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
      }

      return new Promise((resolve, reject) => {
        fetch(queryUrl, {headers: headers})
        .then((res) => res.text())
        .then(res => resolve(res));
      })
    }
    catch(e) {
      console.log(e);
    }
  }

  // @ref: https://stackoverflow.com/a/47809709
  private extractResults(domResult: string): WebResult[] {
    let parser = new JSDOM(domResult);
    let doc = parser?.window?.document;
    let ads = doc?.querySelector(this.ADS_ELEMENT_CLASS);
    if (ads) {
      ads.remove();
    }
    let webResults = [];
    let results = doc.querySelectorAll(this.RESULT_CLASS);
    results.forEach((result: HTMLElement) => {
      let title = result.querySelector(this.TITLES_CLASS)?.textContent;
      // @ts-ignore
      let url = result.querySelector(this.URL_CLASS)?.href;
      let description =
        result.querySelector(this.DESCRIPTION_CLASS)?.textContent;

      webResults.push(new WebResult(title, url, description));
    });

    return webResults;
  }
}
