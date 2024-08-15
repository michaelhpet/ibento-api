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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    console.log('error that occured', exception);
    response.status(status).json({
      status: status >= 500 ? 'error' : 'fail',
      message: exception.message,
      data: null,
    });
  }
}

async function main() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1', { exclude: ['/'] });
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

  const config = new DocumentBuilder()
    .setTitle('ibento API')
    .setDescription(
      'REST API server for ibento, an event ticketing platform that lets creators and organisers schedule events and invite local and international guests seamlessly',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('users')
    .addTag('events')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_, methodKey) => methodKey,
  });
  SwaggerModule.setup('/api/v1/docs', app, document, {
    customSiteTitle: 'ibento API',
    jsonDocumentUrl: '/api/v1/docs/json',
  });

  await app.listen(8080);
}
main();
