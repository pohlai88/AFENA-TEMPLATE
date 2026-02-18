/**
 * FX Rate Manager Service
 *
 * Manages foreign exchange rates from multiple sources.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';

// Schemas
export const upsertFxRateSchema = z.object({
  baseCurrency: z.string().length(3),
  quoteCurrency: z.string().length(3),
  rateType: z.enum(['spot', 'average', 'month_end', 'quarter_end', 'budget', 'historical']),
  rate: z.string().regex(/^\d+\.\d{6}$/),
  effectiveDate: z.string().datetime(),
  source: z.enum(['manual', 'api', 'bank_feed', 'central_bank']),
  sourceRef: z.string().optional(),
});

export const lookupRateSchema = z.object({
  baseCurrency: z.string().length(3),
  quoteCurrency: z.string().length(3),
  rateType: z.enum(['spot', 'average', 'month_end', 'quarter_end', 'budget', 'historical']),
  asOfDate: z.string().datetime(),
});

export type UpsertFxRateInput = z.infer<typeof upsertFxRateSchema>;
export type LookupRateInput = z.infer<typeof lookupRateSchema>;

// Types
export type RateType = 'spot' | 'average' | 'month_end' | 'quarter_end' | 'budget' | 'historical';
export type RateSource = 'manual' | 'api' | 'bank_feed' | 'central_bank';

export interface FxRate {
  id: string;
  baseCurrency: string;
  quoteCurrency: string;
  rateType: RateType;
  rate: string;
  effectiveDate: string;
  source: RateSource;
  sourceRef: string | null;
  createdAt: string;
  createdBy: string;
}

/**
 * Upsert FX rate
 *
 * Inserts or updates FX rate for a currency pair on a specific date.
 * Rate is stored as decimal(19,6) for precision.
 */
export async function upsertFxRate(
  db: NeonHttpDatabase,
  orgId: string,
  input: UpsertFxRateInput,
): Promise<FxRate> {
  const validated = upsertFxRateSchema.parse(input);

  // TODO: Insert or update fx_rates table
  // TODO: Validate currency codes exist
  // TODO: Prevent circular rates (EUR->USD and USD->EUR must be reciprocal)
  // TODO: Log rate change audit trail
  // TODO: Trigger rate change notifications

  return {
    id: '',
    baseCurrency: validated.baseCurrency,
    quoteCurrency: validated.quoteCurrency,
    rateType: validated.rateType,
    rate: validated.rate,
    effectiveDate: validated.effectiveDate,
    source: validated.source,
    sourceRef: validated.sourceRef || null,
    createdAt: new Date().toISOString(),
    createdBy: 'system',
  };
}

/**
 * Lookup FX rate for transaction date
 *
 * Returns latest rate on or before asOfDate for the currency pair.
 * Falls back to inverse rate if direct rate not available.
 */
export async function lookupRate(
  db: NeonHttpDatabase,
  orgId: string,
  input: LookupRateInput,
): Promise<FxRate | null> {
  const validated = lookupRateSchema.parse(input);

  // TODO: Query fx_rates WHERE effectiveDate <= asOfDate
  // TODO: Order by effectiveDate DESC
  // TODO: Return latest rate
  // TODO: If not found, try inverse rate (1/rate)
  // TODO: If still not found, try cross rate (via USD)

  return null;
}

/**
 * Calculate inverse rate
 *
 * If EUR/USD = 1.100000, then USD/EUR = 0.909091
 */
export function calculateInverseRate(rate: string): string {
  const rateNum = parseFloat(rate);
  if (rateNum === 0) {
    throw new Error('Cannot calculate inverse of zero rate');
  }
  return (1 / rateNum).toFixed(6);
}

/**
 * Validate rate reciprocity
 *
 * EUR/USD * USD/EUR should = 1.000000 (within tolerance)
 */
export function validateRateReciprocity(
  directRate: string,
  inverseRate: string,
  tolerance = 0.0001,
): boolean {
  const product = parseFloat(directRate) * parseFloat(inverseRate);
  return Math.abs(product - 1.0) < tolerance;
}
