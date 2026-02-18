import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Budget {
  id: string;
  orgId: string;
  fiscalYear: number;
  name: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'ACTIVE' | 'CLOSED';
  version: number;
  departmentId?: string;
  totalAmount: number;
}

export interface BudgetLine {
  id: string;
  budgetId: string;
  accountId: string;
  departmentId?: string;
  period: string; // YYYY-MM
  budgetedAmount: number;
  actualAmount?: number;
  variance?: number;
  comments?: string;
}

export async function createBudget(
  db: NeonHttpDatabase,
  data: Omit<Budget, 'id' | 'status' | 'version'>,
): Promise<Budget> {
  // TODO: Insert budget with DRAFT status and version 1
  throw new Error('Database integration pending');
}

export async function addBudgetLine(
  db: NeonHttpDatabase,
  data: Omit<BudgetLine, 'id' | 'actualAmount' | 'variance'>,
): Promise<BudgetLine> {
  // TODO: Insert budget line
  throw new Error('Database integration pending');
}

export async function approveBudget(
  db: NeonHttpDatabase,
  budgetId: string,
  approvedBy: string,
): Promise<Budget> {
  // TODO: Update status to APPROVED
  throw new Error('Database integration pending');
}

export async function getBudgetVsActuals(
  db: NeonHttpDatabase,
  budgetId: string,
  startPeriod: string,
  endPeriod: string,
): Promise<BudgetLine[]> {
  // TODO: Query budget lines with actuals
  throw new Error('Database integration pending');
}

export function calculateVariance(
  budgetedAmount: number,
  actualAmount: number,
): { variance: number; percentVariance: number; favorability: 'FAVORABLE' | 'UNFAVORABLE' | 'ON_TARGET' } {
  const variance = actualAmount - budgetedAmount;
  const percentVariance = budgetedAmount !== 0 ? (variance / budgetedAmount) * 100 : 0;

  let favorability: 'FAVORABLE' | 'UNFAVORABLE' | 'ON_TARGET' = 'ON_TARGET';
  
  if (Math.abs(variance) > budgetedAmount * 0.05) {
    // More than 5% variance
    favorability = variance < 0 ? 'FAVORABLE' : 'UNFAVORABLE';
  }

  return { variance, percentVariance, favorability };
}

export function spreadBudget(
  annualAmount: number,
  method: 'EQUAL' | 'SEASONAL' | 'HISTORICAL',
  seasonalFactors?: number[], // 12 months
): Array<{ period: string; amount: number }> {
  const periods: Array<{ period: string; amount: number }> = [];
  const year = new Date().getFullYear();

  if (method === 'EQUAL') {
    const monthlyAmount = annualAmount / 12;
    for (let i = 1; i <= 12; i++) {
      periods.push({
        period: `${year}-${String(i).padStart(2, '0')}`,
        amount: monthlyAmount,
      });
    }
  } else if (method === 'SEASONAL' && seasonalFactors && seasonalFactors.length === 12) {
    const totalFactors = seasonalFactors.reduce((a, b) => a + b, 0);
    for (let i = 0; i < 12; i++) {
      periods.push({
        period: `${year}-${String(i + 1).padStart(2, '0')}`,
        amount: (annualAmount * seasonalFactors[i]) / totalFactors,
      });
    }
  }

  return periods;
}

export function consolidateDepartmentBudgets(
  departmentBudgets: Array<{ departmentId: string; budgetLines: BudgetLine[] }>,
): Array<{ accountId: string; period: string; totalBudget: number }> {
  const consolidated = new Map<string, number>();

  for (const dept of departmentBudgets) {
    for (const line of dept.budgetLines) {
      const key = `${line.accountId}|${line.period}`;
      consolidated.set(key, (consolidated.get(key) || 0) + line.budgetedAmount);
    }
  }

  return Array.from(consolidated.entries()).map(([key, totalBudget]) => {
    const [accountId, period] = key.split('|');
    return { accountId, period, totalBudget };
  });
}
