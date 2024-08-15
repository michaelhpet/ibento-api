import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  image_url: string;

  @IsArray()
  @IsDateString({ strict: true }, { each: true })
  @ArrayMinSize(1)
  dates: Date[];

  @IsString()
  @IsIn(['public', 'private'])
  visibility: 'public' | 'private';

  @IsBoolean()
  published: boolean;
}
