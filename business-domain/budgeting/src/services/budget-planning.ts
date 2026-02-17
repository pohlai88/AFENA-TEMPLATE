/**
 * Budget Planning Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface BudgetCreation {
  budgetId: string;
  fiscalYear: number;
  totalBudget: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
}

export interface BudgetAllocation {
  budgetId: string;
  allocations: Array<{
    department: string;
    glAccount: string;
    amount: number;
  }>;
}

export async function createBudget(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    fiscalYear: number;
    baselineAmount?: number;
  },
): Promise<BudgetCreation> {
  const budgetId = `BDG-${params.fiscalYear}`;
  
  // TODO: Create budget record
  return {
    budgetId,
    fiscalYear: params.fiscalYear,
    totalBudget: params.baselineAmount || 0,
    status: 'DRAFT',
  };
}

export async function allocateBudget(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    budgetId: string;
    allocations: Array<{
      department: string;
      glAccount: string;
      amount: number;
    }>;
  },
): Promise<BudgetAllocation> {
  // TODO: Insert budget allocations
  return {
    budgetId: params.budgetId,
    allocations: params.allocations,
  };
}
