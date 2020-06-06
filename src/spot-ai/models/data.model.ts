import { WebResult } from "./web-result.model";

export class Data {
  private webResults: WebResult[];

  constructor() {
    this.webResults = [];
  }

  setWebResults(results: WebResult[]): void {
    this.webResults = results;
  }
}
