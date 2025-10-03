import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../modules/user.entity';
import { VendorProfile } from '../modules/vendor.entity';

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   url: env.DATABASE_URL,
//    entities: [User, VendorProfile],
//   migrations: ['src/migrations/*.ts'],
//   synchronize: true,
//   logging: false
// });


const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: ['src/modules/**/*.entity.ts'],   // << important
  migrations: ['src/migrations/*.ts'],
});


export default AppDataSource;