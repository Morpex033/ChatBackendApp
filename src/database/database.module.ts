import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from './database.provider';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseProviders,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}
