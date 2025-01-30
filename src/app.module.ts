import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { config as dotenvConfig } from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
dotenvConfig({ path: '.env' });

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    MongooseModule.forRoot(process.env.MONGODB_URL as string),
    AccountModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
