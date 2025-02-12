import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

export const databaseProviders: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DB_DSN,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
  migrations: [join(__dirname, 'migrations/postgres', '*.{js,ts}')],
  migrationsRun: false,
};

export const database = new DataSource(databaseProviders);
