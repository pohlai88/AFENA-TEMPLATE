import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export async function create(db: NeonHttpDatabase, orgId: string, input: any): Promise<any> {
  throw new Error('Not implemented');
}

export async function getAll(db: NeonHttpDatabase, orgId: string): Promise<any[]> {
  throw new Error('Not implemented');
}

export function calculate(input: number): number {
  return input * 1.0;
}
