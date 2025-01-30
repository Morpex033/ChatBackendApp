import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInDto } from './dto/sing-in.dto';
import { SingUpDto } from './dto/sing-up.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiResponse } from '@nestjs/swagger';
import { AccessRefreshResponseDto } from './dto/access-refresh-response.dto';
import { SingUpResponseDto } from './dto/sing-up-response.dto';
import { AccessTokenResponseDto } from './dto/access-token-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ type: AccessRefreshResponseDto })
  @Post('/sing-in')
  public singIn(@Body() singIn: SingInDto) {
    return this.authService.singIn(singIn);
  }

  @ApiResponse({ type: SingUpResponseDto })
  @Post('/sing-up')
  public singUp(@Body() singUp: SingUpDto) {
    return this.authService.singUp(singUp);
  }

  @ApiResponse({ type: AccessTokenResponseDto })
  @Post('/refresh')
  public refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshToken.refreshToken);
  }
}
