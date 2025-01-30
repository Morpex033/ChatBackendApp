import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../database/entity/chat.entity';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Chat]), AccountModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
