import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Request } from 'express';
import { ReadEventsDto } from './dto/read-events.dto';
import { success } from '@/utils';
import { Public } from '@/utils/functions';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Req() req: Request, @Body() createEventDto: CreateEventDto) {
    const data = await this.eventService.create(req.user.id, createEventDto);
    return success(data, 'Event created successfully');
  }

  @Get()
  async findAll(@Req() req: Request, @Query() readEventsDto: ReadEventsDto) {
    const data = await this.eventService.findAll(req.user.id, readEventsDto);
    return success(data, 'Events retrieved successfully');
  }

  @Public()
  @Get('public')
  async findAllPublic(@Query() readEventsDto: ReadEventsDto) {
    const data = await this.eventService.findAllPublic(readEventsDto);
    return success(data, 'Events retrieved successfully');
  }

  @Get('rsvp')
  async findRsvp(@Req() req: Request, @Query() readEventsDto: ReadEventsDto) {
    const data = await this.eventService.findRsvp(req.user.id, readEventsDto);
    return success(data, 'Event RSVPs retrieved successfully');
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') event_id: string) {
    const data = await this.eventService.findOne(req.user.id, event_id);
    return success(data, 'Event retrieved successfully');
  }

  @Post(':id/rsvp')
  async createRsvp(@Req() req: Request, @Param('id') event_id: string) {
    const data = await this.eventService.createRsvp(req.user.id, event_id);
    return success(data, 'Event RSVP created successfully');
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(req.user.id, id, updateEventDto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.eventService.remove(req.user.id, id);
  }

  @Post(':id/invite')
  async createInvitation(
    @Req() req: Request,
    @Param('id') event_id: string,
    @Body() createInvitationDto: CreateInvitationDto,
  ) {
    const data = await this.eventService.createInvitation(
      req.user.id,
      event_id,
      createInvitationDto,
    );
    return success(data, 'Event invitation created successfully');
  }

  @Get(':id/invite')
  async findInvitations(@Req() req: Request, @Param('id') event_id: string) {
    const data = await this.eventService.findInvitations(req.user.id, event_id);
    return success(data, 'Event invitations retrieved successfully');
  }
}
