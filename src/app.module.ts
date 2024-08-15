import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { EventModule } from './event/event.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    AuthModule,
    UserModule,
    {
      ...JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          global: true,
          secret: configService.get<string>('JWT_SECRET')!,
          signOptions: { expiresIn: '1y' },
        }),
      }),
      global: true,
    },
    EventModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    EmailService,
  ],
})
export class AppModule {}
