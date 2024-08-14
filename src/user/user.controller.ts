import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Query,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@/utils/pagination.dto';
import { success } from '@/utils';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const data = await this.userService.findAll(paginationDto);
    return success(data, 'Users fetched successfully');
  }

  @Get('me')
  async findOne(@Req() req: Request) {
    const data = await this.userService.findOne(req.user.id);
    if (!data)
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    return success(data, 'User fetched successfully');
  }

  @Patch('me')
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(req.user.id, updateUserDto);
    if (!data)
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    return success(data, 'User updated successfully');
  }

  @Delete('me')
  async remove(@Req() req: Request) {
    const data = await this.userService.delete(req.user.id);
    if (!data)
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    return success(data, 'User deleted successfully');
  }
}
