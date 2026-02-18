import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { Remodeling } from '../types/common.js';

export async function scheduleRemodel(
  db: NeonHttpDatabase,
  orgId: string,
  data: Omit<Remodeling, 'id' | 'completed'>,
): Promise<Remodeling> {
  throw new Error('Database integration pending');
}

export function trackBudgetVariance(remodel: Remodeling): {
  variance: number;
  percentOver: number;
  status: 'ON_BUDGET' | 'OVER_BUDGET' | 'UNDER_BUDGET';
} {
  if (!remodel.actualCost) return { variance: 0, percentOver: 0, status: 'ON_BUDGET' };
  const variance = remodel.actualCost - remodel.budget;
  const percentOver = (variance / remodel.budget) * 100;
  let status: 'ON_BUDGET' | 'OVER_BUDGET' | 'UNDER_BUDGET' = 'ON_BUDGET';
  if (percentOver > 5) status = 'OVER_BUDGET';
  else if (percentOver < -5) status = 'UNDER_BUDGET';
  return { variance, percentOver, status };
}

