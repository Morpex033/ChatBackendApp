import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../../database/entity/account.entity';
import { UserDto } from '../../user/dto/user.dto';
import { AccountRole } from '../../user/enum/account-role.enum';
import { ChatDto } from '../../chat/dto/chat.dto';

export class AccountDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public nickname: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public username: string;

  @ApiProperty()
  public dateOfBirth: Date;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty({ type: () => UserDto })
  public user: UserDto;

  @ApiProperty({ enum: AccountRole })
  public role: AccountRole;

  public chats: ChatDto[];

  constructor(account: Account) {
    this.id = account.id;
    this.nickname = account.nickname;
    this.description = account.description;
    this.username = account.username;
    this.dateOfBirth = account.dateOfBirth;
    this.createdAt = account.createdAt;
    this.updatedAt = account.updatedAt;
    this.user = account.user;
    this.role = account.role;
    this.chats = account.chats;
  }
}
