import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entity/user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationDataResponseDto } from '../common/dto/pagination-data-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserById(id: string, manager?: EntityManager): Promise<UserDto> {
    try {
      const repo = manager ? manager.getRepository(User) : this.userRepository;

      const user = await repo.findOne({
        where: { id },
        relations: { account: true },
      });

      if (!user) throw new NotFoundException('User not found');

      return new UserDto(user);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findUserByEmail(email: string): Promise<UserDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: { account: true },
      });

      if (!user) throw new NotFoundException('User not found');

      return new UserDto(user);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllUsers(
    pagination: PaginationDto,
  ): Promise<PaginationDataResponseDto<UserDto>> {
    try {
      const skip = (pagination.pageNumber - 1) * pagination.pageSize;

      const order: Record<string, 'ASC' | 'DESC'> = {};

      if (pagination.sortBy) {
        const sortOrder = pagination?.order || 'DESC';
        order[pagination.sortBy] = sortOrder;
      }

      const [users, total] = await this.userRepository.findAndCount({
        skip: skip,
        take: pagination.pageSize,
        order,
      });

      return new PaginationDataResponseDto<UserDto>(
        total,
        pagination.pageNumber,
        Math.ceil(total / pagination.pageSize),
        users.map((user) => new UserDto(user)),
      );
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateUserById(id: string, user: UpdateUserDto): Promise<UserDto> {
    try {
      const existUser = await this.userRepository.findOne({ where: { id } });

      if (!existUser) throw new NotFoundException('User not found');

      if (await this.userRepository.findOne({ where: { email: user.email } })) {
        throw new ConflictException('User with this email already exists');
      }

      const hash = await bcrypt.hash(user.password, 8);

      user.password = hash;

      const updatedUser = await this.userRepository.save({
        ...existUser,
        ...user,
      });

      return new UserDto(updatedUser);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateUserByAuth(auth: UserDto, user: UpdateUserDto): Promise<UserDto> {
    try {
      if (await this.userRepository.findOne({ where: { email: user.email } })) {
        throw new ConflictException('User with this email already exists');
      }

      const hash = await bcrypt.hash(user.password, 8);

      user.password = hash;

      const updatedUser = await this.userRepository.save({
        ...auth,
        ...user,
      });

      return new UserDto(updatedUser);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('User not found');

      await this.userRepository.delete(user);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async createUser(
    user: CreateUserDto,
    manager?: EntityManager,
  ): Promise<UserDto> {
    try {
      const repo = manager ? manager.getRepository(User) : this.userRepository;

      const existUser = await repo.findOne({
        where: { email: user.email },
      });

      if (existUser)
        throw new BadRequestException('The email is already registered');

      return new UserDto(await repo.save(user));
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
