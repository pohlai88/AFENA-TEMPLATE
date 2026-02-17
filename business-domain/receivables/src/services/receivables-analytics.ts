/**
 * Receivables Analytics Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface DSOMetrics {
  period: string;
  daysalesOutstanding: number;
  avgCollectionDays: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface ARAgingReport {
  customerId?: string;
  asOfDate: string;
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  over90: number;
  totalOutstanding: number;
}

export async function calculateDSO(
  db: NeonHttpDatabase,
  orgId: string,
  period: string,
): Promise<DSOMetrics> {
  // TODO: Calculate DSO = (Accounts Receivable / Total Credit Sales) * Number of Days
  return {
    period,
    daysalesOutstanding: 35.2,
    avgCollectionDays: 32.5,
    trend: 'stable',
  };
}

export async function generateAgingReport(
  db: NeonHttpDatabase,
  orgId: string,
  params: { customerId?: string; asOfDate: string },
): Promise<ARAgingReport> {
  // TODO: Generate aging buckets
  return {
    customerId: params.customerId,
    asOfDate: params.asOfDate,
    current: 50000.00,
    days1to30: 25000.00,
    days31to60: 10000.00,
    days61to90: 5000.00,
    over90: 2500.00,
    totalOutstanding: 92500.00,
  };
}
