import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

// HTTP driver — use for serverless functions (Vercel, Cloudflare Workers, etc.)
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
export type Database = typeof db;
