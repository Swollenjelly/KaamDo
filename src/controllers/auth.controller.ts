import { Router } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';

const r = Router();

const registerDto = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(['customer','vendor','admin']).optional()
});

const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

r.post('/register', async (req, res, next) => {
  try {
    const { email, name, password, role } = registerDto.parse(req.body);
    const user = await AuthService.register(email, name, password, role ?? 'customer');
    res.status(201).json({ user });
    return 1
  } catch (e) { next(e); }
});

r.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginDto.parse(req.body);
    const data = await AuthService.login(email, password);
    res.json(data);
  } catch (e) { next(e); }
});

export default r;
