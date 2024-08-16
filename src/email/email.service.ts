import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}
  private readonly resend = new Resend(
    this.configService.get<string>('RESEND_API_KEY')!,
  );

  mailNewUser(email: string, name: string) {
    this.resend.emails.send({
      from: 'ibento <hello@mail.michaelhpet.com>',
      to: [email],
      subject: `Welcome to ibento, ${name}!`,
      text: 'it works!',
    });
  }
}
