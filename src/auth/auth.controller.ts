import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '@/user/user.service';
import { success } from '@/utils';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { email } = dto;
    if (!(await this.userService.findByEmail(email)))
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    return this.authService.login(dto);
  }

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const { email } = dto;
    if (await this.userService.findByEmail(email))
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    const data = await this.authService.signup(dto);
    return success(data, 'User created successfully');
  }
}
