import { Type } from 'class-transformer';
import { CreateAccountDto } from '../../account/dto/create-account.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SingUpDto {
  @ApiProperty({ type: CreateUserDto })
  @Type(() => CreateUserDto)
  public user: CreateUserDto;

  @ApiProperty({ type: CreateAccountDto })
  @Type(() => CreateAccountDto)
  public account: CreateAccountDto;
}
