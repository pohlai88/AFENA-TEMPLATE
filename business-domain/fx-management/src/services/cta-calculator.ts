/**
 * CTA Calculator Service
 *
 * Calculates Cumulative Translation Adjustment for foreign subsidiaries.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';

// Schemas
export const calculateCTASchema = z.object({
  subsidiaryId: z.string().uuid(),
  fiscalPeriodId: z.string().uuid(),
  functionalCurrency: z.string().length(3),
  reportingCurrency: z.string().length(3),
});

export const rollForwardCTASchema = z.object({
  subsidiaryId: z.string().uuid(),
  fiscalPeriodId: z.string().uuid(),
  openingCTA: z.number().int(),
  periodCTA: z.number().int(),
  disposalRelease: z.number().int().default(0),
});

export type CalculateCTAInput = z.infer<typeof calculateCTASchema>;
export type RollForwardCTAInput = z.infer<typeof rollForwardCTASchema>;

// Types
export interface CTACalculation {
  subsidiaryId: string;
  fiscalPeriodId: string;
  functionalCurrency: string;
  reportingCurrency: string;
  openingNetAssets: number;
  openingRate: string;
  netIncome: number;
  averageRate: string;
  closingNetAssets: number;
  closingRate: string;
  periodCTA: number;
  cumulativeCTA: number;
}

/**
 * Calculate CTA (Cumulative Translation Adjustment)
 *
 * CTA arises when translating foreign subsidiary to group currency.
 * It represents the difference between:
 * - Opening net assets @ opening rate
 * - Plus net income @ average rate
 * - Minus closing net assets @ closing rate
 *
 * CTA is recorded in OCI (equity) and released to P&L on disposal.
 */
export async function calculateCTA(
  db: NeonHttpDatabase,
  orgId: string,
  input: CalculateCTAInput,
): Promise<CTACalculation> {
  const validated = calculateCTASchema.parse(input);

  // TODO: Query subsidiary trial balance in functional currency
  // TODO: Get opening net assets
  // TODO: Get net income for period
  // TODO: Get closing net assets
  // TODO: Lookup FX rates:
  //       - Opening rate (prior period closing)
  //       - Average rate (period average)
  //       - Closing rate (period end)
  // TODO: Calculate period CTA
  // TODO: Roll forward cumulative CTA

  return {
    subsidiaryId: validated.subsidiaryId,
    fiscalPeriodId: validated.fiscalPeriodId,
    functionalCurrency: validated.functionalCurrency,
    reportingCurrency: validated.reportingCurrency,
    openingNetAssets: 0,
    openingRate: '1.000000',
    netIncome: 0,
    averageRate: '1.000000',
    closingNetAssets: 0,
    closingRate: '1.000000',
    periodCTA: 0,
    cumulativeCTA: 0,
  };
}

/**
 * Roll forward cumulative CTA
 *
 * Cumulative CTA = Opening CTA + Period CTA - Disposal Release
 */
export async function rollForwardCTA(
  db: NeonHttpDatabase,
  orgId: string,
  input: RollForwardCTAInput,
): Promise<number> {
  const validated = rollForwardCTASchema.parse(input);

  const cumulativeCTA =
    validated.openingCTA + validated.periodCTA - validated.disposalRelease;

  // TODO: Update cta_balance table
  // TODO: If disposal release > 0, reclassify from OCI to P&L

  return cumulativeCTA;
}

/**
 * Calculate period CTA using current rate method
 *
 * Period CTA = (Opening NA @ opening rate) + (Net Income @ avg rate)
 *              - (Closing NA @ closing rate)
 */
export function calculatePeriodCTA(
  openingNetAssets: number,
  openingRate: string,
  netIncome: number,
  averageRate: string,
  closingNetAssets: number,
  closingRate: string,
): number {
  const openingTranslated = Math.round(
    openingNetAssets * parseFloat(openingRate),
  );

  const incomeTranslated = Math.round(netIncome * parseFloat(averageRate));

  const closingTranslated = Math.round(
    closingNetAssets * parseFloat(closingRate),
  );

  return openingTranslated + incomeTranslated - closingTranslated;
}

/**
 * Release CTA to P&L on disposal of foreign operation
 *
 * When a foreign subsidiary is sold, the cumulative CTA is released
 * from equity (OCI) to P&L as part of gain/loss on disposal.
 */
export function releaseCTAOnDisposal(cumulativeCTA: number): {
  ociRelease: number;
  plImpact: number;
} {
  return {
    ociRelease: -cumulativeCTA, // Reverse from equity
    plImpact: cumulativeCTA, // Recognize in P&L
  };
}
