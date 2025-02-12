import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatModule } from '../chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../database/schemas/message.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ChatModule,
    UserModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
