import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface TrialBalance {
  accountId: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface FinancialStatement {
  period: { start: Date; end: Date };
  currency: string;
  lineItems: Array<{
    accountNumber: string;
    accountName: string;
    amount: number;
    level: number;
    isTotal: boolean;
  }>;
  totals: {
    assets?: number;
    liabilities?: number;
    equity?: number;
    revenue?: number;
    expenses?: number;
    netIncome?: number;
  };
}

export function generateTrialBalance(
  _db: NeonHttpDatabase,
  _orgId: string,
  _asOfDate: Date,
): TrialBalance[] {
  // TODO: Query GL balances and generate trial balance
  throw new Error('Database integration pending');
}

export function generateBalanceSheet(
  _db: NeonHttpDatabase,
  _orgId: string,
  _asOfDate: Date,
): FinancialStatement {
  // TODO: Query and format balance sheet
  throw new Error('Database integration pending');
}

export function generateIncomeStatement(
  _db: NeonHttpDatabase,
  _orgId: string,
  _periodStart: Date,
  _periodEnd: Date,
): FinancialStatement {
  // TODO: Query and format P&L statement
  throw new Error('Database integration pending');
}

export function validateTrialBalance(tb: TrialBalance[]): {
  balanced: boolean;
  totalDebits: number;
  totalCredits: number;
  variance: number;
} {
  const totalDebits = tb.reduce((sum, row) => sum + row.debit, 0);
  const totalCredits = tb.reduce((sum, row) => sum + row.credit, 0);
  const variance = Math.abs(totalDebits - totalCredits);

  return {
    balanced: variance < 0.01,
    totalDebits,
    totalCredits,
    variance,
  };
}

export function calculateFinancialRatios(
  balanceSheet: FinancialStatement,
  incomeStatement: FinancialStatement,
): {
  currentRatio?: number;
  quickRatio?: number;
  debtToEquity?: number;
  grossMargin?: number;
  netMargin?: number;
  roa?: number;
  roe?: number;
} {
  const ratios: ReturnType<typeof calculateFinancialRatios> = {};

  if (balanceSheet.totals.assets && balanceSheet.totals.liabilities) {
    ratios.currentRatio = balanceSheet.totals.assets / balanceSheet.totals.liabilities;
  }

  if (balanceSheet.totals.liabilities && balanceSheet.totals.equity) {
    ratios.debtToEquity = balanceSheet.totals.liabilities / balanceSheet.totals.equity;
  }

  if (incomeStatement.totals.revenue && incomeStatement.totals.netIncome) {
    ratios.netMargin = (incomeStatement.totals.netIncome / incomeStatement.totals.revenue) * 100;
  }

  if (incomeStatement.totals.netIncome && balanceSheet.totals.assets) {
    ratios.roa = (incomeStatement.totals.netIncome / balanceSheet.totals.assets) * 100;
  }

  if (incomeStatement.totals.netIncome && balanceSheet.totals.equity) {
    ratios.roe = (incomeStatement.totals.netIncome / balanceSheet.totals.equity) * 100;
  }

  return ratios;
}
