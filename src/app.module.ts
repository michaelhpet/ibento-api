import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventModule } from './event/event.module';
import { EmailService } from './email/email.service';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    DrizzleModule,
    AuthModule,
    UserModule,
    EventModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ ttl: 5000000, isGlobal: true }),
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
  ],
  controllers: [AppController],
  providers: [
    EmailService,
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
