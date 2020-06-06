import { Meta } from "./meta.model";
import { Data } from "./data.model";

export class ApiResponse {
  private meta: Meta;

  private data: Data;

  constructor(data?: Data, meta?: Meta) {
    this.meta = meta ?? new Meta();
    this.data = data ?? new Data();
  }

  setData(data: Data): void {
    this.data = data;
  }
}
