import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty()
  @IsString()
  public nickname: string;

  @ApiProperty()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsString()
  public username: string;

  @ApiProperty()
  @IsDate()
  public dateOfBirth: Date;
}
