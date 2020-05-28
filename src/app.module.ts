import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from './utils/utils.module';
import { SpotAiModule } from './spot-ai/spot-ai.module';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true
  }),
  UtilsModule,
  SpotAiModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
