import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { count, eq } from 'drizzle-orm';
import { DB_CONNECTION } from '@/utils/constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@/drizzle/schema';
import { PaginationDto } from '@/utils/pagination.dto';
import { getPagination } from '@/utils';

@Injectable()
export class UserService {
  constructor(
    @Inject(DB_CONNECTION) private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(dto: CreateUserDto) {
    const data = await this.db.insert(schema.users).values(dto).returning({
      id: schema.users.id,
      email: schema.users.email,
      first_name: schema.users.first_name,
      last_name: schema.users.last_name,
    });
    return { user: data[0] };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const offset = (page - 1) * limit;
    const users = await this.db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        first_name: schema.users.first_name,
        last_name: schema.users.last_name,
      })
      .from(schema.users)
      .limit(limit)
      .offset(offset);
    const _count = (
      await this.db.select({ value: count(schema.users.id) }).from(schema.users)
    )[0].value;
    const pagination = getPagination(paginationDto, users.length, _count);
    return { users, pagination };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    const _users = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
    if (!_users.length) return null;
    return _users[0];
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return { id, updateUserDto };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
