import { Module, HttpModule } from '@nestjs/common';
import { ExternalApiController } from './controllers/external-api/external-api.controller';
import { ApiManagerService } from './services/api-manager/api-manager.service';
import { UtilsModule } from 'src/utils/utils.module';
import { SearchResultsScrapperService } from './services/search-results-scrapper/search-results-scrapper.service';
import { YoutubeCaptionsService } from './services/youtube-captions/youtube-captions.service';
import { YoutubeSearchService } from './services/youtube-search/youtube-search.service';
import { JwtTokenService } from './services/jwt-token/jwt-token.service';
import { AuthGuard } from './services/auth.guard';

@Module({
  imports: [UtilsModule, HttpModule],
  controllers: [ExternalApiController],
  providers: [
    ApiManagerService,
    SearchResultsScrapperService,
    YoutubeCaptionsService,
    YoutubeSearchService,
    JwtTokenService,
    AuthGuard
  ],
})
export class SpotAiModule {}
