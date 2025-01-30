import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AccountModule } from '../account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { config as dotenvConfig } from 'dotenv';
import { AuthGuard } from './guard/auth.guard';
import { RoleGuard } from './guard/role.guard';
dotenvConfig({ path: '.env' });

@Module({
  imports: [
    UserModule,
    AccountModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RoleGuard],
  exports: [AuthService, AuthGuard, RoleGuard],
})
export class AuthModule {}
