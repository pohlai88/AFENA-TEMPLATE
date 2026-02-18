/**
 * Valuation Service
 * 
 * Fair value and mark-to-market valuation
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { Valuation } from '../types/common.js';
import { ValuationMethod, valuationSchema } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createValuationSchema = valuationSchema.omit({ id: true, createdAt: true });

// ── Types ──────────────────────────────────────────────────────────

export type CreateValuationInput = z.infer<typeof createValuationSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create valuation record
 */
export async function createValuation(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateValuationInput,
): Promise<Valuation> {
  const validated = createValuationSchema.parse(input);

  // TODO: Implement database logic
  // 1. Create valuation record
  // 2. Update investment current value
  // 3. Return valuation

  throw new Error('Not implemented');
}

/**
 * Get valuation history
 */
export async function getValuationHistory(
  db: NeonHttpDatabase,
  orgId: string,
  investmentId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<Valuation[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get latest valuation
 */
export async function getLatestValuation(
  db: NeonHttpDatabase,
  orgId: string,
  investmentId: string,
): Promise<Valuation | null> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Bulk revalue all investments
 */
export async function bulkRevalueInvestments(
  db: NeonHttpDatabase,
  orgId: string,
  valuationDate: Date,
  marketPrices: Map<string, number>, // investmentId -> current price
  valuedBy: string,
): Promise<Valuation[]> {
  // TODO: Implement bulk valuation
  // 1. Get all active investments
  // 2. Create valuation for each with market price
  // 3. Update investment values
  // 4. Return valuations

  throw new Error('Not implemented');
}

/**
 * Calculate fair value using equity method
 */
export function calculateEquityMethodValue(
  costBasis: number,
  shareOfEarnings: number,
  dividendsReceived: number,
): number {
  return costBasis + shareOfEarnings - dividendsReceived;
}

/**
 * Calculate amortized cost for debt securities
 */
export function calculateAmortizedCost(
  purchasePrice: number,
  faceValue: number,
  periodsElapsed: number,
  totalPeriods: number,
): number {
  const discount = faceValue - purchasePrice;
  const amortizationPerPeriod = discount / totalPeriods;
  return purchasePrice + (amortizationPerPeriod * periodsElapsed);
}

/**
 * Determine appropriate valuation method
 */
export function determineValuationMethod(
  ownershipPercent: number,
  hasSignificantInfluence: boolean,
  isPubliclyTraded: boolean,
): ValuationMethod {
  if (isPubliclyTraded) {
    return ValuationMethod.MARK_TO_MARKET;
  }

  if (ownershipPercent >= 20 || hasSignificantInfluence) {
    return ValuationMethod.EQUITY_METHOD;
  }

  if (ownershipPercent > 50) {
    return ValuationMethod.EQUITY_METHOD; // Or consolidation
  }

  return ValuationMethod.COST_METHOD;
}

