import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty({ required: false })
  @IsString()
  @Optional()
  public description: string;
}
