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
  @ArrayMinSize(1)
  @IsDateString({ strict: true, strictSeparator: true }, { each: true })
  dates: string[];

  @IsString()
  @IsIn(['public', 'private'])
  visibility: 'public' | 'private';

  @IsBoolean()
  published: boolean;
}
