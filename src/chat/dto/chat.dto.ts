import { AccountDto } from '../../account/dto/account.dto';
import { Chat } from '../../database/entity/chat.entity';

export class ChatDto {
  public id: string;

  public title: string;

  public description: string;

  public isPublic: boolean;

  public createdAt: Date;

  public updatedAt: Date;

  public owner: AccountDto;

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
