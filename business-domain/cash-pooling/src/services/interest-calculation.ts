/**
 * Interest Calculation Service
 * 
 * Calculate inter-company interest charges for cash pooling
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { InterestCalculation } from '../types/common.js';

// ── Functions ──────────────────────────────────────────────────────

/**
 * Calculate monthly interest for all participants
 */
export async function calculateMonthlyInterest(
  db: NeonHttpDatabase,
  orgId: string,
  poolId: string,
  calculationDate: Date,
): Promise<InterestCalculation[]> {
  // TODO: Implement interest calculation
  // 1. Get all participants
  // 2. Get daily balances for the month
  // 3. Calculate average daily balance
  // 4. Apply interest rate
  // 5. Create calculation records
  // 6. Return calculations

  throw new Error('Not implemented');
}

/**
 * Calculate interest for single participant
 */
export async function calculateParticipantInterest(
  db: NeonHttpDatabase,
  orgId: string,
  participantId: string,
  startDate: Date,
  endDate: Date,
  interestRate: number,
): Promise<InterestCalculation> {
  // TODO: Implement participant interest
  // 1. Get daily balances for period
  // 2. Calculate average balance
  // 3. Calculate interest amount
  // 4. Create calculation record
  // 5. Return calculation

  throw new Error('Not implemented');
}

/**
 * Calculate average daily balance
 */
export function calculateAverageDailyBalance(
  dailyBalances: Array<{ date: Date; balance: number }>,
): number {
  if (dailyBalances.length === 0) return 0;

  const totalBalance = dailyBalances.reduce((sum, day) => sum + day.balance, 0);
  return totalBalance / dailyBalances.length;
}

/**
 * Calculate simple interest
 */
export function calculateSimpleInterest(
  principal: number,
  annualRate: number,
  days: number,
): number {
  const dailyRate = annualRate / 365;
  return principal * (dailyRate / 100) * days;
}

/**
 * Calculate compound interest (daily compounding)
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  days: number,
): number {
  const dailyRate = annualRate / 365 / 100;
  return principal * (Math.pow(1 + dailyRate, days) - 1);
}

/**
 * Get days in period
 */
export function getDaysInPeriod(
  startDate: Date,
  endDate: Date,
): number {
  const diff = endDate.getTime() - startDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end
}

/**
 * Determine debit/credit position
 */
export function determinePosition(
  averageBalance: number,
): 'DEBIT' | 'CREDIT' | 'NEUTRAL' {
  if (averageBalance > 0) return 'DEBIT'; // Borrowing from pool
  if (averageBalance < 0) return 'CREDIT'; // Lending to pool
  return 'NEUTRAL';
}

/**
 * Apply margin to base rate
 */
export function applyInterestMargin(
  baseRate: number,
  position: 'DEBIT' | 'CREDIT' | 'NEUTRAL',
  margin: number = 0.5,
): number {
  if (position === 'DEBIT') {
    return baseRate + margin; // Pay base + margin on borrowing
  }
  if (position === 'CREDIT') {
    return baseRate - margin; // Earn base - margin on lending
  }
  return baseRate;
}

