import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@/drizzle/schema';
import { and, count, eq } from 'drizzle-orm';
import { getPagination } from '@/utils';
import { ReadEventsDto } from './dto/read-events.dto';
import { DB_CONNECTION } from '@/utils/constants';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EventService {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: PostgresJsDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}

  async create(user_id: string, createEventDto: CreateEventDto) {
    const data = await this.db
      .insert(schema.events)
      .values({ user_id, ...createEventDto })
      .returning();
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

  async findRsvps(user_id: string, readEventsDto: ReadEventsDto) {
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
    const data = await this.db
      .insert(schema.events_guests)
      .values({
        user_id,
        event_id,
      })
      .returning();
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
      .where(eq(schema.events.id, event_id))
      .returning();
    return { event: data[0] };
  }

  async remove(user_id: string, event_id: string) {
    await this.findOne(user_id, event_id);
    await this.db.delete(schema.events).where(eq(schema.events.id, event_id));
    return { event: null };
  }

  async findInvitations(user_id: string, event_id: string) {
    const events = await this.db
      .select({ user_id: schema.events.user_id })
      .from(schema.events)
      .where(eq(schema.events.id, event_id));
    if (!events.length)
      throw new HttpException('Event does not exist', HttpStatus.NOT_FOUND);
    const event = events[0];
    if (event.user_id !== user_id)
      throw new HttpException(
        'User not allowed to access this event',
        HttpStatus.UNAUTHORIZED,
      );
    const invitations = await this.db
      .select({
        event_id: schema.invitations.event_id,
        email: schema.invitations.email,
      })
      .from(schema.invitations)
      .where(eq(schema.invitations.event_id, event_id));
    return { invitations };
  }

  async createInvitation(
    user_id: string,
    event_id: string,
    createInvitationDto: CreateInvitationDto,
  ) {
    const { emails } = createInvitationDto;
    const events = await this.db
      .select({ id: schema.events.id, user_id: schema.events.user_id })
      .from(schema.events)
      .where(eq(schema.events.id, event_id));
    if (!events.length)
      throw new HttpException('Event does not exist', HttpStatus.NOT_FOUND);
    const event = events[0];
    if (event.user_id !== user_id)
      throw new HttpException(
        'User not allowed to access this event',
        HttpStatus.UNAUTHORIZED,
      );
    const invitations = await this.db
      .select({
        event_id: schema.invitations.event_id,
        email: schema.invitations.email,
      })
      .from(schema.invitations)
      .where(eq(schema.invitations.event_id, event_id));
    const newInvitationEmails = invitations
      .filter((i) => !emails.includes(i.email))
      .map((i) => i.email);
    if (!newInvitationEmails.length) return { event, invitations: [] };
    const newInvitations = await this.db
      .insert(schema.invitations)
      .values(newInvitationEmails.map((email) => ({ event_id, email })))
      .returning();
    return { invitations: newInvitations };
  }

  async findTicket(user_id: string, event_id: string) {
    const rsvps = await this.db
      .select({ user_id: schema.events_guests.user_id })
      .from(schema.events_guests)
      .where(
        and(
          eq(schema.events_guests.event_id, event_id),
          eq(schema.events_guests.user_id, user_id),
        ),
      );
    if (!rsvps.length)
      throw new HttpException('Event RSVP not created', HttpStatus.NOT_FOUND);
    const token = await this.jwtService.signAsync({ user_id, event_id });
    return { token };
  }

  async verifyTicket(owner_id: string, token: string) {
    try {
      const { event_id, user_id } = await this.jwtService.verifyAsync(token);
      const events = await this.db
        .select()
        .from(schema.events)
        .where(eq(schema.events.id, event_id));
      const event = events[0] || null;
      if (!event)
        throw new HttpException('Event does not exist', HttpStatus.NOT_FOUND);
      if (event.user_id !== owner_id)
        throw new HttpException(
          'User does not have access to this event',
          HttpStatus.FORBIDDEN,
        );
      const users = await this.db
        .select({
          id: schema.users.id,
          first_name: schema.users.first_name,
          last_name: schema.users.last_name,
        })
        .from(schema.users)
        .where(eq(schema.users.id, user_id));
      if (!users.length)
        throw new HttpException('Guest does not exist', HttpStatus.NOT_FOUND);
      const user = users[0];
      return { valid: true, user, event };
    } catch (error) {
      return { valid: false, event: null, user: null };
    }
  }
}
