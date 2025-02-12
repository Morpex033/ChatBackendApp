import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Account } from '../database/entity/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AccountDto } from './dto/account.dto';
import { PaginationDataResponseDto } from '../common/dto/pagination-data-response.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly userService: UserService,
  ) {}

  async findAllAccounts(
    pagination: PaginationDto,
  ): Promise<PaginationDataResponseDto<AccountDto>> {
    try {
      const skip = (pagination.pageNumber - 1) * pagination.pageSize;

      const order: Record<string, 'ASC' | 'DESC'> = {};

      if (pagination.sortBy) {
        const sortOrder = pagination?.order || 'DESC';
        order[pagination.sortBy] = sortOrder;
      }

      const [accounts, total] = await this.accountRepository.findAndCount({
        skip: skip,
        take: pagination.pageSize,
        order,
      });

      return new PaginationDataResponseDto<AccountDto>(
        total,
        pagination.pageNumber,
        Math.ceil(total / pagination.pageSize),
        accounts.map((i) => new AccountDto(i)),
      );
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAccountById(id: string): Promise<AccountDto> {
    try {
      const account = await this.accountRepository.findOne({
        where: { id },
        relations: { user: true },
      });

      if (!account) throw new NotFoundException('Account not found');

      return new AccountDto(account);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAccountByUsername(username: string): Promise<AccountDto> {
    try {
      const account = await this.accountRepository.findOne({
        where: { username },
        relations: { user: true },
      });

      if (!account) throw new NotFoundException('Account not found');

      return new AccountDto(account);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateAccountById(
    id: string,
    account: UpdateAccountDto,
  ): Promise<AccountDto> {
    try {
      const existAccount = await this.accountRepository.findOne({
        where: { id },
      });

      if (!existAccount) throw new NotFoundException('Account not found');

      if (
        await this.accountRepository.findOne({
          where: { username: account.username },
        })
      ) {
        throw new ConflictException(
          'Account with this username already exists',
        );
      }

      const updatedAccount = await this.accountRepository.save({
        ...existAccount,
        ...account,
      });

      return new AccountDto(updatedAccount);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateAccountByAuth(
    auth: UserDto,
    account: UpdateAccountDto,
  ): Promise<AccountDto> {
    try {
      if (
        await this.accountRepository.findOne({
          where: { username: account.username },
        })
      ) {
        throw new ConflictException(
          'Account with this username already exists',
        );
      }

      const updatedAccount = await this.accountRepository.save({
        ...auth.account,
        ...account,
      });

      return new AccountDto(updatedAccount);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteAccount(id: string): Promise<void> {
    try {
      const account = await this.accountRepository.findOne({ where: { id } });

      if (!account) throw new NotFoundException('Account not found');

      await this.accountRepository.delete(account);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async createAccount(
    userId: string,
    account: CreateAccountDto,
    manager?: EntityManager,
  ): Promise<AccountDto> {
    try {
      const repo = manager
        ? manager.getRepository(Account)
        : this.accountRepository;

      const existAccount = await repo.findOne({
        where: { username: account.username },
      });

      if (existAccount) {
        throw new BadRequestException(
          'Account with this username already exists',
        );
      }

      const user = await this.userService.findUserById(userId, manager);

      return new AccountDto(
        await repo.save({
          ...account,
          user: { id: user.id },
        }),
      );
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
