import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsStrongPassword({ minSymbols: 0 })
  public password: string;
}
