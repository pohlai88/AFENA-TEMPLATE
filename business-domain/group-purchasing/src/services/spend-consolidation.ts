/**
 * Spend Consolidation Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { ConsolidatedSpend } from '../types/common.js';

export async function getConsolidatedSpend(
  db: NeonHttpDatabase,
  orgId: string,
  period: string,
): Promise<ConsolidatedSpend[]> {
  // TODO: Implement
  throw new Error('Not implemented');
}

export function calculatePotentialSavings(
  currentSpend: number,
  currentDiscountPercent: number,
  targetDiscountPercent: number,
): number {
  const currentSavings = currentSpend * (currentDiscountPercent / 100);
  const targetSavings = currentSpend * (targetDiscountPercent / 100);
  return targetSavings - currentSavings;
}

