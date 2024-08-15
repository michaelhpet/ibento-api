import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from './utils/functions';
import { ApiExcludeController } from '@nestjs/swagger';

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
