import { Module } from '@nestjs/common';
import { DbService } from './services/db/db.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DbService],
  exports: [DbService]
})
export class UtilsModule {}
