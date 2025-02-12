import { ApiProperty } from '@nestjs/swagger';
import { MessageDocument } from '../../database/schemas/message.schema';

export class MessageDto {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public senderId: string;

  @ApiProperty({ isArray: true })
  public receiverId: string[];

  @ApiProperty()
  public chatId: string;

  @ApiProperty()
  public content: string;

  @ApiProperty()
  public isModified: boolean;

  @ApiProperty()
  public createdAt: Date;

  constructor(message: MessageDocument) {
    this._id = message._id as string;
    this.senderId = message.senderId;
    this.receiverId = message.receiverId;
    this.chatId = message.chatId;
    this.content = message.content;
    this.isModified = message.isModified;
    this.createdAt = message.createdAt;
  }
}
