import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
import { ChatService } from '../../chat/chat.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { MessageService } from '../../message/message.service';
import { CreateMessageDto } from '../../message/dto/create-message.dto';

@WebSocketGateway(3002, {})
export class WsChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      client.emit('unauthorized', 'No token provided');
      client.disconnect();
      return;
    }

    try {
      const user = await this.authService.validateToken(token);

      client.user = user;
      console.log(
        `✅ Client connected: ${client.user.account.nickname} (ID: ${client.id})`,
      );

      const chats = await this.chatService.findAllPublicChats(
        new PaginationDto(),
      );

      client.emit('chats', chats);

      return chats;
    } catch (error) {
      console.error(`❌ WebSocket Auth Error: ${error}`);
      client.emit('unauthorized', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(
      `✅ Client disconnected: ${client.user?.account.nickname} (ID: ${client.id})`,
    );
    client.disconnect();
  }

  @SubscribeMessage('findChat')
  async findChat(
    @MessageBody('title') title: string,
    @ConnectedSocket() client: Socket,
  ) {
    const chats = await this.chatService.findChatByTitle(title);

    client.emit('chats', chats);
    return chats;
  }

  @SubscribeMessage('joinChat')
  async joinChat(
    @MessageBody('chatId') chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const chat = await this.chatService.findChatById(chatId);
    if (!chat.isPublic) {
      client.emit('error', 'Chat is private');
      return;
    }

    if (client.rooms.has(chat.id)) {
      client.emit('error', 'User already in chat');
      return;
    }

    await client.join(chat.id);

    const messages = await this.messageService.findMessageByChatId(chat.id);

    client.emit('messageHistory', messages);

    return messages;
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const rooms = Array.from(client.rooms);
    if (!rooms.includes(createMessageDto.chatId)) {
      client.emit('error', 'You not in this chat');
      return;
    }

    const message = await this.messageService.createMessage(
      client.user,
      createMessageDto.chatId,
      createMessageDto,
    );

    this.server.to(createMessageDto.chatId).emit('newMessage', message);
  }
}
