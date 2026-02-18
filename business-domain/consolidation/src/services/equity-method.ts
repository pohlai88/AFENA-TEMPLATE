/**
 * Equity Method Service
 *
 * Applies equity method accounting for associates (20-50% ownership).
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';

// Schemas
export const applyEquityMethodSchema = z.object({
  associateId: z.string().uuid(),
  fiscalPeriodId: z.string().uuid(),
  ownershipPercent: z.string().regex(/^\d+\.\d{2}$/),
  shareOfEarnings: z.number().int(),
  dividendsReceived: z.number().int().default(0),
  shareOfOCI: z.number().int().default(0),
});

export type ApplyEquityMethodInput = z.infer<typeof applyEquityMethodSchema>;

// Types
export interface EquityMethodAdjustment {
  associateId: string;
  fiscalPeriodId: string;
  ownershipPercent: string;
  openingInvestmentBalance: number;
  shareOfEarnings: number;
  dividendsReceived: number;
  shareOfOCI: number;
  closingInvestmentBalance: number;
  incomeRecognized: number;
  currencyCode: string;
}

/**
 * Apply equity method accounting for associate
 *
 * Equity method is used for investments where investor has significant
 * influence (typically 20-50% ownership).
 *
 * Investment balance = Cost + Share of Earnings - Dividends Received + Share of OCI
 *
 * Income recognized = Share of Earnings (on P&L)
 */
export async function applyEquityMethod(
  db: NeonHttpDatabase,
  orgId: string,
  input: ApplyEquityMethodInput,
): Promise<EquityMethodAdjustment> {
  const validated = applyEquityMethodSchema.parse(input);

  // TODO: Query investment_in_associates for opening balance
  // TODO: Calculate share of earnings
  // TODO: Adjust for dividends received
  // TODO: Add share of OCI
  // TODO: Generate journal entries:
  //   - Dr. Investment in Associate / Cr. Income from Associate (earnings)
  //   - Dr. Cash / Cr. Investment in Associate (dividends)
  //   - Dr. Investment in Associate / Cr. OCI (other comprehensive income)

  return {
    associateId: validated.associateId,
    fiscalPeriodId: validated.fiscalPeriodId,
    ownershipPercent: validated.ownershipPercent,
    openingInvestmentBalance: 0,
    shareOfEarnings: validated.shareOfEarnings,
    dividendsReceived: validated.dividendsReceived,
    shareOfOCI: validated.shareOfOCI,
    closingInvestmentBalance: 0,
    incomeRecognized: validated.shareOfEarnings,
    currencyCode: 'USD',
  };
}

/**
 * Calculate closing investment balance
 */
export function calculateInvestmentBalance(
  openingBalance: number,
  shareOfEarnings: number,
  dividendsReceived: number,
  shareOfOCI: number,
  impairment: number,
): number {
  return (
    openingBalance +
    shareOfEarnings -
    dividendsReceived +
    shareOfOCI -
    impairment
  );
}

/**
 * Test for impairment under IAS 36
 *
 * If carrying amount > recoverable amount, recognize impairment
 */
export function testForImpairment(
  carryingAmount: number,
  recoverableAmount: number,
): number {
  if (carryingAmount > recoverableAmount) {
    return carryingAmount - recoverableAmount;
  }
  return 0;
}
