import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:5173', // dev local
      'https://1-demo-project-front-react-git-main-sebastienchapperts-projects.vercel.app',
    ], // A adpater au front React
    credentials: true, // autorise les cookies pour setter le JWT http-only
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
