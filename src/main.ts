import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    response.status(status).json({
      status: status >= 500 ? 'error' : 'fail',
      message: exception.message,
      data: null,
    });
  }
}

async function main() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const message =
          errors[0].constraints?.[Object.keys(errors[0].constraints)[0]] ||
          'Bad request';
        return new BadRequestException({
          status: 'fail',
          message,
          data: null,
        });
      },
    }),
  );
  app.useGlobalFilters(new AppExceptionFilter());
  await app.listen(8080);
}
main();
