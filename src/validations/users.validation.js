import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a valid number').transform(Number),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(4).max(50).trim().optional(),
    email: z.string().email().min(15).max(50).toLowerCase().optional(),
    password: z.string().min(6).max(50).optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
