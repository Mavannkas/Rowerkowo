import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  console.log("app running on " + process.env.PORT || 3000);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
