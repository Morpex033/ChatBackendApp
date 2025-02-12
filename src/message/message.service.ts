import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../database/schemas/message.schema';
import { Model } from 'mongoose';
import { UserDto } from '../user/dto/user.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatService } from '../chat/chat.service';
import { MessageDto } from './dto/message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AccountRole } from '../user/enum/account-role.enum';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly chatService: ChatService,
  ) {}

  async createMessage(
    auth: UserDto,
    chatId: string,
    message: CreateMessageDto,
  ): Promise<MessageDto> {
    try {
      const chat = await this.chatService.findChatById(chatId);

      if (
        !chat.accounts.some((acc) => acc.id === auth.account.id) ||
        chat.owner.id !== auth.account.id
      ) {
        throw new BadRequestException(`User not member in ${chat.title} chat`);
      }

      return new MessageDto(
        await this.messageModel.create({
          ...message,
          senderId: auth.account.id,
          receiverId: chat.accounts.map((account) => account.id),
          chatId: chat.id,
        }),
      );
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllMessages(): Promise<MessageDto[]> {
    try {
      const messages = await this.messageModel.find().exec();

      if (messages.length === 0) {
        throw new NotFoundException('Messages not found');
      }

      return messages.map((message) => new MessageDto(message));
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findMessageById(id: string): Promise<MessageDto> {
    try {
      const message = await this.messageModel.findById(id).exec();

      if (!message) throw new NotFoundException('Message not found');

      return new MessageDto(message);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findMessageBySenderId(senderId: string): Promise<MessageDto[]> {
    try {
      const messages = await this.messageModel.find({ senderId }).exec();

      return messages.map((message) => new MessageDto(message));
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findMessageByChatId(chatId: string): Promise<MessageDto[]> {
    try {
      const messages = await this.messageModel.find({ chatId }).exec();

      return messages.map((message) => new MessageDto(message));
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findMessageByChatAndSenderId(
    chatId: string,
    senderId: string,
  ): Promise<MessageDto[]> {
    try {
      const messages = await this.messageModel
        .find({ chatId, senderId })
        .exec();

      return messages.map((message) => new MessageDto(message));
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateMessageByAuth(
    auth: UserDto,
    id: string,
    updatedMessage: UpdateMessageDto,
  ): Promise<MessageDto> {
    try {
      const existsMessage = await this.messageModel.findById(id).exec();

      if (!existsMessage) throw new NotFoundException('Message not found');

      if (existsMessage.senderId !== auth.account.id) {
        throw new BadRequestException('User not sender');
      }

      const message = await this.messageModel
        .findByIdAndUpdate(
          id,
          { ...updatedMessage, isModified: true },
          {
            new: true,
          },
        )
        .exec();

      if (!message) throw new NotFoundException('Message not found');

      return new MessageDto(message);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteMessage(auth: UserDto, id: string): Promise<void> {
    try {
      const message = await this.messageModel.findById(id).exec();
      if (!message) throw new NotFoundException('Message not found');

      if (
        message.senderId !== auth.account.id ||
        auth.account.role !== AccountRole.Admin
      ) {
        throw new BadRequestException(
          'You must be Admin or sender for this message',
        );
      }

      await this.messageModel.findByIdAndDelete(message._id).exec();
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
