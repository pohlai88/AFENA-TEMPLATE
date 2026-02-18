/**
 * Option Pool Service
 * 
 * Manage equity compensation pools (employee stock options, RSUs)
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';

// ── Schemas ────────────────────────────────────────────────────────

export const createOptionPoolSchema = z.object({
  poolName: z.string().min(1),
  totalShares: z.number().int().positive(),
  shareClassId: z.string().uuid(),
  createdDate: z.coerce.date(),
  notes: z.string().optional(),
});

export const grantOptionsSchema = z.object({
  recipientId: z.string().uuid(),
  shares: z.number().int().positive(),
  strikePrice: z.number().positive(),
  grantDate: z.coerce.date(),
  vestingStartDate: z.coerce.date(),
  vestingCliffMonths: z.number().int().min(0).default(12),
  vestingPeriodMonths: z.number().int().min(1).default(48),
  expirationYears: z.number().int().min(1).default(10),
  notes: z.string().optional(),
});

export const exerciseOptionsSchema = z.object({
  grantId: z.string().uuid(),
  shares: z.number().int().positive(),
  exerciseDate: z.coerce.date(),
  paymentMethod: z.enum(['CASH', 'CASHLESS', 'STOCK_SWAP']),
  paymentAmount: z.number().positive().optional(),
});

// ── Types ──────────────────────────────────────────────────────────

export type CreateOptionPoolInput = z.infer<typeof createOptionPoolSchema>;
export type GrantOptionsInput = z.infer<typeof grantOptionsSchema>;
export type ExerciseOptionsInput = z.infer<typeof exerciseOptionsSchema>;

export interface OptionGrant {
  id: string;
  recipientId: string;
  recipientName: string;
  shares: number;
  strikePrice: number;
  grantDate: Date;
  vestingStartDate: Date;
  vestingCliffMonths: number;
  vestingPeriodMonths: number;
  expirationDate: Date;
  vestedShares: number;
  exercisedShares: number;
  availableToExercise: number;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'FULLY_EXERCISED';
}

export interface OptionPool {
  id: string;
  poolName: string;
  totalShares: number;
  grantedShares: number;
  exercisedShares: number;
  availableShares: number;
  shareClassId: string;
  createdDate: Date;
}

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create a new option pool
 */
export async function createOptionPool(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateOptionPoolInput,
): Promise<OptionPool> {
  const validated = createOptionPoolSchema.parse(input);

  // TODO: Implement database logic
  // 1. Validate share class exists
  // 2. Create option pool record
  // 3. Reserve shares from share class
  // 4. Return option pool

  throw new Error('Not implemented');
}

/**
 * Grant options to a recipient
 */
export async function grantOptions(
  db: NeonHttpDatabase,
  orgId: string,
  poolId: string,
  input: GrantOptionsInput,
): Promise<OptionGrant> {
  const validated = grantOptionsSchema.parse(input);

  // TODO: Implement database logic
  // 1. Validate pool has available shares
  // 2. Calculate expiration date
  // 3. Create grant record
  // 4. Update pool granted shares
  // 5. Return grant

  throw new Error('Not implemented');
}

/**
 * Exercise vested options
 */
export async function exerciseOptions(
  db: NeonHttpDatabase,
  orgId: string,
  input: ExerciseOptionsInput,
): Promise<{
  grant: OptionGrant;
  newShareholding: {
    shareholderId: string;
    shares: number;
    shareClassId: string;
  };
}> {
  const validated = exerciseOptionsSchema.parse(input);

  // TODO: Implement database logic
  // 1. Get grant details
  // 2. Validate shares are vested
  // 3. Process payment
  // 4. Convert options to shares
  // 5. Update grant exercised count
  // 6. Create/update shareholding
  // 7. Return results

  throw new Error('Not implemented');
}

/**
 * Calculate vested shares for a grant
 */
export function calculateVestedShares(
  grant: Pick<OptionGrant, 'shares' | 'grantDate' | 'vestingStartDate' | 'vestingCliffMonths' | 'vestingPeriodMonths'>,
  asOfDate: Date = new Date(),
): number {
  const monthsSinceStart = getMonthsDifference(grant.vestingStartDate, asOfDate);

  // Before cliff, nothing vested
  if (monthsSinceStart < grant.vestingCliffMonths) {
    return 0;
  }

  // After full vesting period, all vested
  if (monthsSinceStart >= grant.vestingPeriodMonths) {
    return grant.shares;
  }

  // Linear vesting after cliff
  const vestedPercent = monthsSinceStart / grant.vestingPeriodMonths;
  return Math.floor(grant.shares * vestedPercent);
}

/**
 * Get months between two dates
 */
export function getMonthsDifference(start: Date, end: Date): number {
  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  return yearDiff * 12 + monthDiff;
}

/**
 * Get option pool status
 */
export async function getOptionPoolStatus(
  db: NeonHttpDatabase,
  orgId: string,
  poolId: string,
): Promise<OptionPool> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get all grants for a recipient
 */
export async function getRecipientGrants(
  db: NeonHttpDatabase,
  orgId: string,
  recipientId: string,
): Promise<OptionGrant[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get grant by ID with vesting details
 */
export async function getGrantDetails(
  db: NeonHttpDatabase,
  orgId: string,
  grantId: string,
): Promise<OptionGrant & {
  vestingSchedule: Array<{
    date: Date;
    shares: number;
    cumulativeShares: number;
  }>;
}> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Terminate grant (employee departure)
 */
export async function terminateGrant(
  db: NeonHttpDatabase,
  orgId: string,
  grantId: string,
  terminationDate: Date,
): Promise<{
  grant: OptionGrant;
  vestedShares: number;
  forfeitedShares: number;
  exerciseDeadline: Date; // Usually 90 days post-termination
}> {
  // TODO: Implement database logic
  // 1. Calculate vested shares as of termination
  // 2. Mark unvested shares as forfeited
  // 3. Set exercise deadline
  // 4. Update grant status
  // 5. Return termination details

  throw new Error('Not implemented');
}

/**
 * Calculate option pool dilution (pre-round vs post-round)
 */
export function calculatePoolDilution(
  currentPoolShares: number,
  newPoolShares: number,
  totalSharesPreRound: number,
): {
  preRoundPoolPercent: number;
  postRoundPoolPercent: number;
  dilution: number;
} {
  const preRoundPoolPercent = (currentPoolShares / totalSharesPreRound) * 100;
  const totalSharesPostRound = totalSharesPreRound + newPoolShares;
  const postRoundPoolPercent = ((currentPoolShares + newPoolShares) / totalSharesPostRound) * 100;
  const dilution = preRoundPoolPercent - postRoundPoolPercent;

  return {
    preRoundPoolPercent,
    postRoundPoolPercent,
    dilution,
  };
}
