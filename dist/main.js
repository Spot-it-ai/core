"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: { origin: ["http://127.0.0.1:3000", "https://spot-it.surge.sh"] } });
    await app.listen((process.env.PORT || 3001));
}
bootstrap();
//# sourceMappingURL=main.js.map