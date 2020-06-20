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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalApiController = void 0;
const common_1 = require("@nestjs/common");
const api_manager_service_1 = require("../../services/api-manager/api-manager.service");
const video_url_dto_1 = require("../../dto/video-url.dto");
const api_response_model_1 = require("../../models/api-response.model");
const login_dto_1 = require("../../dto/login.dto");
const auth_guard_1 = require("../../services/auth.guard");
let ExternalApiController = (() => {
    let ExternalApiController = class ExternalApiController {
        constructor(apiManager) {
            this.apiManager = apiManager;
        }
        async login(loginDto) {
            return await this.apiManager.loginUser(loginDto);
        }
        saveVideoUrl(videoUrlDto) {
            return this.apiManager.saveVideoUrl(videoUrlDto);
        }
        async search(query) {
            return await this.apiManager.searchQuery(query);
        }
        getAllVideos() {
            return this.apiManager.getAllVideos();
        }
        deleteVideos(videoDbId) {
            return this.apiManager.deleteVideo(videoDbId);
        }
    };
    __decorate([
        common_1.Post("login"),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [login_dto_1.LoginDto]),
        __metadata("design:returntype", Promise)
    ], ExternalApiController.prototype, "login", null);
    __decorate([
        common_1.Post("video"),
        common_1.UseGuards(auth_guard_1.AuthGuard),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [video_url_dto_1.VideoUrlDto]),
        __metadata("design:returntype", api_response_model_1.ApiResponse)
    ], ExternalApiController.prototype, "saveVideoUrl", null);
    __decorate([
        common_1.Get("search"),
        common_1.UseGuards(auth_guard_1.AuthGuard),
        __param(0, common_1.Query("query")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], ExternalApiController.prototype, "search", null);
    __decorate([
        common_1.Get("video"),
        common_1.UseGuards(auth_guard_1.AuthGuard),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", api_response_model_1.ApiResponse)
    ], ExternalApiController.prototype, "getAllVideos", null);
    __decorate([
        common_1.Delete("video/:videoDbId"),
        common_1.UseGuards(auth_guard_1.AuthGuard),
        __param(0, common_1.Param("videoDbId")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", api_response_model_1.ApiResponse)
    ], ExternalApiController.prototype, "deleteVideos", null);
    ExternalApiController = __decorate([
        common_1.Controller('api'),
        __metadata("design:paramtypes", [api_manager_service_1.ApiManagerService])
    ], ExternalApiController);
    return ExternalApiController;
})();
exports.ExternalApiController = ExternalApiController;
//# sourceMappingURL=external-api.controller.js.map