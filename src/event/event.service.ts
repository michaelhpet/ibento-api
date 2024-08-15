import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@/drizzle/schema';
import { count, eq } from 'drizzle-orm';
import { getPagination } from '@/utils';
import { ReadEventsDto } from './dto/read-events.dto';
import { DB_CONNECTION } from '@/utils/constants';

@Injectable()
export class EventService {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(user_id: string, createEventDto: CreateEventDto) {
    const data = await this.db
      .insert(schema.events)
      .values({ user_id, ...createEventDto });
    return { event: data[0] };
  }

  async findAll(user_id: string, readEventsDto: ReadEventsDto) {
    const { limit = 10, page = 1 } = readEventsDto;
    const offset = (page - 1) * limit;
    const events = await this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.user_id, user_id))
      .orderBy(schema.events.created_at)
      .limit(limit)
      .offset(offset);
    const _count = (
      await this.db
        .select({ value: count(schema.events.id) })
        .from(schema.events)
        .where(eq(schema.events.user_id, user_id))
    )[0].value;
    const pagination = getPagination({ limit, page }, events.length, _count);
    return { events, pagination };
  }

  async findAllPublic(readEventsDto: ReadEventsDto) {
    const { limit = 10, page = 1 } = readEventsDto;
    const offset = (page - 1) * limit;
    const events = await this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.visibility, 'public'))
      .orderBy(schema.events.created_at)
      .limit(limit)
      .offset(offset);
    const _count = (
      await this.db
        .select({ value: count(schema.events.id) })
        .from(schema.events)
        .where(eq(schema.events.visibility, 'public'))
    )[0].value;
    const pagination = getPagination({ limit, page }, events.length, _count);
    return { events, pagination };
  }

  async findRsvp(user_id: string, readEventsDto: ReadEventsDto) {
    const { limit = 10, page = 1 } = readEventsDto;
    const offset = (page - 1) * limit;
    const events = await this.db
      .select()
      .from(schema.events_guests)
      .innerJoin(
        schema.events,
        eq(schema.events_guests.event_id, schema.events.id),
      )
      .where(eq(schema.events_guests.user_id, user_id))
      .orderBy(schema.events.created_at)
      .limit(limit)
      .offset(offset);
    const _count = (
      await this.db
        .select({ value: count(schema.events_guests.event_id) })
        .from(schema.events_guests)
        .innerJoin(
          schema.events,
          eq(schema.events_guests.event_id, schema.events.id),
        )
        .where(eq(schema.events_guests.user_id, user_id))
    )[0].value;
    const pagination = getPagination({ limit, page }, events.length, _count);
    return { events, pagination };
  }

  async createRsvp(user_id: string, event_id: string) {
    const data = await this.db.insert(schema.events_guests).values({
      user_id,
      event_id,
    });
    return { rsvp: data[0] };
  }

  async findOne(user_id: string, event_id: string) {
    const events = await this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.id, event_id));
    if (!events.length)
      throw new HttpException('Event does not exist', HttpStatus.NOT_FOUND);
    const event = events[0];
    if (event.visibility === 'private' && event.user_id !== user_id)
      throw new HttpException(
        'User not allowed to access this event',
        HttpStatus.UNAUTHORIZED,
      );
    return { event };
  }

  async update(
    user_id: string,
    event_id: string,
    updateEventDto: UpdateEventDto,
  ) {
    const events = await this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.id, event_id));
    if (!events.length)
      throw new HttpException('Event does not exist', HttpStatus.NOT_FOUND);
    const event = events[0];
    if (event.user_id !== user_id)
      throw new HttpException(
        'Event does not belong to user',
        HttpStatus.UNAUTHORIZED,
      );
    const data = await this.db
      .update(schema.events)
      .set(updateEventDto)
      .where(eq(schema.events.id, event_id));
    return { event: data[0] };
  }

  async remove(user_id: string, event_id: string) {
    await this.findOne(user_id, event_id);
    await this.db.delete(schema.events).where(eq(schema.events.id, event_id));
    return { event: null };
  }
}
