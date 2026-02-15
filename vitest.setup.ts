/**
 * Vitest setup — load env from apps/web/.env (single source of truth).
 * Integration tests (cross-tenant, list-entities) need DATABASE_URL.
 */
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), 'apps/web/.env') });
