import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppDataSource from '../../config/data-source';
import { User } from '../users/user.entity';
import { VendorProfile } from '../vendors/vendor.entity';
import { env } from '../../config/env';

export const AuthService = {
  async register(email: string, name: string, password: string, role: 'customer'|'vendor'|'admin'='customer') {
    const repo = AppDataSource.getRepository(User);
    const existing = await repo.findOne({ where: { email } });
    if (existing) throw new Error('Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = repo.create({ email, name, passwordHash, role });
    await repo.save(user);

    if (role === 'vendor') {
      const vRepo = AppDataSource.getRepository(VendorProfile);
      await vRepo.save(vRepo.create({ userId: user.id }));
    }
    return user;
  },

  async login(email: string, password: string) {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');

    const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }
};
