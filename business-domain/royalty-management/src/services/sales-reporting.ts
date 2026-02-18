import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export async function submitSalesReport(
  db: NeonHttpDatabase,
  unitId: string,
  weekEnding: Date,
  sales: number,
): Promise<any> {
  throw new Error('Database integration pending');
}

export function validateSalesReport(current: number, historical: number[]): {
  valid: boolean;
  variance: number;
  flag: boolean;
} {
  const avg = historical.reduce((a, b) => a + b, 0) / historical.length;
  const variance = ((current - avg) / avg) * 100;
  return { valid: Math.abs(variance) < 50, variance, flag: variance < -20 };
}
