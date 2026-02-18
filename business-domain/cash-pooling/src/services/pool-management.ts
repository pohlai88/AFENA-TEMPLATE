/**
 * Pool Management Service
 * 
 * Manage cash pools and participant configuration
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { CashPool, PoolBalance, PoolParticipant } from '../types/common.js';
import { cashPoolSchema, poolParticipantSchema } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createPoolSchema = cashPoolSchema.omit({ id: true, createdAt: true, updatedAt: true });

export const addParticipantSchema = poolParticipantSchema.omit({ id: true });

// ── Types ──────────────────────────────────────────────────────────

export type CreatePoolInput = z.infer<typeof createPoolSchema>;
export type AddParticipantInput = z.infer<typeof addParticipantSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create cash pool
 */
export async function createCashPool(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreatePoolInput,
): Promise<CashPool> {
  const validated = createPoolSchema.parse(input);

  // TODO: Implement database logic
  // 1. Validate header account exists
  // 2. Create pool record
  // 3. Add header account as participant
  // 4. Return pool

  throw new Error('Not implemented');
}

/**
 * Add participant to pool
 */
export async function addParticipantToPool(
  db: NeonHttpDatabase,
  orgId: string,
  input: AddParticipantInput,
): Promise<PoolParticipant> {
  const validated = addParticipantSchema.parse(input);

  // Validate balance constraints
  if (validated.minimumBalance && validated.maximumBalance) {
    if (validated.minimumBalance >= validated.maximumBalance) {
      throw new Error('Minimum balance must be less than maximum balance');
    }
  }

  // TODO: Implement database logic
  // 1. Validate pool exists and is active
  // 2. Validate entity not already in pool
  // 3. Add participant
  // 4. Return participant

  throw new Error('Not implemented');
}

/**
 * Get pool balance summary
 */
export async function getPoolBalance(
  db: NeonHttpDatabase,
  orgId: string,
  poolId: string,
  asOfDate: Date = new Date(),
): Promise<PoolBalance> {
  // TODO: Implement database query
  // 1. Get pool info
  // 2. Get all active participants
  // 3. Get current balance for each account
  // 4. Calculate variances from targets
  // 5. Return balance summary

  throw new Error('Not implemented');
}

/**
 * Remove participant from pool
 */
export async function removeParticipantFromPool(
  db: NeonHttpDatabase,
  orgId: string,
  participantId: string,
  effectiveDate: Date = new Date(),
): Promise<PoolParticipant> {
  // TODO: Implement database logic
  // 1. Get participant
  // 2. Validate can be removed (sweep to zero first)
  // 3. Mark as inactive
  // 4. Return participant

  throw new Error('Not implemented');
}

/**
 * Get all pools
 */
export async function getCashPools(
  db: NeonHttpDatabase,
  orgId: string,
  activeOnly: boolean = true,
): Promise<CashPool[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Calculate optimal sweep amounts
 */
export function calculateSweepAmounts(
  poolBalance: PoolBalance,
): Map<string, number> {
  const sweepAmounts = new Map<string, number>();

  for (const participant of poolBalance.participants) {
    // Calculate how much to sweep to reach target
    const sweepAmount = participant.currentBalance - participant.targetBalance;
    
    if (Math.abs(sweepAmount) > 0.01) { // Only sweep if material
      sweepAmounts.set(participant.participantId, sweepAmount);
    }
  }

  return sweepAmounts;
}

/**
 * Validate pool configuration
 */
export function validatePoolConfiguration(
  participants: PoolParticipant[],
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  const headerAccounts = participants.filter(p => p.role === 'HEADER_ACCOUNT');
  if (headerAccounts.length === 0) {
    errors.push('Pool must have at least one header account');
  }
  if (headerAccounts.length > 1) {
    errors.push('Pool can only have one header account');
  }

  if (participants.filter(p => p.isActive).length < 2) {
    errors.push('Pool must have at least one participant in addition to header account');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

