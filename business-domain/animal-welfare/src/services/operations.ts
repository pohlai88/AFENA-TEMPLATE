import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

interface CreateInput {
  [key: string]: unknown;
}

interface EntityResult {
  id: string;
  [key: string]: unknown;
}

export function create(_db: NeonHttpDatabase, _orgId: string, _input: CreateInput): EntityResult {
   throw new Error('Not implemented');
}

export function getAll(_db: NeonHttpDatabase, _orgId: string): EntityResult[] {
  throw new Error('Not implemented');
}

export function process(data: unknown): unknown {
  return data;
}
