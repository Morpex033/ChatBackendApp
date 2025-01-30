import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../database/entity/account.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Account]), UserModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
