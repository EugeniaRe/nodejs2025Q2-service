// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   const configService = app.get(ConfigService);
//   const port = configService.get<number>('PORT') || 4000;

//   await app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
//   });
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggingService } from './logger/logging.service';
import { AllExceptionsFilter } from './logger/allExceptions.filter';
// import { LoggingMiddleware } from './logging/logger/logging.middleware';
import { LoggingInterceptor } from './logger/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggingService = app.get(LoggingService);

  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));

  // Global pipes and filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  // app.use((req, res, next) => {
  //   return new LoggingMiddleware(loggingService).use(req, res, next);
  // });

  await app.listen(port);
  loggingService.log(`Application is running on http://localhost:${port}`);
}
bootstrap();
