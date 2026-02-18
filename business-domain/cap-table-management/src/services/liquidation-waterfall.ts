/**
 * Liquidation Waterfall Service
 * 
 * Calculates liquidation preference distributions for M&A or IPO scenarios
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { LiquidationWaterfall, ShareClass } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const calculateWaterfallSchema = z.object({
  exitValue: z.number().positive(),
  asOfDate: z.coerce.date().optional(),
});

// ── Types ──────────────────────────────────────────────────────────

export type CalculateWaterfallInput = z.infer<typeof calculateWaterfallSchema>;

interface PreferredShareDetails {
  shareholderId: string;
  shareholderName: string;
  shareClass: ShareClass;
  shares: number;
  investmentAmount: number;
  liquidationPreferenceMultiple: number;
  hasParticipation: boolean;
  seniorityRank: number; // Lower number = more senior
}

// ── Functions ──────────────────────────────────────────────────────

/**
 * Calculate liquidation waterfall distribution
 */
export async function calculateLiquidationWaterfall(
  db: NeonHttpDatabase,
  orgId: string,
  input: CalculateWaterfallInput,
): Promise<LiquidationWaterfall> {
  const validated = calculateWaterfallSchema.parse(input);

  // TODO: Implement database logic
  // 1. Get all shareholdings as of date
  // 2. Get share class details (preferences, participation)
  // 3. Sort preferred shares by seniority
  // 4. Distribute preferences first
  // 5. Handle participating preferred
  // 6. Distribute remaining to common
  // 7. Return waterfall

  throw new Error('Not implemented');
}

/**
 * Calculate preferred liquidation preferences
 */
export function calculatePreferredDistributions(
  preferredShares: PreferredShareDetails[],
  exitValue: number,
): {
  distributions: Map<string, number>;
  remainingValue: number;
} {
  // Sort by seniority (most senior first)
  const sorted = [...preferredShares].sort((a, b) => a.seniorityRank - b.seniorityRank);
  
  const distributions = new Map<string, number>();
  let remainingValue = exitValue;

  // Distribute liquidation preferences
  for (const share of sorted) {
    const preferenceAmount = share.investmentAmount * share.liquidationPreferenceMultiple;
    const distribution = Math.min(preferenceAmount, remainingValue);
    
    distributions.set(share.shareholderId, distribution);
    remainingValue -= distribution;

    if (remainingValue <= 0) break;
  }

  return { distributions, remainingValue };
}

/**
 * Calculate participating preferred distributions
 */
export function calculateParticipatingDistributions(
  preferredShares: PreferredShareDetails[],
  commonShares: Array<{ shareholderId: string; shares: number }>,
  remainingValue: number,
  totalShares: number,
): Map<string, number> {
  const distributions = new Map<string, number>();

  // Separate participating from non-participating
  const participating = preferredShares.filter(s => s.hasParticipation);
  
  if (participating.length === 0) {
    // All remaining goes to common on pro-rata basis
    return distributeProRata(commonShares, remainingValue, totalShares);
  }

  // Calculate pro-rata participation
  for (const share of participating) {
    const proRataShare = (share.shares / totalShares) * remainingValue;
    distributions.set(
      share.shareholderId,
      (distributions.get(share.shareholderId) || 0) + proRataShare,
    );
  }

  // Common shareholders also get pro-rata
  const commonDist = distributeProRata(commonShares, remainingValue, totalShares);
  for (const [id, amount] of commonDist) {
    distributions.set(id, (distributions.get(id) || 0) + amount);
  }

  return distributions;
}

/**
 * Distribute remaining value pro-rata to common shareholders
 */
export function distributeProRata(
  shareholders: Array<{ shareholderId: string; shares: number }>,
  value: number,
  totalShares: number,
): Map<string, number> {
  const distributions = new Map<string, number>();

  for (const shareholder of shareholders) {
    const proRataShare = (shareholder.shares / totalShares) * value;
    distributions.set(shareholder.shareholderId, proRataShare);
  }

  return distributions;
}

/**
 * Compare waterfall scenarios at different exit values
 */
export async function compareExitScenarios(
  db: NeonHttpDatabase,
  orgId: string,
  exitValues: number[],
): Promise<Array<{
  exitValue: number;
  waterfall: LiquidationWaterfall;
}>> {
  // TODO: Implement scenario comparison
  // 1. Calculate waterfall for each exit value
  // 2. Compare distributions
  // 3. Return comparison

  throw new Error('Not implemented');
}

/**
 * Calculate breakeven exit value for common shareholders
 */
export async function calculateCommonBreakeven(
  db: NeonHttpDatabase,
  orgId: string,
): Promise<{
  breakevenValue: number;
  totalPreferences: number;
  analysis: string;
}> {
  // TODO: Implement breakeven calculation
  // 1. Sum all liquidation preferences
  // 2. Calculate value needed for common to get $0.01/share
  // 3. Return breakeven analysis

  throw new Error('Not implemented');
}

/**
 * Calculate return multiples for each shareholder
 */
export function calculateReturnMultiples(
  waterfall: LiquidationWaterfall,
): Map<string, number> {
  const multiples = new Map<string, number>();

  for (const dist of waterfall.distributions) {
    const investment = dist.liquidationPreference; // Original investment
    const payout = dist.totalPayout;
    const multiple = investment > 0 ? payout / investment : 0;
    
    multiples.set(dist.shareholderId, multiple);
  }

  return multiples;
}

