import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface CashPosition {
  orgId: string;
  date: Date;
  bankAccounts: Array<{
    accountId: string;
    accountName: string;
    balance: number;
    currency: string;
  }>;
  investments: Array<{
    investmentId: string;
    type: string;
    value: number;
    currency: string;
  }>;
  totalCash: number;
  totalInvestments: number;
  totalLiquidity: number;
}

export interface CashForecast {
  date: Date;
  openingBalance: number;
  receipts: number;
  disbursements: number;
  closingBalance: number;
  cumulativeVariance: number;
}

export async function getCashPosition(
  db: NeonHttpDatabase,
  orgId: string,
  asOfDate: Date,
): Promise<CashPosition> {
  // TODO: Query current cash position across all accounts
  throw new Error('Database integration pending');
}

export async function createCashForecast(
  db: NeonHttpDatabase,
  orgId: string,
  startDate: Date,
  endDate: Date,
): Promise<CashForecast[]> {
  // TODO: Generate cash forecast based on historical patterns
  throw new Error('Database integration pending');
}

export function calculateDailyForecast(
  openingBalance: number,
  historicalReceipts: number[],
  historicalDisbursements: number[],
  days: number,
): CashForecast[] {
  const avgReceipts = historicalReceipts.reduce((a, b) => a + b, 0) / historicalReceipts.length;
  const avgDisbursements = historicalDisbursements.reduce((a, b) => a + b, 0) / historicalDisbursements.length;

  const forecast: CashForecast[] = [];
  let balance = openingBalance;

  for (let i = 0; i < days; i++) {
    const receipts = avgReceipts * (1 + (Math.random() - 0.5) * 0.1); // Add 10% variance
    const disbursements = avgDisbursements * (1 + (Math.random() - 0.5) * 0.1);

    forecast.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      openingBalance: balance,
      receipts,
      disbursements,
      closingBalance: balance + receipts - disbursements,
      cumulativeVariance: 0, // TODO: Calculate vs actual
    });

    balance = balance + receipts - disbursements;
  }

  return forecast;
}

export function optimizeCashSweep(
  accounts: Array<{ accountId: string; balance: number; interestRate: number }>,
  targetBalance: number,
): Array<{ accountId: string; sweepAmount: number }> {
  const sweeps: Array<{ accountId: string; sweepAmount: number }> = [];
  
  // Sort by interest rate (highest first)
  const sorted = [...accounts].sort((a, b) => b.interestRate - a.interestRate);

  let totalExcess = accounts.reduce((sum, acc) => sum + Math.max(0, acc.balance - targetBalance), 0);

  for (const account of sorted) {
    if (totalExcess <= 0) break;

    const excess = Math.max(0, account.balance - targetBalance);
    if (excess > 0) {
      sweeps.push({
        accountId: account.accountId,
        sweepAmount: excess,
      });
      totalExcess -= excess;
    }
  }

  return sweeps;
}
