import { Router } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';

const r = Router();

// ✅ Register schema: phone required, email optional
const registerDto = z.object({
  phone: z.string().trim().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number is too long'),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(['customer', 'vendor', 'admin']).optional(),
  email: z.string().email().optional()
});

// ✅ Login via phone + password
const loginDto = z.object({
  phone: z.string().trim().min(10).max(15),
  password: z.string().min(6)
});

r.post('/register', async (req, res, next) => {
  try {
    const { phone, name, password, role, email } = registerDto.parse(req.body);
    const user = await AuthService.register(phone, name, password, role ?? 'customer', email);
    res.status(201).json({ user });
  } catch (e) { next(e); }
});

r.post('/login', async (req, res, next) => {
  try {
    const { phone, password } = loginDto.parse(req.body);
    const data = await AuthService.login(phone, password);
    res.json(data);
  } catch (e) { next(e); }
});

export default r;
