#!/usr/bin/env node
/**
 * GAP-DB-004: One-time backfill of search_documents.
 * Run: pnpm --filter web search:bootstrap (or from apps/web: pnpm search:bootstrap)
 */
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

const { backfillSearchDocuments } = await import('afena-search');
const result = await backfillSearchDocuments();
console.log('Bootstrap:', result);
