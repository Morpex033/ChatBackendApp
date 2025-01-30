import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../common/decorator/api-pagination-response.decorator';
import { UserDto } from './dto/user.dto';
import { RoleGuard } from '../auth/guard/role.guard';
import { AccountRole } from './enum/account-role.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { Auth } from '../auth/decorator/auth.decorator';

@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiPaginatedResponse(UserDto)
  @Get()
  public getAllUsers(@Query() pagination: PaginationDto) {
    return this.userService.findAllUsers(pagination);
  }

  @ApiResponse({ type: UserDto })
  @Get('/:id')
  public getUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @ApiResponse({ type: UserDto })
  @Get()
  public getUserByEmail(@Body('email') email: string) {
    return this.userService.findUserByEmail(email);
  }

  @ApiResponse({ type: UserDto })
  @Put('/:id')
  @Roles([AccountRole.Admin])
  public updateUserById(
    @Param('id') id: string,
    @Body() updatedUser: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, updatedUser);
  }

  @ApiResponse({ type: UserDto })
  @Put()
  public updateUserByAuth(
    @Body() updatedUser: UpdateUserDto,
    @Auth() auth: UserDto,
  ) {
    return this.userService.updateUserByAuth(auth, updatedUser);
  }

  @ApiOkResponse()
  @Delete('/:id')
  public deleteUser(id: string) {
    return this.userService.deleteUser(id);
  }
}
