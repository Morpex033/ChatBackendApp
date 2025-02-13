import { Logger } from '@nestjs/common';
import { database } from '../database.provider';

export async function runMigration() {
  const logger = new Logger('migrationRunner');

  try {
    logger.log('Run migrations...');
    await database.initialize();
    await database.runMigrations();
  } catch (error) {
    logger.error('Cannot start the app. Migrations have failed!', error);
    process.exit(0);
  }
}
