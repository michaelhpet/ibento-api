import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    return { loginDto };
  }

  signup(signupDto: SignupDto) {
    return { signupDto };
  }
}
