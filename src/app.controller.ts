import { Controller, Get, Redirect, UseInterceptors } from '@nestjs/common';
import { Public } from './utils/functions';
import { ApiExcludeController } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@ApiExcludeController()
@Controller()
export class AppController {
  @Public()
  @Get()
  @Redirect('/api/v1/docs', 301)
  getHello() {
    return null;
  }
}
