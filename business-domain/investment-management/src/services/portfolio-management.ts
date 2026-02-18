/**
 * Portfolio Management Service
 * 
 * Manage corporate investment portfolio
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { Investment, PortfolioSummary } from '../types/common.js';
import { investmentSchema, InvestmentStatus, InvestmentType } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createInvestmentSchema = investmentSchema.omit({ id: true, createdAt: true, updatedAt: true });

// ── Types ──────────────────────────────────────────────────────────

export type CreateInvestmentInput = z.infer<typeof createInvestmentSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create new investment
 */
export async function createInvestment(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateInvestmentInput,
): Promise<Investment> {
  const validated = createInvestmentSchema.parse(input);

  // TODO: Implement database logic
  // 1. Create investment record
  // 2. Create initial transaction
  // 3. Return investment

  throw new Error('Not implemented');
}

/**
 * Get portfolio summary
 */
export async function getPortfolioSummary(
  db: NeonHttpDatabase,
  orgId: string,
  asOfDate: Date = new Date(),
): Promise<PortfolioSummary> {
  // TODO: Implement database query
  // 1. Get all active investments
  // 2. Calculate total value and cost basis
  // 3. Calculate unrealized gains/losses
  // 4. Get realized gains/losses from transactions
  // 5. Calculate allocation by type
  // 6. Calculate ROI
  // 7. Return summary

  throw new Error('Not implemented');
}

/**
 * Get all investments
 */
export async function getInvestments(
  db: NeonHttpDatabase,
  orgId: string,
  filters?: {
    investmentType?: InvestmentType;
    status?: InvestmentStatus;
  },
): Promise<Investment[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Update investment valuation
 */
export async function updateInvestmentValuation(
  db: NeonHttpDatabase,
  orgId: string,
  investmentId: string,
  newValue: number,
  valuationDate: Date = new Date(),
): Promise<Investment> {
  // TODO: Implement database logic
  // 1. Get investment
  // 2. Calculate unrealized gain/loss
  // 3. Create valuation record
  // 4. Update investment current value
  // 5. Return updated investment

  throw new Error('Not implemented');
}

/**
 * Sell investment
 */
export async function sellInvestment(
  db: NeonHttpDatabase,
  orgId: string,
  investmentId: string,
  quantity: number,
  salePrice: number,
  saleDate: Date = new Date(),
): Promise<{
  investment: Investment;
  realizedGainLoss: number;
}> {
  // TODO: Implement database logic
  // 1. Get investment
  // 2. Calculate realized gain/loss
  // 3. Create sell transaction
  // 4. Update investment quantity/status
  // 5. Return results

  throw new Error('Not implemented');
}

/**
 * Calculate unrealized gain/loss
 */
export function calculateUnrealizedGainLoss(
  costBasis: number,
  currentValue: number,
): number {
  return currentValue - costBasis;
}

/**
 * Calculate return on investment (%)
 */
export function calculateROI(
  costBasis: number,
  currentValue: number,
  dividendsReceived: number = 0,
): number {
  const totalReturn = (currentValue - costBasis + dividendsReceived);
  return (totalReturn / costBasis) * 100;
}

/**
 * Calculate portfolio allocation percentages
 */
export function calculateAllocation(
  investments: Investment[],
): Map<InvestmentType, { count: number; value: number; percent: number }> {
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const allocation = new Map<InvestmentType, { count: number; value: number; percent: number }>();

  for (const inv of investments) {
    const existing = allocation.get(inv.investmentType) || { count: 0, value: 0, percent: 0 };
    allocation.set(inv.investmentType, {
      count: existing.count + 1,
      value: existing.value + inv.currentValue,
      percent: 0, // Will calculate after
    });
  }

  // Calculate percentages
  for (const [type, data] of allocation) {
    data.percent = totalValue > 0 ? (data.value / totalValue) * 100 : 0;
  }

  return allocation;
}

