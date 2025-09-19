import { pgTable, varchar, serial, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstname: varchar('name', { length: 250 }).notNull(),
  lastname: varchar('name', { length: 250 }).notNull(),
  email: varchar('email', { length: 250 }).notNull().unique(),
  password: varchar('password', { length: 250 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
