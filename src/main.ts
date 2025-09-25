// src/main.ts
import 'reflect-metadata';                 // must be first
import app from './app';
import { env } from './config/env';
import AppDataSource from './config/data-source';

(async () => {
  await AppDataSource.initialize();
  console.log('📦 Database connected');
  app.listen(env.PORT, () => console.log(`🚀 API on http://localhost:${env.PORT}`));
})();
