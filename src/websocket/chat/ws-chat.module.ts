import { Module } from '@nestjs/common';
import { WsChatGateway } from './ws-chat.gateway';
import { ChatModule } from '../../chat/chat.module';
import { MessageModule } from '../../message/message.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [AuthModule, ChatModule, MessageModule],
  providers: [WsChatGateway],
})
export class WsChatModule {}
