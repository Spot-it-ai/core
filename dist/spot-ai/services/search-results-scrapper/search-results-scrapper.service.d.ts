import { WebResult } from 'src/spot-ai/models/web-result.model';
import { ConfigService } from '@nestjs/config';
export declare class SearchResultsScrapperService {
    private readonly ADS_ELEMENT_CLASS;
    private readonly RESULT_CLASS;
    private readonly TITLES_CLASS;
    private readonly URL_CLASS;
    private readonly DESCRIPTION_CLASS;
    private configService;
    constructor(configService: ConfigService);
    search(query: string): Promise<WebResult[]>;
    private getResultsFromSearchEngine;
    private extractResults;
}
