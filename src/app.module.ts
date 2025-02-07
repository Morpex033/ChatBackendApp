import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { config as dotenvConfig } from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
dotenvConfig({ path: '.env' });

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    MongooseModule.forRoot(process.env.MONGODB_URL as string),
    AccountModule,
    ChatModule,
    AuthModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
