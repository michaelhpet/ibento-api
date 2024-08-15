import { ArrayMinSize, IsArray, IsEmail } from 'class-validator';

export class CreateInvitationDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsEmail()
  emails: string[];
}
