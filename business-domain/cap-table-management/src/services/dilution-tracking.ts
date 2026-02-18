/**
 * Dilution Tracking Service
 * 
 * Pre-money and post-money dilution analysis for fundraising
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { DilutionAnalysis } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const modelFundingRoundSchema = z.object({
  roundName: z.string(),
  preMoneyValuation: z.number().positive(),
  newInvestment: z.number().positive(),
  optionPoolPercent: z.number().min(0).max(100).optional(),
});

// ── Types ──────────────────────────────────────────────────────────

export type ModelFundingRoundInput = z.infer<typeof modelFundingRoundSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Model dilution impact of a new funding round
 */
export async function modelFundingRound(
  db: NeonHttpDatabase,
  orgId: string,
  input: ModelFundingRoundInput,
): Promise<DilutionAnalysis> {
  const validated = modelFundingRoundSchema.parse(input);

  // TODO: Implement database logic
  // 1. Get current cap table
  // 2. Calculate post-money valuation
  // 3. Calculate price per share  
  // 4. Calculate new shares to issue
  // 5. Calculate dilution for each existing shareholder
  // 6. Return dilution analysis

  throw new Error('Not implemented');
}

/**
 * Calculate post-money valuation
 */
export function calculatePostMoneyValuation(
  preMoneyValuation: number,
  newInvestment: number,
): number {
  return preMoneyValuation + newInvestment;
}

/**
 * Calculate price per share
 */
export function calculatePricePerShare(
  preMoneyValuation: number,
  fullyDilutedShares: number,
): number {
  return preMoneyValuation / fullyDilutedShares;
}

/**
 * Calculate number of new shares to issue
 */
export function calculateNewShares(
  newInvestment: number,
  pricePerShare: number,
): number {
  return Math.floor(newInvestment / pricePerShare);
}

/**
 * Calculate dilution percentage
 */
export function calculateDilution(
  currentOwnership: number,
  postRoundOwnership: number,
): number {
  return ((currentOwnership - postRoundOwnership) / currentOwnership) * 100;
}

/**
 * Calculate ownership percentage after round
 */
export function calculatePostRoundOwnership(
  currentShares: number,
  totalSharesPreRound: number,
  newShares: number,
): number {
  const totalSharesPostRound = totalSharesPreRound + newShares;
  return (currentShares / totalSharesPostRound) * 100;
}

/**
 * Create option pool and calculate impact
 */
export async function modelOptionPoolCreation(
  db: NeonHttpDatabase,
  orgId: string,
  poolSizePercent: number,
): Promise<{
  poolShares: number;
  dilutionToExisting: number;
  postPoolCapTable: Array<{
    shareholderId: string;
    shareholderName: string;
    prePoolOwnership: number;
    postPoolOwnership: number;
    dilution: number;
  }>;
}> {
  // TODO: Implement database logic
  // 1. Get current cap table
  // 2. Calculate shares needed for pool
  // 3. Calculate dilution to all existing shareholders
  // 4. Return impact analysis

  throw new Error('Not implemented');
}

/**
 * Compare multiple funding scenarios
 */
export async function compareScenarios(
  db: NeonHttpDatabase,
  orgId: string,
  scenarios: Array<{
    name: string;
    preMoneyValuation: number;
    newInvestment: number;
  }>,
): Promise<Array<{
  scenarioName: string;
  analysis: DilutionAnalysis;
}>> {
  // TODO: Implement scenario comparison
  // 1. Model each scenario
  // 2. Compare dilution across scenarios
  // 3. Return comparison

  throw new Error('Not implemented');
}

/**
 * Calculate anti-dilution protection impact
 */
export function calculateAntiDilutionAdjustment(
  originalPrice: number,
  newPrice: number,
  originalShares: number,
  adjustmentType: 'FULL_RATCHET' | 'WEIGHTED_AVERAGE_BROAD' | 'WEIGHTED_AVERAGE_NARROW',
): number {
  if (adjustmentType === 'FULL_RATCHET') {
    // Full ratchet: adjust conversion price to new lower price
    return (originalPrice / newPrice) * originalShares - originalShares;
  }

  // TODO: Implement weighted average calculations
  throw new Error('Weighted average anti-dilution not implemented');
}

