import { Module, HttpModule } from '@nestjs/common';
import { ExternalApiController } from './controllers/external-api/external-api.controller';
import { ApiManagerService } from './services/api-manager/api-manager.service';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [UtilsModule, HttpModule],
  controllers: [ExternalApiController],
  providers: [ApiManagerService],
})
export class SpotAiModule {}
