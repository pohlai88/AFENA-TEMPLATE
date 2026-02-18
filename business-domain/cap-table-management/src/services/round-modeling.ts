/**
 * Round Modeling Service
 * 
 * Model different fundraising scenarios and term sheet structures
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { DilutionAnalysis, FundingRound } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createRoundSchema = z.object({
  roundName: z.string().min(1),
  roundType: z.enum(['SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'SERIES_D', 'BRIDGE']),
  leadInvestor: z.string().optional(),
  preMoneyValuation: z.number().positive(),
  targetAmount: z.number().positive(),
  minimumAmount: z.number().positive().optional(),
  maximumAmount: z.number().positive().optional(),
  pricePerShare: z.number().positive(),
  liquidationPreferenceMultiple: z.number().min(1).default(1),
  isParticipating: z.boolean().default(false),
  antiDilutionProtection: z.enum(['NONE', 'FULL_RATCHET', 'WEIGHTED_AVERAGE_BROAD', 'WEIGHTED_AVERAGE_NARROW']).default('WEIGHTED_AVERAGE_BROAD'),
  closingDate: z.coerce.date(),
  notes: z.string().optional(),
});

export const termSheetSchema = z.object({
  valuation: z.object({
    preMoneyValuation: z.number().positive(),
    postMoneyValuation: z.number().positive(),
    pricePerShare: z.number().positive(),
  }),
  economics: z.object({
    investmentAmount: z.number().positive(),
    newShares: z.number().int().positive(),
    founderDilution: z.number().min(0).max(100),
    optionPoolSize: z.number().min(0).max(100).optional(),
  }),
  liquidationPreference: z.object({
    multiple: z.number().min(1),
    isParticipating: z.boolean(),
    isCapped: z.boolean().optional(),
    capMultiple: z.number().min(1).optional(),
  }),
  controlRights: z.object({
    boardSeats: z.number().int().min(0),
    protectiveProvisions: z.array(z.string()),
    dragAlongRights: z.boolean(),
    tagAlongRights: z.boolean(),
  }),
  antiDilution: z.enum(['NONE', 'FULL_RATCHET', 'WEIGHTED_AVERAGE_BROAD', 'WEIGHTED_AVERAGE_NARROW']),
});

// ── Types ──────────────────────────────────────────────────────────

export type CreateRoundInput = z.infer<typeof createRoundSchema>;
export type TermSheet = z.infer<typeof termSheetSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create a new funding round
 */
export async function createFundingRound(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateRoundInput,
): Promise<FundingRound> {
  const validated = createRoundSchema.parse(input);

  // TODO: Implement database logic
  // 1. Validate round sequence (can't create Series B without Series A)
  // 2. Create funding round record
  // 3. Create new share class for the round
  // 4. Return funding round

  throw new Error('Not implemented');
}

/**
 * Model term sheet and generate dilution analysis
 */
export async function modelTermSheet(
  db: NeonHttpDatabase,
  orgId: string,
  termSheet: TermSheet,
): Promise<{
  analysis: DilutionAnalysis;
  recommendations: string[];
  warnings: string[];
}> {
  const validated = termSheetSchema.parse(termSheet);

  // TODO: Implement term sheet modeling
  // 1. Calculate dilution impact
  // 2. Model option pool creation if needed
  // 3. Calculate liquidation scenarios
  // 4. Generate recommendations
  // 5. Identify potential issues
  // 6. Return analysis

  throw new Error('Not implemented');
}

/**
 * Compare multiple term sheets
 */
export async function compareTermSheets(
  db: NeonHttpDatabase,
  orgId: string,
  termSheets: TermSheet[],
): Promise<{
  comparisons: Array<{
    termSheet: TermSheet;
    score: number;
    pros: string[];
    cons: string[];
    analysis: DilutionAnalysis;
  }>;
  recommendation: number; // Index of recommended term sheet
}> {
  // TODO: Implement term sheet comparison
  // 1. Model each term sheet
  // 2. Score based on dilution, control, economics
  // 3. Generate pros/cons for each
  // 4. Recommend best option
  // 5. Return comparison

  throw new Error('Not implemented');
}

/**
 * Get all funding rounds
 */
export async function getFundingRounds(
  db: NeonHttpDatabase,
  orgId: string,
): Promise<FundingRound[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get funding round by ID
 */
export async function getFundingRoundById(
  db: NeonHttpDatabase,
  orgId: string,
  roundId: string,
): Promise<FundingRound | null> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Calculate valuation progression over time
 */
export async function getValuationHistory(
  db: NeonHttpDatabase,
  orgId: string,
): Promise<Array<{
  roundName: string;
  closingDate: Date;
  preMoneyValuation: number;
  postMoneyValuation: number;
  pricePerShare: number;
  valuationIncrease: number; // Percentage
}>> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Score a term sheet (0-100)
 */
export function scoreTermSheet(termSheet: TermSheet): {
  totalScore: number;
  categoryScores: {
    economics: number; // Out of 40
    control: number; // Out of 30
    protection: number; // Out of 30
  };
} {
  let economicsScore = 40;
  let controlScore = 30;
  let protectionScore = 30;

  // Economics scoring
  if (termSheet.liquidationPreference.isParticipating) economicsScore -= 15;
  if (termSheet.liquidationPreference.multiple > 1) economicsScore -= 10;
  if (termSheet.economics.founderDilution > 25) economicsScore -= 10;
  if (termSheet.economics.founderDilution > 40) economicsScore -= 5;

  // Control scoring
  if (termSheet.controlRights.boardSeats > 1) controlScore -= 10;
  if (termSheet.controlRights.protectiveProvisions.length > 5) controlScore -= 10;
  if (!termSheet.controlRights.dragAlongRights) controlScore += 5;

  // Protection scoring
  if (termSheet.antiDilution === 'FULL_RATCHET') protectionScore -= 20;
  if (termSheet.antiDilution === 'WEIGHTED_AVERAGE_NARROW') protectionScore -= 10;
  if (termSheet.controlRights.tagAlongRights) protectionScore += 5;

  return {
    totalScore: economicsScore + controlScore + protectionScore,
    categoryScores: {
      economics: economicsScore,
      control: controlScore,
      protection: protectionScore,
    },
  };
}

