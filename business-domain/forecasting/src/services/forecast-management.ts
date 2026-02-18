import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Forecast {
  id: string;
  orgId: string;
  name: string;
  forecastType: 'REVENUE' | 'EXPENSE' | 'CASH' | 'HEADCOUNT';
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  version: number;
}

export interface ForecastLine {
  id: string;
  forecastId: string;
  accountId?: string;
  period: string; // YYYY-MM
  forecastedAmount: number;
  confidenceLevel: number; // 0-100
  assumptions?: string;
}

export async function createForecast(
  db: NeonHttpDatabase,
  data: Omit<Forecast, 'id' | 'status' | 'version'>,
): Promise<Forecast> {
  // TODO: Insert forecast with DRAFT status
  throw new Error('Database integration pending');
}

export async function addForecastLine(
  db: NeonHttpDatabase,
  data: Omit<ForecastLine, 'id'>,
): Promise<ForecastLine> {
  // TODO: Insert forecast line
  throw new Error('Database integration pending');
}

export async function generateRollingForecast(
  db: NeonHttpDatabase,
  forecastId: string,
  asOfDate: Date,
): Promise<ForecastLine[]> {
  // TODO: Generate rolling forecast based on actuals
  throw new Error('Database integration pending');
}

export function calculateMovingAverage(
  historicalData: Array<{ period: string; amount: number }>,
  periods: number = 3,
): number {
  if (historicalData.length < periods) return 0;

  const recent = historicalData.slice(-periods);
  const sum = recent.reduce((acc, item) => acc + item.amount, 0);
  return sum / periods;
}

export function calculateLinearRegression(
  data: Array<{ period: number; amount: number }>,
): { slope: number; intercept: number; rSquared: number } {
  const n = data.length;
  const sumX = data.reduce((sum, point) => sum + point.period, 0);
  const sumY = data.reduce((sum, point) => sum + point.amount, 0);
  const sumXY = data.reduce((sum, point) => sum + point.period * point.amount, 0);
  const sumXX = data.reduce((sum, point) => sum + point.period * point.period, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  const yMean = sumY / n;
  const ssTotal = data.reduce((sum, point) => sum + Math.pow(point.amount - yMean, 2), 0);
  const ssResidual = data.reduce((sum, point) => {
    const predicted = slope * point.period + intercept;
    return sum + Math.pow(point.amount - predicted, 2);
  }, 0);
  const rSquared = 1 - ssResidual / ssTotal;

  return { slope, intercept, rSquared };
}

export function forecastWithGrowthRate(
  baseAmount: number,
  growthRate: number, // percentage
  periods: number,
): Array<{ period: number; amount: number }> {
  const forecast: Array<{ period: number; amount: number }> = [];
  
  for (let i = 0; i < periods; i++) {
    forecast.push({
      period: i + 1,
      amount: baseAmount * Math.pow(1 + growthRate / 100, i),
    });
  }

  return forecast;
}

export function calculateSeasonality(
  data: Array<{ month: number; amount: number }>,
): number[] {
  // Calculate average for each month across years
  const monthlyTotals = new Array(12).fill(0);
  const monthlyCounts = new Array(12).fill(0);

  for (const item of data) {
    monthlyTotals[item.month - 1] += item.amount;
    monthlyCounts[item.month - 1]++;
  }

  const monthlyAverages = monthlyTotals.map((total, i) => 
    monthlyCounts[i] > 0 ? total / monthlyCounts[i] : 0
  );

  const overallAverage = monthlyAverages.reduce((a, b) => a + b, 0) / 12;

  // Return seasonal indices
  return monthlyAverages.map((avg) => overallAverage > 0 ? avg / overallAverage : 1);
}
