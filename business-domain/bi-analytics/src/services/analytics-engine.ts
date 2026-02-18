import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface DataSource {
  id: string;
  orgId: string;
  name: string;
  sourceType: 'DATABASE' | 'API' | 'FILE' | 'WAREHOUSE';
  connectionConfig: Record<string, unknown>;
  refreshFrequency: 'REALTIME' | 'HOURLY' | 'DAILY' | 'WEEKLY';
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  lastRefreshDate?: Date;
}

export interface AnalyticsReport {
  id: string;
  orgId: string;
  reportName: string;
  reportType: 'KPI' | 'TREND' | 'COMPARISON' | 'FORECAST';
  dataSourceIds: string[];
  filters: Record<string, unknown>;
  visualizations: Array<{
    type: 'LINE' | 'BAR' | 'PIE' | 'TABLE' | 'GAUGE';
    config: Record<string, unknown>;
  }>;
  createdBy: string;
  isPublic: boolean;
}

export async function createDataSource(
  db: NeonHttpDatabase,
  data: Omit<DataSource, 'id' | 'status'>,
): Promise<DataSource> {
  // TODO: Insert data source with ACTIVE status
  throw new Error('Database integration pending');
}

export async function refreshDataSource(
  db: NeonHttpDatabase,
  sourceId: string,
): Promise<DataSource> {
  // TODO: Trigger data refresh and update lastRefreshDate
  throw new Error('Database integration pending');
}

export async function createReport(
  db: NeonHttpDatabase,
  data: Omit<AnalyticsReport, 'id'>,
): Promise<AnalyticsReport> {
  // TODO: Insert analytics report
  throw new Error('Database integration pending');
}

export function calculateKPI(
  actual: number,
  target: number,
  goodDirection: 'HIGHER' | 'LOWER' = 'HIGHER',
): { value: number; percentOfTarget: number; status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL' } {
  const percentOfTarget = target !== 0 ? (actual / target) * 100 : 0;
  
  let status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL' = 'GOOD';
  
  if (goodDirection === 'HIGHER') {
    if (percentOfTarget >= 100) status = 'EXCELLENT';
    else if (percentOfTarget >= 85) status = 'GOOD';
    else if (percentOfTarget >= 70) status = 'WARNING';
    else status = 'CRITICAL';
  } else {
    if (percentOfTarget <= 100) status = 'EXCELLENT';
    else if (percentOfTarget <= 115) status = 'GOOD';
    else if (percentOfTarget <= 130) status = 'WARNING';
    else status = 'CRITICAL';
  }

  return { value: actual, percentOfTarget, status };
}

export function calculateTrend(
  dataPoints: Array<{ period: string; value: number }>,
): { trend: 'INCREASING' | 'DECREASING' | 'STABLE'; changeRate: number } {
  if (dataPoints.length < 2) {
    return { trend: 'STABLE', changeRate: 0 };
  }

  const first = dataPoints[0].value;
  const last = dataPoints[dataPoints.length - 1].value;
  const changeRate = first !== 0 ? ((last - first) / first) * 100 : 0;

  let trend: 'INCREASING' | 'DECREASING' | 'STABLE' = 'STABLE';
  if (Math.abs(changeRate) > 5) {
    trend = changeRate > 0 ? 'INCREASING' : 'DECREASING';
  }

  return { trend, changeRate };
}

export function generateDashboard(
  metrics: Map<string, { actual: number; target: number }>,
): Array<{ metric: string; actual: number; target: number; variance: number; status: string }> {
  return Array.from(metrics.entries()).map(([metric, data]) => {
    const variance = data.actual - data.target;
    const kpi = calculateKPI(data.actual, data.target);

    return {
      metric,
      actual: data.actual,
      target: data.target,
      variance,
      status: kpi.status,
    };
  });
}
