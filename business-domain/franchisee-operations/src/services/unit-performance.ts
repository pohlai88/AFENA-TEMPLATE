import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { UnitPerformance } from '../types/common.js';

export async function recordPerformance(
  db: NeonHttpDatabase,
  orgId: string,
  data: Omit<UnitPerformance, 'id' | 'createdAt'>,
): Promise<UnitPerformance> {
  throw new Error('Database integration pending');
}

export async function getUnitPerformance(
  db: NeonHttpDatabase,
  unitId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<UnitPerformance[]> {
  throw new Error('Database integration pending');
}

export function calculateSameStoreSales(
  currentPeriod: UnitPerformance[],
  priorPeriod: UnitPerformance[],
): { growth: number; variance: number } {
  const current = currentPeriod.reduce((sum, p) => sum + p.sales, 0);
  const prior = priorPeriod.reduce((sum, p) => sum + p.sales, 0);
  const growth = prior > 0 ? ((current - prior) / prior) * 100 : 0;
  return { growth, variance: current - prior };
}

export function analyzeConversion(performance: UnitPerformance): {
  conversionRate: number;
  averageTicket: number;
  trafficEfficiency: number;
} {
  const conversionRate = performance.traffic && performance.traffic > 0
    ? (performance.transactions / performance.traffic) * 100
    : 0;
  const averageTicket = performance.transactions > 0
    ? performance.sales / performance.transactions
    : 0;
  const trafficEfficiency = performance.traffic && performance.traffic > 0
    ? performance.sales / performance.traffic
    : 0;
  return { conversionRate, averageTicket, trafficEfficiency };
}

