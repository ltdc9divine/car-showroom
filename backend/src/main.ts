import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS (production + local)
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://your-app.vercel.app" // 👉 sửa lại sau khi deploy frontend
    ],
    credentials: true,
  });

  // ✅ Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ PORT chuẩn cho Render/Railway
  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚗 Server running on port ${port}`);
}

bootstrap();