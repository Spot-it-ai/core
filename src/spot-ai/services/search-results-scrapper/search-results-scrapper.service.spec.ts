import { Test, TestingModule } from '@nestjs/testing';
import { SearchResultsScrapperService } from './search-results-scrapper.service';

describe('SearchResultsScrapperService', () => {
  let service: SearchResultsScrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchResultsScrapperService],
    }).compile();

    service = module.get<SearchResultsScrapperService>(SearchResultsScrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
