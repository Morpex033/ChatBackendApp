import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import { SingUpDto } from './dto/sing-up.dto';
import { SingUpResponseDto } from './dto/sing-up-response.dto';
import { SingInDto } from './dto/sing-in.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessRefreshResponseDto } from './dto/access-refresh-response.dto';
import { AccessTokenResponseDto } from './dto/access-token-response.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { DataSource, EntityManager } from 'typeorm';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async singUp(singUpDto: SingUpDto): Promise<SingUpResponseDto> {
    try {
      return await this.dataSource.transaction(
        async (manager: EntityManager) => {
          const passwordHash = await bcrypt.hash(singUpDto.user.password, 8);

          const newUser = await this.userService.createUser(
            {
              ...singUpDto.user,
              password: passwordHash,
            },
            manager,
          );

          try {
            const account = await this.accountService.createAccount(
              newUser.id,
              singUpDto.account,
              manager,
            );

            return { account, user: newUser } as SingUpResponseDto;
          } catch (error) {
            this.logger.log(error);
            throw new InternalServerErrorException('Account creation failed');
          }
        },
      );
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async singIn(singInDto: SingInDto): Promise<AccessRefreshResponseDto> {
    try {
      const user = await this.userService.findUserByEmail(singInDto.email);

      if (!user) throw new UnauthorizedException('Wrong email or password');

      if (await bcrypt.compare(singInDto.password, user.password)) {
        const payload: JwtPayload = {
          id: user.id,
          email: user.email,
          role: user.account.role,
        };

        const accessToken = await this.jwtService.signAsync(payload, {
          expiresIn: process.env.ACCESS_EXPIRES_IN,
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.REFRESH_EXPIRES_IN,
        });

        const response: AccessRefreshResponseDto = {
          accessToken,
          refreshToken,
        };

        return response;
      }

      throw new UnauthorizedException('Wrong email or password');
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<AccessTokenResponseDto> {
    try {
      const { id, email, role } = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      const accessToken = await this.jwtService.signAsync(
        { id, email, role },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.REFRESH_EXPIRES_IN,
        },
      );

      return { accessToken } as AccessTokenResponseDto;
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async validateToken(token: string): Promise<UserDto> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      const user = await this.userService.findUserById(payload.id);

      return user;
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
