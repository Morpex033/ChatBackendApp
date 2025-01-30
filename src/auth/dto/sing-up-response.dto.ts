import { ApiProperty } from '@nestjs/swagger';
import { AccountDto } from '../../account/dto/account.dto';
import { UserDto } from '../../user/dto/user.dto';

export class SingUpResponseDto {
  @ApiProperty({ type: AccountDto })
  public account: AccountDto;

  @ApiProperty({ type: UserDto })
  public user: UserDto;
}
