import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateChatDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsString()
  public description: string;
}
