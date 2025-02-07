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
import { AccountService } from './account.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiPaginatedResponse } from '../common/decorator/api-pagination-response.decorator';
import { AccountDto } from './dto/account.dto';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.decorator';
import { UserDto } from '../user/dto/user.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';

@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiPaginatedResponse(AccountDto)
  @Get()
  public getAllAccounts(@Query() pagination: PaginationDto) {
    return this.accountService.findAllAccounts(pagination);
  }

  @ApiResponse({ type: AccountDto })
  @Get('/:id')
  public getAccountById(@Param('id') id: string) {
    return this.accountService.findAccountById(id);
  }

  @ApiResponse({ type: AccountDto })
  @Get()
  public getAccountByEmail(@Body('username') username: string) {
    return this.accountService.findAccountByUsername(username);
  }

  @ApiResponse({ type: AccountDto })
  @Put('/:id')
  public updateAccountById(
    @Param('id') id: string,
    @Body() account: UpdateAccountDto,
  ) {
    return this.accountService.updateAccountById(id, account);
  }

  @ApiOkResponse({ type: AccountDto })
  @Put()
  public updateAccountByAuth(
    @Auth() auth: UserDto,
    @Body() account: UpdateAccountDto,
  ) {
    return this.accountService.updateAccountByAuth(auth, account);
  }

  @ApiOkResponse()
  @Delete('/:id')
  public deleteAccount(@Param('id') id: string) {
    return this.accountService.deleteAccount(id);
  }
}
