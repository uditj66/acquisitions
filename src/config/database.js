import dotenv from 'dotenv';
dotenv.config();
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const neon = neon(process.env.DATABASE_URL);
const db = drizzle(neon);

export { db, neon };
