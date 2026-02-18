/**
 * FX Revaluation Service
 *
 * Revalues monetary assets and liabilities to current FX rates.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';

// Schemas
export const revaluateAssetsSchema = z.object({
  assetType: z.enum(['accounts_receivable', 'accounts_payable', 'cash', 'loan']),
  companyId: z.string().uuid(),
  asOfDate: z.string().datetime(),
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3),
});

export type RevaluateAssetsInput = z.infer<typeof revaluateAssetsSchema>;

// Types
export type MonetaryAssetType = 'accounts_receivable' | 'accounts_payable' | 'cash' | 'loan';

export interface RevaluationResult {
  assetType: MonetaryAssetType;
  companyId: string;
  asOfDate: string;
  fromCurrency: string;
  toCurrency: string;
  totalDocuments: number;
  originalAmount: number;
  revaluedAmount: number;
  unrealizedGainLoss: number;
  journalEntryId: string | null;
}

/**
 * Revalue monetary assets to current FX rate
 *
 * Process:
 * 1. Identify open monetary items in foreign currency
 * 2. Get original booking rate and amount
 * 3. Get current rate as of revaluation date
 * 4. Calculate difference (unrealized gain/loss)
 * 5. Generate journal entry
 */
export async function revaluateMonetaryAssets(
  db: NeonHttpDatabase,
  orgId: string,
  input: RevaluateAssetsInput,
): Promise<RevaluationResult> {
  const validated = revaluateAssetsSchema.parse(input);

  // TODO: Query open AR/AP/cash/loans in foreign currency
  // TODO: For each document:
  //       - Original amount * original rate = booking value
  //       - Original amount * current rate = current value
  //       - Difference = unrealized gain/loss
  // TODO: Generate journal entry:
  //       Dr. AR/Cash/Loan (if gain) or Cr. (if loss)
  //       Cr. Unrealized FX Gain (if gain) or Dr. Unrealized FX Loss (if loss)

  return {
    assetType: validated.assetType,
    companyId: validated.companyId,
    asOfDate: validated.asOfDate,
    fromCurrency: validated.fromCurrency,
    toCurrency: validated.toCurrency,
    totalDocuments: 0,
    originalAmount: 0,
    revaluedAmount: 0,
    unrealizedGainLoss: 0,
    journalEntryId: null,
  };
}

/**
 * Calculate unrealized FX gain/loss for single document
 */
export function calculateUnrealizedGL(
  originalAmountFC: number,
  originalRate: string,
  currentRate: string,
): number {
  const originalBC = Math.round(originalAmountFC * parseFloat(originalRate));
  const currentBC = Math.round(originalAmountFC * parseFloat(currentRate));
  return currentBC - originalBC;
}

/**
 * Determine GL account for unrealized FX
 */
export function getUnrealizedGLAccount(
  assetType: MonetaryAssetType,
  isGain: boolean,
): string {
  // TODO: Lookup from chart of accounts
  if (isGain) {
    return '7910'; // Unrealized FX Gain
  } else {
    return '8910'; // Unrealized FX Loss
  }
}
