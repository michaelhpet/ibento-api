import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { count, eq } from 'drizzle-orm';
import { DB_CONNECTION } from '@/utils/constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@/drizzle/schema';
import { PaginationDto } from '@/utils/pagination.dto';
import { getPagination } from '@/utils';
import { EmailService } from '@/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: PostgresJsDatabase<typeof schema>,
    private readonly emailService: EmailService,
  ) {}

  fields = {
    id: schema.users.id,
    first_name: schema.users.first_name,
    last_name: schema.users.last_name,
    display_name: schema.users.display_name,
    avatar_url: schema.users.avatar_url,
    created_at: schema.users.created_at,
    updated_at: schema.users.updated_at,
  };

  async create(dto: CreateUserDto) {
    const data = await this.db
      .insert(schema.users)
      .values(dto)
      .returning(this.fields);
    this.emailService.mailNewUser(
      dto.email,
      `${dto.first_name} ${dto.last_name}`,
    );
    return { user: data[0] };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const offset = (page - 1) * limit;
    const users = await this.db
      .select(this.fields)
      .from(schema.users)
      .limit(limit)
      .offset(offset);
    const _count = (
      await this.db.select({ value: count(schema.users.id) }).from(schema.users)
    )[0].value;
    const pagination = getPagination(paginationDto, users.length, _count);
    return { users, pagination };
  }

  async findOne(id: string) {
    const users = await this.db
      .select(this.fields)
      .from(schema.users)
      .where(eq(schema.users.id, id));
    if (!users.length) return null;
    return { user: users[0] };
  }

  async findByEmail(email: string) {
    const users = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
    if (!users.length) return null;
    return users[0];
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) return null;
    const users = await this.db
      .update(schema.users)
      .set(updateUserDto)
      .where(eq(schema.users.id, id))
      .returning(this.fields);
    if (!users.length) return null;
    return { user: users[0] };
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) return null;
    await this.db.delete(schema.users).where(eq(schema.users.id, id));
    return { user: null };
  }
}
