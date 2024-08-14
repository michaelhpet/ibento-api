import { IsString } from 'class-validator';

export class ReadUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  display_name: string;

  @IsString()
  avatart_url: string;

  @IsString()
  created_at: string;

  @IsString()
  updated_at: string;
}
