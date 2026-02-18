/**
 * Share Classes Service
 * 
 * Manage different classes of equity (common, preferred, etc.)
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { ShareClassInfo } from '../types/common.js';
import { ShareClass as ShareClassEnum, shareClassSchema } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createShareClassSchema = shareClassSchema.omit({ id: true, createdAt: true, updatedAt: true });

export const updateShareClassSchema = shareClassSchema.partial().omit({ id: true, orgId: true, createdAt: true, updatedAt: true });

// ── Types ──────────────────────────────────────────────────────────

export type CreateShareClassInput = z.infer<typeof createShareClassSchema>;
export type UpdateShareClassInput = z.infer<typeof updateShareClassSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create a new share class
 */
export async function createShareClass(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateShareClassInput,
): Promise<ShareClassInfo> {
  const validated = createShareClassSchema.parse(input);

  // TODO: Implement database logic
  // 1. Validate class name is unique
  // 2. Validate share authorization
  // 3. Create share class record
  // 4. Return created share class

  throw new Error('Not implemented');
}

/**
 * Get share class by ID
 */
export async function getShareClassById(
  db: NeonHttpDatabase,
  orgId: string,
  classId: string,
): Promise<ShareClassInfo | null> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get all share classes
 */
export async function getAllShareClasses(
  db: NeonHttpDatabase,
  orgId: string,
): Promise<ShareClassInfo[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Update share class
 */
export async function updateShareClass(
  db: NeonHttpDatabase,
  orgId: string,
  classId: string,
  input: UpdateShareClassInput,
): Promise<ShareClassInfo> {
  const validated = updateShareClassSchema.parse(input);

  // TODO: Implement database logic
  // 1. Validate class exists
  // 2. Validate can't reduce authorized below outstanding
  // 3. Update share class
  // 4. Return updated share class

  throw new Error('Not implemented');
}

/**
 * Get share class ownership summary
 */
export async function getShareClassOwnership(
  db: NeonHttpDatabase,
  orgId: string,
  classId: string,
): Promise<{
  shareClass: ShareClassInfo;
  holders: Array<{
    shareholderId: string;
    shareholderName: string;
    shares: number;
    ownershipPercent: number;
  }>;
  totalHolders: number;
  concentrationMetrics: {
    top1Percent: number;
    top5Percent: number;
    top10Percent: number;
  };
}> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Calculate available shares for issuance
 */
export async function getAvailableShares(
  db: NeonHttpDatabase,
  orgId: string,
  classId: string,
): Promise<{
  authorized: number;
  outstanding: number;
  reserved: number; // For option pools
  available: number;
  utilizationPercent: number;
}> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Validate if shares can be issued
 */
export async function validateShareIssuance(
  db: NeonHttpDatabase,
  orgId: string,
  classId: string,
  sharesToIssue: number,
): Promise<{
  canIssue: boolean;
  reason?: string;
  available: number;
}> {
  const availability = await getAvailableShares(db, orgId, classId);

  if (sharesToIssue > availability.available) {
    return {
      canIssue: false,
      reason: `Insufficient shares available. Requested: ${sharesToIssue}, Available: ${availability.available}`,
      available: availability.available,
    };
  }

  return {
    canIssue: true,
    available: availability.available,
  };
}

/**
 * Compare rights across share classes
 */
export async function compareShareClasses(
  db: NeonHttpDatabase,
  orgId: string,
): Promise<{
  classes: ShareClassInfo[];
  comparison: {
    voting: Map<string, number>; // classId -> votes per share
    liquidation: Map<string, number>; // classId -> preference multiple
    dividends: Map<string, boolean>; // classId -> has dividend preference
    conversion: Map<string, boolean>; // classId -> is convertible
    participation: Map<string, boolean>; // classId -> has participation rights
  };
}> {
  // TODO: Implement comparison logic

  throw new Error('Not implemented');
}

/**
 * Calculate voting power distribution
 */
export async function getVotingPowerDistribution(
  db: NeonHttpDatabase,
  orgId: string,
): Promise<Array<{
  shareholderId: string;
  shareholderName: string;
  totalVotes: number;
  votingPercent: number;
  breakdown: Array<{
    shareClassName: string;
    shares: number;
    votesPerShare: number;
    totalVotes: number;
  }>;
}>> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get default share class configuration for round type
 */
export function getDefaultClassConfig(
  roundType: 'COMMON' | 'SEED' | 'SERIES_A' | 'SERIES_B' | 'SERIES_C',
): Partial<CreateShareClassInput> {
  const baseConfig: Record<string, Partial<CreateShareClassInput>> = {
    COMMON: {
      classType: ShareClassEnum.COMMON_CLASS_A,
      votesPerShare: 1,
      liquidationPreferenceMultiple: 0,
      isParticipating: false,
      isConvertible: false,
      dividendRate: 0,
      hasDividendPreference: false,
      seniorityRank: 999, // Least senior
    },
    SEED: {
      classType: ShareClassEnum.PREFERRED_SEED,
      votesPerShare: 1,
      liquidationPreferenceMultiple: 1,
      isParticipating: false,
      isConvertible: true,
      dividendRate: 0,
      hasDividendPreference: false,
      seniorityRank: 3,
    },
    SERIES_A: {
      classType: ShareClassEnum.PREFERRED_SERIES_A,
      votesPerShare: 1,
      liquidationPreferenceMultiple: 1,
      isParticipating: false,
      isConvertible: true,
      dividendRate: 0,
      hasDividendPreference: false,
      seniorityRank: 2,
    },
    SERIES_B: {
      classType: ShareClassEnum.PREFERRED_SERIES_B,
      votesPerShare: 1,
      liquidationPreferenceMultiple: 1,
      isParticipating: false,
      isConvertible: true,
      dividendRate: 0,
      hasDividendPreference: false,
      seniorityRank: 1,
    },
    SERIES_C: {
      classType: ShareClassEnum.PREFERRED_SERIES_C,
      votesPerShare: 1,
      liquidationPreferenceMultiple: 1,
      isParticipating: false,
      isConvertible: true,
      dividendRate: 0,
      hasDividendPreference: false,
      seniorityRank: 0, // Most senior
    },
  };

  return baseConfig[roundType] || baseConfig.COMMON;
}

