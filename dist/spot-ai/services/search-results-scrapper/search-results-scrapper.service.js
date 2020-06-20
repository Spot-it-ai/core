"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResultsScrapperService = void 0;
const common_1 = require("@nestjs/common");
const web_result_model_1 = require("../../models/web-result.model");
const config_1 = require("@nestjs/config");
const jsdom_1 = require("jsdom");
const fetch = require("node-fetch");
let SearchResultsScrapperService = (() => {
    let SearchResultsScrapperService = class SearchResultsScrapperService {
        constructor(configService) {
            this.ADS_ELEMENT_CLASS = ".b_ad";
            this.RESULT_CLASS = "li.b_algo";
            this.TITLES_CLASS = "h2";
            this.URL_CLASS = "a";
            this.DESCRIPTION_CLASS = "p";
            this.configService = configService;
        }
        async search(query) {
            try {
                let searchResults = await this.getResultsFromSearchEngine(query);
                let results = searchResults ? this.extractResults(searchResults) : null;
                return results;
            }
            catch (e) {
                console.log(e);
            }
        }
        getResultsFromSearchEngine(query) {
            try {
                let url = this.configService.get("SEARCH_ENGINE_URL");
                let queryUrl = url + query.replace(" ", "+");
                let headers = {
                    "Accept-Language": "en-US,en;",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept": "test/html,application/xhtml+xml,\
        application/xml;q=0.9,*/*;q=0.8",
                    "Referer": "https://www.bing.com/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) \
        AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
                };
                return new Promise((resolve, reject) => {
                    fetch(queryUrl, { headers: headers })
                        .then((res) => res.text())
                        .then(res => resolve(res));
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        extractResults(domResult) {
            var _a;
            let parser = new jsdom_1.JSDOM(domResult);
            let doc = (_a = parser === null || parser === void 0 ? void 0 : parser.window) === null || _a === void 0 ? void 0 : _a.document;
            let ads = doc === null || doc === void 0 ? void 0 : doc.querySelector(this.ADS_ELEMENT_CLASS);
            if (ads) {
                ads.remove();
            }
            let webResults = [];
            let results = doc.querySelectorAll(this.RESULT_CLASS);
            results.forEach((result) => {
                var _a, _b, _c;
                let title = (_a = result.querySelector(this.TITLES_CLASS)) === null || _a === void 0 ? void 0 : _a.textContent;
                let url = (_b = result.querySelector(this.URL_CLASS)) === null || _b === void 0 ? void 0 : _b.href;
                let description = (_c = result.querySelector(this.DESCRIPTION_CLASS)) === null || _c === void 0 ? void 0 : _c.textContent;
                webResults.push(new web_result_model_1.WebResult(title, url, description));
            });
            return webResults;
        }
    };
    SearchResultsScrapperService = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [config_1.ConfigService])
    ], SearchResultsScrapperService);
    return SearchResultsScrapperService;
})();
exports.SearchResultsScrapperService = SearchResultsScrapperService;
//# sourceMappingURL=search-results-scrapper.service.js.map