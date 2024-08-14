import { Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { hashPassword } from '@/utils/functions';
import { DB_CONNECTION } from '@/utils/constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@/drizzle/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_CONNECTION) private db: PostgresJsDatabase<typeof schema>,
  ) {}

  login(dto: LoginDto) {
    return { dto };
  }

  async signup(dto: SignupDto) {
    const { email, first_name, last_name, password } = dto;
    const password_hash = await hashPassword(password);
    const data = await this.db
      .insert(schema.users)
      .values({ email, first_name, last_name, password_hash })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        first_name: schema.users.first_name,
        last_name: schema.users.last_name,
      });
    return { user: data[0] };
  }
}
