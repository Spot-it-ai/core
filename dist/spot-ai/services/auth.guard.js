"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_token_service_1 = require("./jwt-token/jwt-token.service");
let AuthGuard = (() => {
    let AuthGuard = class AuthGuard {
        constructor(configService, jwtToken) {
            this.config = configService;
            this.jwtToken = jwtToken;
        }
        canActivate(context) {
            return this.validateToken(context);
        }
        validateToken(context) {
            try {
                let request = context.switchToHttp().getRequest();
                let authHeader = request.headers.authorization;
                if (authHeader) {
                    let secret = this.config.get("TOKEN_SECRET");
                    let token = authHeader.split(" ")[1];
                    if (token) {
                        let decodedObj = this.jwtToken.verify(token, secret);
                        if (decodedObj) {
                            return true;
                        }
                    }
                    return false;
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    AuthGuard = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [config_1.ConfigService, jwt_token_service_1.JwtTokenService])
    ], AuthGuard);
    return AuthGuard;
})();
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map