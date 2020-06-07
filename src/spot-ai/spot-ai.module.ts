import { Module, HttpModule } from '@nestjs/common';
import { ExternalApiController } from './controllers/external-api/external-api.controller';
import { ApiManagerService } from './services/api-manager/api-manager.service';
import { UtilsModule } from 'src/utils/utils.module';
import { SearchResultsScrapperService } from './services/search-results-scrapper/search-results-scrapper.service';
import { YoutubeCaptionsService } from './services/youtube-captions/youtube-captions.service';

@Module({
  imports: [UtilsModule, HttpModule],
  controllers: [ExternalApiController],
  providers: [
    ApiManagerService,
    SearchResultsScrapperService,
    YoutubeCaptionsService
  ],
})
export class SpotAiModule {}
