import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  public senderId: string;

  @Prop({ required: true })
  public receiverId: string[];

  @Prop({ required: true })
  public chatId: string;

  @Prop({ required: true })
  public content: string;

  @Prop({ default: false })
  public isModified: boolean;

  @Prop({ default: Date.now })
  public createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
