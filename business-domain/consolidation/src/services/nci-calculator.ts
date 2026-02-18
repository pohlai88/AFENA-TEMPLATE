/**
 * NCI Calculator Service
 *
 * Calculates non-controlling interest for partial ownership subsidiaries.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';

// Schemas
export const calculateNCISchema = z.object({
  subsidiaryId: z.string().uuid(),
  fiscalPeriodId: z.string().uuid(),
  ownershipPercent: z.string().regex(/^\d+\.\d{2}$/),
});

export type CalculateNCIInput = z.infer<typeof calculateNCISchema>;

// Types
export interface NCICalculation {
  subsidiaryId: string;
  fiscalPeriodId: string;
  nciOwnershipPercent: string;
  subsidiaryNetIncome: number;
  nciShareOfIncome: number;
  subsidiaryOCI: number;
  nciShareOfOCI: number;
  openingNCIBalance: number;
  closingNCIBalance: number;
  currencyCode: string;
}

/**
 * Calculate non-controlling interest (NCI)
 *
 * NCI represents the portion of a subsidiary's equity and earnings
 * not owned by the parent.
 *
 * Example: Parent owns 75% of Sub
 * - NCI = 25% of Sub's equity and earnings
 */
export async function calculateNCI(
  db: NeonHttpDatabase,
  orgId: string,
  input: CalculateNCIInput,
): Promise<NCICalculation> {
  const validated = calculateNCISchema.parse(input);

  const parentOwnership = parseFloat(validated.ownershipPercent);
  const nciOwnership = 100 - parentOwnership;

  // TODO: Query subsidiary financial statements for period
  // TODO: Calculate NCI share of net income
  // TODO: Calculate NCI share of OCI
  // TODO: Roll forward NCI balance
  // TODO: Handle NCI transactions (buy/sell minority stakes)

  return {
    subsidiaryId: validated.subsidiaryId,
    fiscalPeriodId: validated.fiscalPeriodId,
    nciOwnershipPercent: nciOwnership.toFixed(2),
    subsidiaryNetIncome: 0,
    nciShareOfIncome: 0,
    subsidiaryOCI: 0,
    nciShareOfOCI: 0,
    openingNCIBalance: 0,
    closingNCIBalance: 0,
    currencyCode: 'USD',
  };
}

/**
 * Calculate NCI share of subsidiary earnings
 */
export function calculateNCIShare(
  subsidiaryAmount: number,
  nciPercent: string,
): number {
  const percent = parseFloat(nciPercent) / 100;
  return Math.round(subsidiaryAmount * percent);
}

/**
 * Roll forward NCI balance
 *
 * Closing NCI = Opening NCI + NCI Share of Income + NCI Share of OCI
 *               - Dividends to NCI + NCI Transactions
 */
export function rollForwardNCI(
  openingBalance: number,
  shareOfIncome: number,
  shareOfOCI: number,
  dividends: number,
  transactions: number,
): number {
  return (
    openingBalance + shareOfIncome + shareOfOCI - dividends + transactions
  );
}
