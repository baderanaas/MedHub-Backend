import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
      exceptionFactory: (errors) =>
        errors.map((error) => ({
          field: error.property,
          messages: Object.values(error.constraints),
        })),
    }),
  );
  app.enableCors({
    origin: 'http://localhost:4200', // The URL of your Angular frontend
    methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
    credentials: true, // Allow credentials (if needed, like cookies or authorization headers)
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();