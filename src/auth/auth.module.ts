import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '@/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
})
export class AuthModule {}
