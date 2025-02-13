import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Auth } from '../auth/decorator/auth.decorator';
import { UserDto } from '../user/dto/user.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ChatDto } from './dto/chat.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiPaginatedResponse } from '../common/decorator/api-pagination-response.decorator';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Roles } from '../auth/decorator/role.decorator';
import { AccountRole } from '../user/enum/account-role.enum';

@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiResponse({ type: ChatDto })
  @Post('/public')
  public createPublicChat(@Auth() auth: UserDto, @Body() dto: CreateChatDto) {
    return this.chatService.createPublicChat(auth, dto);
  }

  @ApiResponse({ type: ChatDto })
  @Post('/private/:id')
  public createPrivateChat(
    @Auth() auth: UserDto,
    @Body()dto: CreateChatDto,
    @Param('id') id: string,
  ) {
    return this.chatService.createPrivateChat(auth, id, dto);
  }

  @ApiPaginatedResponse(ChatDto)
  @Get('/all')
  public getAllChats(@Query() pagination: PaginationDto) {
    return this.chatService.findAllChats(pagination);
  }

  @ApiPaginatedResponse(ChatDto)
  @Get('/all/public')
  public getAllPublicChats(@Query() pagination: PaginationDto) {
    return this.chatService.findAllPublicChats(pagination);
  }

  @ApiPaginatedResponse(ChatDto)
  @Get('/all/private')
  public getAllPrivateChats(
    @Query() pagination: PaginationDto,
    @Auth() auth: UserDto,
  ) {
    return this.chatService.findAllPrivateChats(pagination, auth);
  }

  @ApiResponse({ type: ChatDto })
  @Get('/id/:id')
  public getChatById(@Param('id') id: string) {
    return this.chatService.findChatById(id);
  }

  @ApiResponse({ type: ChatDto, isArray: true })
  @Get('/title/:title')
  public getChatsByTitle(@Param('title') title: string) {
    return this.chatService.findChatByTitle(title);
  }

  @ApiResponse({ type: ChatDto })
  @Roles([AccountRole.Admin])
  @Put('/id/:id')
  public updateChatById(@Param('id') id: string, @Body() chat: UpdateChatDto) {
    return this.chatService.updateChatById(id, chat);
  }

  @ApiResponse({ type: ChatDto })
  @Put('/auth/id/:id')
  public updateChatByAuth(
    @Auth() auth: UserDto,
    @Param('id') id: string,
    chat: UpdateChatDto,
  ) {
    return this.chatService.updateChatByAuth(auth, id, chat);
  }

  @ApiOkResponse()
  @Roles([AccountRole.Admin])
  @Delete('/id/:id')
  public deleteChatById(@Param('id') id: string) {
    return this.chatService.deleteChatById(id);
  }

  @ApiOkResponse()
  @Delete('/auth/id/:id')
  public deleteChatByAuth(@Auth() auth: UserDto, @Param('id') id: string) {
    return this.chatService.deleteChatByAuth(auth, id);
  }
}
