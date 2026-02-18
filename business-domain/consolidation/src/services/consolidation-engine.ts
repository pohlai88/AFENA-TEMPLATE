import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface ConsolidationRun {
  id: string;
  orgId: string;
  fiscalYear: number;
  period: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED' | 'FINALIZED';
  parentEntityId: string;
  subsidiaries: string[];
  consolidationMethod: 'FULL' | 'PROPORTIONAL' | 'EQUITY';
}

export interface EliminationEntry {
  id: string;
  consolidationRunId: string;
  description: string;
  type: 'INTERCOMPANY_TRANSACTION' | 'UNREALIZED_PROFIT' | 'INVESTMENT_EQUITY';
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  subsidiaryId: string;
}

export interface ConsolidatedStatement {
  consolidationRunId: string;
  accounts: Array<{
    accountId: string;
    accountName: string;
    totalAmount: number;
    subsidiaryBreakdown: Array<{
      subsidiaryId: string;
      amount: number;
    }>;
  }>;
}

export async function createConsolidationRun(
  db: NeonHttpDatabase,
  data: Omit<ConsolidationRun, 'id' | 'status'>,
): Promise<ConsolidationRun> {
  // TODO: Create consolidation run with IN_PROGRESS status
  throw new Error('Database integration pending');
}

export async function addEliminationEntry(
  db: NeonHttpDatabase,
  data: Omit<EliminationEntry, 'id'>,
): Promise<EliminationEntry> {
  // TODO: Insert elimination entry
  throw new Error('Database integration pending');
}

export async function generateConsolidatedStatement(
  db: NeonHttpDatabase,
  consolidationRunId: string,
): Promise<ConsolidatedStatement> {
  // TODO: Generate consolidated financial statements
  throw new Error('Database integration pending');
}

export function calculateMinorityInterest(
  subsidiaryEquity: number,
  ownershipPercentage: number,
): { parentShare: number; minorityInterest: number } {
  const parentShare = subsidiaryEquity * (ownershipPercentage / 100);
  const minorityInterest = subsidiaryEquity * (1 - ownershipPercentage / 100);

  return { parentShare, minorityInterest };
}

export function identifyIntercompanyTransactions(
  transactions: Array<{
    from: string;
    to: string;
    amount: number;
    description: string;
  }>,
  subsidiaries: string[],
): Array<{ from: string; to: string; amount: number; description: string }> {
  return transactions.filter(
    (txn) => subsidiaries.includes(txn.from) && subsidiaries.includes(txn.to),
  );
}

export function calculateForeignCurrencyTranslation(
  subsidiaryFinancials: Array<{
    accountId: string;
    amount: number;
    accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  }>,
  currentRate: number,
  averageRate: number,
  historicalRate: number,
): Array<{
  accountId: string;
  originalAmount: number;
  translatedAmount: number;
  translationAdjustment: number;
}> {
  return subsidiaryFinancials.map((item) => {
    let rate: number;

    // Use current rate for assets/liabilities, historical for equity, average for revenue/expense
    if (item.accountType === 'ASSET' || item.accountType === 'LIABILITY') {
      rate = currentRate;
    } else if (item.accountType === 'EQUITY') {
      rate = historicalRate;
    } else {
      rate = averageRate;
    }

    const translatedAmount = item.amount * rate;
    const translationAdjustment = 0; // TODO: Calculate cumulative translation adjustment

    return {
      accountId: item.accountId,
      originalAmount: item.amount,
      translatedAmount,
      translationAdjustment,
    };
  });
}

export function reconcileIntercompanyBalances(
  entity1Balances: Array<{ partnerId: string; balance: number }>,
  entity2Balances: Array<{ partnerId: string; balance: number }>,
): Array<{ partnerId: string; entity1: number; entity2: number; difference: number }> {
  const reconciliation: Array<{
    partnerId: string;
    entity1: number;
    entity2: number;
    difference: number;
  }> = [];

  const partners = new Set([
    ...entity1Balances.map((b) => b.partnerId),
    ...entity2Balances.map((b) => b.partnerId),
  ]);

  for (const partnerId of partners) {
    const e1Balance = entity1Balances.find((b) => b.partnerId === partnerId)?.balance || 0;
    const e2Balance = entity2Balances.find((b) => b.partnerId === partnerId)?.balance || 0;

    reconciliation.push({
      partnerId,
      entity1: e1Balance,
      entity2: e2Balance,
      difference: e1Balance + e2Balance, // Should be ~0 if balanced
    });
  }

  return reconciliation.filter((r) => Math.abs(r.difference) > 0.01);
}
