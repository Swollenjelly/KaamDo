import { Request, Response, NextFunction } from 'express';
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  const msg = typeof err?.message === 'string' ? err.message : 'Server error';
  res.status(400).json({ error: msg });
}
