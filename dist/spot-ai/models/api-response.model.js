"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const meta_model_1 = require("./meta.model");
const data_model_1 = require("./data.model");
class ApiResponse {
    constructor(data, meta) {
        this.meta = meta !== null && meta !== void 0 ? meta : new meta_model_1.Meta();
        this.data = data !== null && data !== void 0 ? data : new data_model_1.Data();
    }
    setData(data) {
        this.data = data;
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response.model.js.map