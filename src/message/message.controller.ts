import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserDto } from '../user/dto/user.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { MessageDto } from './dto/message.dto';

@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth()
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiResponse({ type: MessageDto })
  @Post('/chat/:id')
  public createMessage(
    @Param('id') id: string,
    @Body() message: CreateMessageDto,
    @Auth() auth: UserDto,
  ) {
    return this.messageService.createMessage(auth, id, message);
  }

  @ApiResponse({ type: MessageDto, isArray: true })
  @Get('/all')
  public getAllMessages() {
    return this.messageService.findAllMessages();
  }

  @ApiResponse({ type: MessageDto, isArray: true })
  @Get('/sender/:id')
  public getMessageBySenderId(@Param('id') id: string) {
    return this.messageService.findMessageBySenderId(id);
  }

  @ApiResponse({ type: MessageDto })
  @Get('/chat/:id')
  public getMessageByChatId(@Param('id') id: string) {
    return this.messageService.findMessageByChatId(id);
  }

  @ApiResponse({ type: MessageDto })
  @Put('/:id')
  public updateMessage(
    @Auth() auth: UserDto,
    @Param('id') id: string,
    @Body() message: UpdateMessageDto,
  ) {
    return this.messageService.updateMessageByAuth(auth, id, message);
  }

  @ApiOkResponse()
  @Delete('/:id')
  public deleteMessageById(@Auth() auth: UserDto, @Param('id') id: string) {
    return this.messageService.deleteMessage(auth, id);
  }
}
