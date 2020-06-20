"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
let JwtTokenService = (() => {
    let JwtTokenService = class JwtTokenService {
        sign(payload, secret) {
            return jwt.sign(payload, secret, {
                algorithm: "HS512",
                expiresIn: "10h",
            });
        }
        verify(token, secret) {
            try {
                return jwt.verify(token, secret);
            }
            catch (e) {
                return null;
            }
        }
    };
    JwtTokenService = __decorate([
        common_1.Injectable()
    ], JwtTokenService);
    return JwtTokenService;
})();
exports.JwtTokenService = JwtTokenService;
//# sourceMappingURL=jwt-token.service.js.map