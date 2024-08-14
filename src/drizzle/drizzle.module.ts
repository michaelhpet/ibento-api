import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DB_CONNECTION } from '@/utils/constants';

@Global()
@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL')!;
        return drizzle(postgres(databaseUrl));
      },
    },
  ],
  exports: [DB_CONNECTION],
})
export class DrizzleModule {}
