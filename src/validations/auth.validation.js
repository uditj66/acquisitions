import { z } from 'zod';
export const signUpSchema = z.object({
  name: z.string().min(4).max(50).trim(),
  email: z.email().min(15).max(50).toLowerCase(),
  password: z.string().min(6).max(50),
  role: z.enum(['user', 'admin']).default('user'),
});
export const signInSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(6).max(50),
});
