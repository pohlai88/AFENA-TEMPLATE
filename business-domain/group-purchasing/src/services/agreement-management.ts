/**
 * Agreement Management Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { PurchaseAgreement } from '../types/common.js';
import { purchaseAgreementSchema } from '../types/common.js';

export const createAgreementSchema = purchaseAgreementSchema.omit({ id: true, createdAt: true });

export async function createPurchaseAgreement(
  db: NeonHttpDatabase,
  orgId: string,
  input: z.infer<typeof createAgreementSchema>,
): Promise<PurchaseAgreement> {
  // TODO: Implement
  throw new Error('Not implemented');
}

export async function getPurchaseAgreements(
  db: NeonHttpDatabase,
  orgId: string,
): Promise<PurchaseAgreement[]> {
  // TODO: Implement
  throw new Error('Not implemented');
}

export function calculateVolumeTier(
  purchaseVolume: number,
  tiers: Array<{ minVolume: number; discountPercent: number }>,
): number {
  const sorted = [...tiers].sort((a, b) => b.minVolume - a.minVolume);
  
  for (const tier of sorted) {
    if (purchaseVolume >= tier.minVolume) {
      return tier.discountPercent;
    }
  }
  
  return 0;
}

