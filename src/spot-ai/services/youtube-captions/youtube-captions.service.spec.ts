import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeCaptionsService } from './youtube-captions.service';

describe('YoutubeCaptionsService', () => {
  let service: YoutubeCaptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YoutubeCaptionsService],
    }).compile();

    service = module.get<YoutubeCaptionsService>(YoutubeCaptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
