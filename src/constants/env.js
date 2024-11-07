import dotenv from 'dotenv';

dotenv.config();

// Log environment variables to check values
console.log('Loaded CLIENT_VERSION from env:', process.env.CLIENT_VERSION);

export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST || '0.0.0.0';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

export const DB_HOST =
  process.env.DB1_HOST || 'database-1.c5ii0cy08oim.ap-northeast-2.rds.amazonaws.com';
export const DB_PORT = process.env.DB1_PORT || 3306;
export const DB_USER = process.env.DB1_USER || 'admin';
export const DB_PASSWORD = process.env.DB1_PASSWORD || 'jkl123123';
export const DB_NAME = process.env.DB1_NAME || 'TOWER_USER_DB';

console.log('Exported CLIENT_VERSION:', CLIENT_VERSION);
