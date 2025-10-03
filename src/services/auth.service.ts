import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppDataSource from '../config/data-source';
import { User } from '../modules/user.entity';
import { VendorProfile } from '../modules/vendor.entity';
import { env } from '../config/env';

export const AuthService = {
  async register(
    phone: string,
    name: string,
    password: string,
    role: 'customer' | 'vendor' | 'admin' = 'customer',
    email?: string
  ) {
    const repo = AppDataSource.getRepository(User);

    // ✅ ensure phone unique
    const existingByPhone = await repo.findOne({ where: { phone } });
    if (existingByPhone) throw new Error('Phone already in use');

    // ✅ ensure email unique (if given)
    if (email) {
      const existingByEmail = await repo.findOne({ where: { email } });
      if (existingByEmail) throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = repo.create({ phone, email, name, passwordHash, role });
    await repo.save(user);

    if (role === 'vendor') {
      const vRepo = AppDataSource.getRepository(VendorProfile);
      await vRepo.save(vRepo.create({ userId: user.id }));
    }

    return user;
  },

  async login(phone: string, password: string) {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { phone } });
    if (!user) throw new Error('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');

    const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '7d' });
    return {
      token,
      user: { id: user.id, phone: user.phone, email: user.email ?? null, name: user.name, role: user.role }
    };
  }
};
