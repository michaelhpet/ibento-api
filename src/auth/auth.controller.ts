import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '@/user/user.service';
import { success } from '@/utils';
import { hashPassword, Public } from '@/utils/functions';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    if (!user.password_hash)
      throw new HttpException(
        "User's password is not set",
        HttpStatus.BAD_REQUEST,
      );
    if (!(await bcrypt.compare(password, user.password_hash)))
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    const { password_hash, ...payload } = user;
    const access_token = await this.jwtService.signAsync({
      ...payload,
      password_hash,
    });
    const data = { access_token, user: payload };
    return success(data, 'User logged in successfully');
  }

  @Public()
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const { email, password, first_name, last_name } = dto;
    if (await this.userService.findByEmail(email))
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    const password_hash = await hashPassword(password);
    const data = await this.userService.create({
      email,
      first_name,
      last_name,
      password_hash,
    });
    return success(data, 'User created successfully');
  }
}
