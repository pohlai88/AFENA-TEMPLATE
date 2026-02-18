import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export async function calculateRoyalty(
  db: NeonHttpDatabase,
  unitId: string,
  grossSales: number,
  royaltyRate: number,
): Promise<{ amount: number; minimumFee: number }> {
  const calculated = grossSales * (royaltyRate / 100);
  const minimumFee = 500; // $500 minimum monthly royalty
  return { amount: Math.max(calculated, minimumFee), minimumFee };
}

export function applyRoyaltyTiers(sales: number): number {
  if (sales > 1000000) return 6; // 6% for sales over $1M
  if (sales > 500000) return 7; // 7% for $500k-$1M
  return 8; // 8% standard rate
}
