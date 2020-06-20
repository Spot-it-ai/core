"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotAiModule = void 0;
const common_1 = require("@nestjs/common");
const external_api_controller_1 = require("./controllers/external-api/external-api.controller");
const api_manager_service_1 = require("./services/api-manager/api-manager.service");
const utils_module_1 = require("../utils/utils.module");
const search_results_scrapper_service_1 = require("./services/search-results-scrapper/search-results-scrapper.service");
const youtube_captions_service_1 = require("./services/youtube-captions/youtube-captions.service");
const youtube_search_service_1 = require("./services/youtube-search/youtube-search.service");
const jwt_token_service_1 = require("./services/jwt-token/jwt-token.service");
const auth_guard_1 = require("./services/auth.guard");
let SpotAiModule = (() => {
    let SpotAiModule = class SpotAiModule {
    };
    SpotAiModule = __decorate([
        common_1.Module({
            imports: [utils_module_1.UtilsModule, common_1.HttpModule],
            controllers: [external_api_controller_1.ExternalApiController],
            providers: [
                api_manager_service_1.ApiManagerService,
                search_results_scrapper_service_1.SearchResultsScrapperService,
                youtube_captions_service_1.YoutubeCaptionsService,
                youtube_search_service_1.YoutubeSearchService,
                jwt_token_service_1.JwtTokenService,
                auth_guard_1.AuthGuard
            ],
        })
    ], SpotAiModule);
    return SpotAiModule;
})();
exports.SpotAiModule = SpotAiModule;
//# sourceMappingURL=spot-ai.module.js.map