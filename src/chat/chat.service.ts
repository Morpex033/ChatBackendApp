import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../database/entity/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UserDto } from '../user/dto/user.dto';
import { ChatDto } from './dto/chat.dto';
import { AccountService } from '../account/account.service';
import { PaginationDataResponseDto } from '../common/dto/pagination-data-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private readonly accountService: AccountService,
  ) {}

  async createPublicChat(auth: UserDto, chat: CreateChatDto): Promise<ChatDto> {
    try {
      return new ChatDto(
        await this.chatRepository.save({
          ...chat,
          owner: auth.account,
          isPublic: true,
          accounts: [auth.account],
        }),
      );
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async createPrivateChat(
    auth: UserDto,
    accountId: string,
    chat: CreateChatDto,
  ): Promise<ChatDto> {
    try {
      return new ChatDto(
        await this.chatRepository.save({
          ...chat,
          owner: auth.account,
          isPublic: false,
          accounts: [{ id: accountId }, auth.account],
        }),
      );
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllChats(
    pagination: PaginationDto,
  ): Promise<PaginationDataResponseDto<ChatDto>> {
    try {
      const skip = (pagination.pageNumber - 1) * pagination.pageSize;

      const order: Record<string, 'ASC' | 'DESC'> = {};

      if (pagination.sortBy) {
        const sortOrder = pagination?.order || 'DESC';
        order[pagination.sortBy] = sortOrder;
      }

      const [chats, total] = await this.chatRepository.findAndCount({
        skip: skip,
        take: pagination.pageSize,
        order,
      });

      return new PaginationDataResponseDto<ChatDto>(
        total,
        pagination.pageNumber,
        Math.ceil(total / pagination.pageSize),
        chats.map((i) => new ChatDto(i)),
      );
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllPublicChats(
    pagination: PaginationDto,
  ): Promise<PaginationDataResponseDto<ChatDto>> {
    try {
      const skip = (pagination.pageNumber - 1) * pagination.pageSize;

      const order: Record<string, 'ASC' | 'DESC'> = {};

      if (pagination.sortBy) {
        const sortOrder = pagination?.order || 'DESC';
        order[pagination.sortBy] = sortOrder;
      }

      const [chats, total] = await this.chatRepository.findAndCount({
        skip: skip,
        take: pagination.pageSize,
        order,
        where: {
          isPublic: true,
        },
      });

      return new PaginationDataResponseDto<ChatDto>(
        total,
        pagination.pageNumber,
        Math.ceil(total / pagination.pageSize),
        chats.map((i) => new ChatDto(i)),
      );
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllPrivateChats(
    pagination: PaginationDto,
    auth: UserDto,
  ): Promise<PaginationDataResponseDto<ChatDto>> {
    try {
      const skip = (pagination.pageNumber - 1) * pagination.pageSize;

      const order: Record<string, 'ASC' | 'DESC'> = {};

      if (pagination.sortBy) {
        const sortOrder = pagination?.order || 'DESC';
        order[pagination.sortBy] = sortOrder;
      }

      const [chats, total] = await this.chatRepository.findAndCount({
        skip: skip,
        take: pagination.pageSize,
        order,
        where: [
          { isPublic: false, owner: auth.account },
          { isPublic: false, accounts: [{ id: auth.account.id }] },
        ],
      });

      return new PaginationDataResponseDto<ChatDto>(
        total,
        pagination.pageNumber,
        Math.ceil(total / pagination.pageSize),
        chats.map((i) => new ChatDto(i)),
      );
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findChatById(id: string): Promise<ChatDto> {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id },
        relations: { owner: true, accounts: true },
      });

      if (!chat) throw new NotFoundException('Chat not found');

      return new ChatDto(chat);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findChatByTitle(title: string): Promise<ChatDto[]> {
    try {
      const queryBuilder = this.chatRepository.createQueryBuilder('chats');

      queryBuilder.where(
        `to_tsvector(regexp_replace("chats"."title", '\\.', '', 'g')) @@ to_tsquery(:query)`,
        {
          query: title,
        },
      );

      const chats: Chat[] = await queryBuilder.limit(100).getMany();

      return chats.map((i) => new ChatDto(i));
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateChatById(id: string, chat: UpdateChatDto): Promise<ChatDto> {
    try {
      const existsChat = await this.chatRepository.findOne({ where: { id } });

      if (!chat) throw new NotFoundException('Chat not found');

      const updatedChat = await this.chatRepository.save({
        ...existsChat,
        chat,
      });

      return new ChatDto(updatedChat);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateChatByAuth(
    auth: UserDto,
    id: string,
    chat: UpdateChatDto,
  ): Promise<ChatDto> {
    try {
      const existsChat = await this.chatRepository.findOne({
        where: {
          id,
          owner: { id: auth.id },
        },
      });

      if (!chat) throw new NotFoundException('Chat not found');

      const updatedChat = await this.chatRepository.save({
        ...existsChat,
        chat,
      });

      return new ChatDto(updatedChat);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteChatById(id: string): Promise<void> {
    try {
      const chat = await this.chatRepository.findOne({ where: { id } });

      if (!chat) throw new NotFoundException('Chat not found');

      await this.chatRepository.delete(chat.id);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteChatByAuth(auth: UserDto, id: string): Promise<void> {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id, owner: { id: auth.id } },
      });

      if (!chat) throw new NotFoundException('Chat not found');

      await this.chatRepository.delete(chat);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
