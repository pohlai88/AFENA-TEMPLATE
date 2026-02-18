import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Plan {
  id: string;
  orgId: string;
  planName: string;
  planType: 'STRATEGIC' | 'OPERATIONAL' | 'FINANCIAL' | 'CAPACITY';
  planningHorizon: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM'; // 1yr, 3yr, 5yr+
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  scenarios: Array<{
    scenarioId: string;
    scenarioName: string;
    probability: number;
  }>;
}

export interface PlanningMetric {
  id: string;
  planId: string;
  scenarioId?: string;
  metricName: string;
  period: string; // YYYY-MM or YYYY-Q1
  plannedValue: number;
  actualValue?: number;
  variance?: number;
  unit: string;
}

export async function createPlan(
  db: NeonHttpDatabase,
  data: Omit<Plan, 'id' | 'status'>,
): Promise<Plan> {
  // TODO: Insert plan with DRAFT status
  throw new Error('Database integration pending');
}

export async function addPlanningMetric(
  db: NeonHttpDatabase,
  data: Omit<PlanningMetric, 'id' | 'actualValue' | 'variance'>,
): Promise<PlanningMetric> {
  // TODO: Insert planning metric
  throw new Error('Database integration pending');
}

export async function updateActuals(
  db: NeonHttpDatabase,
  metricId: string,
  actualValue: number,
): Promise<PlanningMetric> {
  // TODO: Update actual value and calculate variance
  throw new Error('Database integration pending');
}

export function createScenario(
  baseMetrics: PlanningMetric[],
  adjustments: Map<string, number>, // metricName -> adjustment percentage
  scenarioName: string,
): PlanningMetric[] {
  return baseMetrics.map((metric) => {
    const adjustment = adjustments.get(metric.metricName) || 0;
    return {
      ...metric,
      plannedValue: metric.plannedValue * (1 + adjustment / 100),
      scenarioId: scenarioName,
    };
  });
}

export function comparescenarios(
  scenarios: Map<string, PlanningMetric[]>,
): Array<{
    metricName: string;
    period: string;
    values: Map<string, number>;
    range: { min: number; max: number };
  }> {
  const comparison = new Map<string, Map<string, Map<string, number>>>();

  // Group by metric and period
  for (const [scenarioName, metrics] of scenarios.entries()) {
    for (const metric of metrics) {
      const key = `${metric.metricName}|${metric.period}`;
      
      if (!comparison.has(key)) {
        comparison.set(key, new Map());
      }

      comparison.get(key)!.set(scenarioName, metric.plannedValue);
    }
  }

  // Build comparison output
  return Array.from(comparison.entries()).map(([key, scenarioValues]) => {
    const [metricName, period] = key.split('|');
    const values = Array.from(scenarioValues.values());
    
    return {
      metricName,
      period,
      values: scenarioValues,
      range: {
        min: Math.min(...values),
        max: Math.max(...values),
      },
    };
  });
}

export function calculatePlanAccuracy(
  metrics: PlanningMetric[],
): { avgVariancePercent: number; accuracy: number } {
  const withActuals = metrics.filter((m) => m.actualValue !== undefined && m.actualValue !== null);

  if (withActuals.length === 0) {
    return { avgVariancePercent: 0, accuracy: 100 };
  }

  let totalVariancePercent = 0;

  for (const metric of withActuals) {
    if (metric.plannedValue !== 0) {
      const variancePercent = ((metric.actualValue! - metric.plannedValue) / metric.plannedValue) * 100;
      totalVariancePercent += Math.abs(variancePercent);
    }
  }

  const avgVariancePercent = totalVariancePercent / withActuals.length;
  const accuracy = Math.max(0, 100 - avgVariancePercent);

  return { avgVariancePercent, accuracy };
}
