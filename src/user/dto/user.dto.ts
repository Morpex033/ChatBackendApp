import { ApiProperty } from '@nestjs/swagger';
import { AccountDto } from '../../account/dto/account.dto';
import { User } from '../../database/entity/user.entity';

export class UserDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public password: string;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty({ type: AccountDto })
  public account: AccountDto;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.account = user.account;
  }
}
