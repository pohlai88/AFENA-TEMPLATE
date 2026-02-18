/**
 * Cost Allocation Service
 * 
 * Allocate shared service costs to recipient entities
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { AllocationLine, CostAllocation, ServiceCostReport } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createAllocationSchema = z.object({
  serviceId: z.string().uuid(),
  period: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM
  totalCost: z.number().positive(),
});

// ── Types ──────────────────────────────────────────────────────────

export type CreateAllocationInput = z.infer<typeof createAllocationSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create cost allocation
 */
export async function createCostAllocation(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateAllocationInput,
): Promise<{ allocation: CostAllocation; lines: AllocationLine[] }> {
  const validated = createAllocationSchema.parse(input);

  // TODO: Implement database logic
  // 1. Get service and allocation rules
  // 2. Calculate allocation amounts based on method
  // 3. Create allocation header
  // 4. Create allocation lines for each recipient
  // 5. Return allocation and lines

  throw new Error('Not implemented');
}

/**
 * Approve cost allocation
 */
export async function approveCostAllocation(
  db: NeonHttpDatabase,
  orgId: string,
  allocationId: string,
  approvedBy: string,
): Promise<CostAllocation> {
  // TODO: Implement database logic
  // 1. Get allocation
  // 2. Validate can be approved
  // 3. Update status to APPROVED
  // 4. Create intercompany charges
  // 5. Return allocation

  throw new Error('Not implemented');
}

/**
 * Get allocations for period
 */
export async function getAllocationsForPeriod(
  db: NeonHttpDatabase,
  orgId: string,
  period: string,
): Promise<CostAllocation[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get service cost report
 */
export async function getServiceCostReport(
  db: NeonHttpDatabase,
  orgId: string,
  serviceId: string,
  period: string,
): Promise<ServiceCostReport> {
  // TODO: Implement database query
  // 1. Get service
  // 2. Get allocation for period
  // 3. Get allocation lines
  // 4. Format report
  // 5. Return report

  throw new Error('Not implemented');
}

/**
 * Calculate allocation amounts by headcount
 */
export function calculateHeadcountAllocation(
  totalCost: number,
  entitiesHeadcount: Map<string, number>,
): Map<string, number> {
  const totalHeadcount = Array.from(entitiesHeadcount.values()).reduce((sum, hc) => sum + hc, 0);
  const allocations = new Map<string, number>();

  for (const [entityId, headcount] of entitiesHeadcount) {
    const allocation = (headcount / totalHeadcount) * totalCost;
    allocations.set(entityId, allocation);
  }

  return allocations;
}

/**
 * Calculate allocation amounts by revenue
 */
export function calculateRevenueAllocation(
  totalCost: number,
  entitiesRevenue: Map<string, number>,
): Map<string, number> {
  const totalRevenue = Array.from(entitiesRevenue.values()).reduce((sum, rev) => sum + rev, 0);
  const allocations = new Map<string, number>();

  for (const [entityId, revenue] of entitiesRevenue) {
    const allocation = (revenue / totalRevenue) * totalCost;
    allocations.set(entityId, allocation);
  }

  return allocations;
}

/**
 * Calculate equal split allocation
 */
export function calculateEqualSplitAllocation(
  totalCost: number,
  entityCount: number,
): number {
  return totalCost / entityCount;
}

/**
 * Validate allocation percentages sum to 100%
 */
export function validateAllocationPercentages(
  allocations: Map<string, number>, // entityId -> percent
): { isValid: boolean; sum: number } {
  const sum = Array.from(allocations.values()).reduce((total, percent) => total + percent, 0);
  return {
    isValid: Math.abs(sum - 100) < 0.01, // Allow for rounding
    sum,
  };
}

