"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meta = void 0;
class Meta {
    constructor(version, code, message) {
        this.code = code !== null && code !== void 0 ? code : 200;
        this.message = message !== null && message !== void 0 ? message : "success";
        this.version = version !== null && version !== void 0 ? version : "";
    }
}
exports.Meta = Meta;
//# sourceMappingURL=meta.model.js.map