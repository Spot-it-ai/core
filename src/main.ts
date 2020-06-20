import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    { cors: { origin: ["http://127.0.0.1:3000", "https://spot-it.surge.sh"] }}
  );
  await app.listen(( process.env.PORT || 3001 ));
}
bootstrap();
