import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../modules/user.entity';
import { VendorProfile } from '../modules/vendor.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [User, VendorProfile],      // ← not a glob
  migrations: ['src/migrations/*.ts'],
});

export default AppDataSource;
