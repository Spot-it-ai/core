import { Meta } from "./meta.model";
import { Data } from "./data.model";
export declare class ApiResponse {
    private meta;
    private data;
    constructor(data?: Data, meta?: Meta);
    setData(data: Data): void;
}
