import { ApiProperty } from '@nestjs/swagger';
import { AccountDto } from '../../account/dto/account.dto';
import { Chat } from '../../database/entity/chat.entity';

export class ChatDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public isPublic: boolean;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty({ type: AccountDto })
  public owner: AccountDto;

  @ApiProperty({ type: AccountDto, isArray: true })
  public accounts: AccountDto[];

  constructor(chat: Chat) {
    this.id = chat.id;
    this.title = chat.title;
    this.description = chat.description;
    this.isPublic = chat.isPublic;
    this.createdAt = chat.createdAt;
    this.updatedAt = chat.updatedAt;
    this.owner = chat.owner;
    this.accounts = chat.accounts;
  }
}
