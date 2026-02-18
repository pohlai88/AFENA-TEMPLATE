/**
 * Intercompany Transactions Service
 * Handles IC transaction recording, matching, netting, and elimination entries for consolidation
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface IntercompanyTransaction {
  transactionId: string;
  initiatingEntityId: string;
  counterpartyEntityId: string;
  transactionType: 'SALE' | 'PURCHASE' | 'LOAN' | 'DIVIDEND' | 'ROYALTY' | 'SERVICE_FEE' | 'MANAGEMENT_FEE';
  transactionDate: Date;
  amount: number;
  currency: string;
  sourceDocument: string; // Invoice, contract, etc.
  status: 'DRAFT' | 'CONFIRMED' | 'MATCHED' | 'DISPUTED' | 'RECONCILED';
  matchingTransactionId?: string; // Counterparty's transaction
  varianceAmount?: number;
  businessPurpose: string;
}

export interface ICReconciliation {
  reconciliationId: string;
  periodEnd: Date;
  initiatingEntityId: string;
  counterpartyEntityId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DISPUTED';
  transactions: ICReconciliationLine[];
  totalVariance: number;
  resolvedVariance: number;
  unresolvedVariance: number;
  reconciledBy?: string;
  reconciledDate?: Date;
}

export interface ICReconciliationLine {
  lineNumber: number;
  transactionId: string;
  initiatorAmount: number;
  counterpartyAmount: number;
  variance: number;
  varianceReason?: 'TIMING' | 'FX' | 'PRICING' | 'QUANTITY' | 'MISSING' | 'OTHER';
  resolution?: string;
  isResolved: boolean;
}

export interface ICNetting {
  nettingId: string;
  nettingDate: Date;
  entityPairs: ICNettingPair[];
  totalNettedAmount: number;
  status: 'DRAFT' | 'CALCULATED' | 'APPROVED' | 'EXECUTED';
}

export interface ICNettingPair {
  entityAId: string;
  entityBId: string;
  entityAOwes: number;
  entityBOwes: number;
  netAmount: number;
  netDebtor: string; // Entity that owes after netting
  currency: string;
}

export interface EliminationEntry {
  eliminationId: string;
  consolidationRunId: string;
  eliminationType: 'IC_SALE' | 'IC_RECEIVABLE' | 'IC_PAYABLE' | 'IC_LOAN' | 
                   'IC_INVESTMENT' | 'IC_DIVIDEND' | 'UNREALIZED_PROFIT';
  debitAccount: string;
  creditAccount: string;
  amount: number;
  currency: string;
  description: string;
  supportingTransactions: string[]; // IC transaction IDs
  status: 'DRAFT' | 'POSTED' | 'REVERSED';
}

export interface ICBalance {
  balanceId: string;
  asOfDate: Date;
  entityId: string;
  counterpartyEntityId: string;
  accountType: 'RECEIVABLE' | 'PAYABLE' | 'LOAN_RECEIVABLE' | 'LOAN_PAYABLE';
  balance: number;
  currency: string;
  agingBuckets: {
    current: number;
    days30: number;
    days60: number;
    days90: number;
    over90: number;
  };
}

// ============================================================================
// Database Operations
// ============================================================================

export async function recordICTransaction(
  transaction: Omit<IntercompanyTransaction, 'transactionId'>
): Promise<IntercompanyTransaction> {
  // TODO: Implement with Drizzle ORM
  // const transactionId = generateICTransactionId();
  // return await db.insert(icTransactions).values({ ...transaction, transactionId }).returning();
  throw new Error('Not implemented');
}

export async function matchICTransactions(
  transactionId: string,
  matchingTransactionId: string
): Promise<void> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function createICReconciliation(
  reconciliation: Omit<ICReconciliation, 'reconciliationId'>
): Promise<ICReconciliation> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function performICNetting(netting: Omit<ICNetting, 'nettingId'>): Promise<ICNetting> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function createEliminationEntry(
  entry: Omit<EliminationEntry, 'eliminationId'>
): Promise<EliminationEntry> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getICBalances(
  entityId: string,
  asOfDate: Date
): Promise<ICBalance[]> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getUnmatchedTransactions(
  entityId: string,
  counterpartyId?: string
): Promise<IntercompanyTransaction[]> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateICTransactionId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `IC-${dateStr}-${sequence}`;
}

export function autoMatchTransactions(
  initiatorTransactions: IntercompanyTransaction[],
  counterpartyTransactions: IntercompanyTransaction[]
): {
  exactMatches: Array<{ initiatorId: string; counterpartyId: string }>;
  potentialMatches: Array<{ initiatorId: string; counterpartyId: string; confidence: number }>;
  unmatched: { initiator: string[]; counterparty: string[] };
} {
  const exactMatches: Array<{ initiatorId: string; counterpartyId: string }> = [];
  const potentialMatches: Array<{ initiatorId: string; counterpartyId: string; confidence: number }> = [];
  const matchedInitiator = new Set<string>();
  const matchedCounterparty = new Set<string>();

  // Exact matching criteria: same amount, same date, opposite transaction type
  initiatorTransactions.forEach(initTx => {
    counterpartyTransactions.forEach(ctrTx => {
      if (matchedCounterparty.has(ctrTx.transactionId)) return;

      // Exact match
      if (
        Math.abs(initTx.amount - ctrTx.amount) < 0.01 &&
        initTx.transactionDate.toDateString() === ctrTx.transactionDate.toDateString() &&
        isOppositeType(initTx.transactionType, ctrTx.transactionType)
      ) {
        exactMatches.push({
          initiatorId: initTx.transactionId,
          counterpartyId: ctrTx.transactionId,
        });
        matchedInitiator.add(initTx.transactionId);
        matchedCounterparty.add(ctrTx.transactionId);
      }
    });
  });

  // Fuzzy matching for remaining transactions
  initiatorTransactions.forEach(initTx => {
    if (matchedInitiator.has(initTx.transactionId)) return;

    counterpartyTransactions.forEach(ctrTx => {
      if (matchedCounterparty.has(ctrTx.transactionId)) return;

      const confidence = calculateMatchConfidence(initTx, ctrTx);
      if (confidence >= 70) {
        potentialMatches.push({
          initiatorId: initTx.transactionId,
          counterpartyId: ctrTx.transactionId,
          confidence,
        });
      }
    });
  });

  const unmatched = {
    initiator: initiatorTransactions
      .filter(tx => !matchedInitiator.has(tx.transactionId))
      .map(tx => tx.transactionId),
    counterparty: counterpartyTransactions
      .filter(tx => !matchedCounterparty.has(tx.transactionId))
      .map(tx => tx.transactionId),
  };

  return {
    exactMatches,
    potentialMatches: potentialMatches.sort((a, b) => b.confidence - a.confidence),
    unmatched,
  };
}

function isOppositeType(type1: IntercompanyTransaction['transactionType'], type2: IntercompanyTransaction['transactionType']): boolean {
  const oppositePairs: Record<string, string> = {
    'SALE': 'PURCHASE',
    'PURCHASE': 'SALE',
  };
  return oppositePairs[type1] === type2 || oppositePairs[type2] === type1;
}

function calculateMatchConfidence(
  tx1: IntercompanyTransaction,
  tx2: IntercompanyTransaction
): number {
  let score = 0;

  // Amount similarity (40%)
  const amountDiff = Math.abs(tx1.amount - tx2.amount) / Math.max(tx1.amount, tx2.amount);
  score += (1 - amountDiff) * 40;

  // Date proximity (30%)
  const daysDiff = Math.abs(
    (tx1.transactionDate.getTime() - tx2.transactionDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dateSimilarity = Math.max(0, 1 - daysDiff / 30); // 30 day tolerance
  score += dateSimilarity * 30;

  // Type match (30%)
  if (isOppositeType(tx1.transactionType, tx2.transactionType)) {
    score += 30;
  }

  return Math.round(score);
}

export function analyzeReconciliationVariances(reconciliation: ICReconciliation): {
  totalLines: number;
  matchedLines: number;
  unmatchedLines: number;
  matchRate: number;
  variancesByReason: Array<{ reason: string; count: number; totalAmount: number }>;
  materialVariances: Array<{ lineNumber: number; variance: number }>;
} {
  const totalLines = reconciliation.transactions.length;
  const matchedLines = reconciliation.transactions.filter(line => 
    Math.abs(line.variance) < 0.01
  ).length;
  const unmatchedLines = totalLines - matchedLines;
  const matchRate = totalLines > 0 ? (matchedLines / totalLines) * 100 : 0;

  // Group variances by reason
  const reasonMap = new Map<string, { count: number; totalAmount: number }>();
  reconciliation.transactions.forEach(line => {
    if (line.varianceReason) {
      if (!reasonMap.has(line.varianceReason)) {
        reasonMap.set(line.varianceReason, { count: 0, totalAmount: 0 });
      }
      const data = reasonMap.get(line.varianceReason)!;
      data.count++;
      data.totalAmount += Math.abs(line.variance);
    }
  });

  const variancesByReason = Array.from(reasonMap.entries()).map(([reason, data]) => ({
    reason,
    ...data,
  })).sort((a, b) => b.totalAmount - a.totalAmount);

  // Material variances (>5% or >$10,000)
  const materialVariances = reconciliation.transactions
    .filter(line => {
      const absVariance = Math.abs(line.variance);
      const variancePct = line.initiatorAmount !== 0 
        ? (absVariance / line.initiatorAmount) * 100 
        : 0;
      return absVariance > 10000 || variancePct > 5;
    })
    .map(line => ({
      lineNumber: line.lineNumber,
      variance: line.variance,
    }))
    .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));

  return {
    totalLines,
    matchedLines,
    unmatchedLines,
    matchRate,
    variancesByReason,
    materialVariances,
  };
}

export function calculateNettingOpportunity(
  balances: ICBalance[]
): ICNettingPair[] {
  const nettingPairs: ICNettingPair[] = [];
  const processedPairs = new Set<string>();

  balances.forEach(balance => {
    const pairKey = [balance.entityId, balance.counterpartyEntityId].sort().join('-');
    if (processedPairs.has(pairKey)) return;

    // Find opposite balance
    const oppositeBalance = balances.find(b =>
      b.entityId === balance.counterpartyEntityId &&
      b.counterpartyEntityId === balance.entityId &&
      b.currency === balance.currency
    );

    if (oppositeBalance) {
      const entityAOwes = balance.accountType === 'PAYABLE' ? Math.abs(balance.balance) : 0;
      const entityBOwes = oppositeBalance.accountType === 'PAYABLE' ? Math.abs(oppositeBalance.balance) : 0;
      const netAmount = Math.abs(entityAOwes - entityBOwes);
      const netDebtor = entityAOwes > entityBOwes ? balance.entityId : oppositeBalance.entityId;

      nettingPairs.push({
        entityAId: balance.entityId,
        entityBId: balance.counterpartyEntityId,
        entityAOwes,
        entityBOwes,
        netAmount,
        netDebtor,
        currency: balance.currency,
      });

      processedPairs.add(pairKey);
    }
  });

  return nettingPairs.sort((a, b) => b.netAmount - a.netAmount);
}

export function generateEliminationEntries(
  transactions: IntercompanyTransaction[]
): Omit<EliminationEntry, 'eliminationId' | 'consolidationRunId' | 'status'>[] {
  const entries: Omit<EliminationEntry, 'eliminationId' | 'consolidationRunId' | 'status'>[] = [];

  // Group by transaction type
  const salesTransactions = transactions.filter(tx => tx.transactionType === 'SALE' && tx.status === 'MATCHED');
  const receivablesPayables = transactions.filter(tx => 
    ['RECEIVABLE', 'PAYABLE'].includes(tx.transactionType) && tx.status === 'MATCHED'
  );
  const loans = transactions.filter(tx => tx.transactionType === 'LOAN' && tx.status === 'MATCHED');

  // Eliminate IC sales/purchases
  if (salesTransactions.length > 0) {
    const totalSales = salesTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    entries.push({
      eliminationType: 'IC_SALE',
      debitAccount: 'IC_SALES',
      creditAccount: 'IC_COGS',
      amount: totalSales,
      currency: 'USD', // Would need to handle multi-currency
      description: `Elimination of IC sales - ${salesTransactions.length} transactions`,
      supportingTransactions: salesTransactions.map(tx => tx.transactionId),
    });
  }

  // Eliminate IC receivables/payables
  if (receivablesPayables.length > 0) {
    const totalReceivables = receivablesPayables.reduce((sum, tx) => sum + tx.amount, 0);
    entries.push({
      eliminationType: 'IC_RECEIVABLE',
      debitAccount: 'IC_PAYABLES',
      creditAccount: 'IC_RECEIVABLES',
      amount: totalReceivables,
      currency: 'USD',
      description: `Elimination of IC receivables/payables - ${receivablesPayables.length} transactions`,
      supportingTransactions: receivablesPayables.map(tx => tx.transactionId),
    });
  }

  // Eliminate IC loans
  if (loans.length > 0) {
    const totalLoans = loans.reduce((sum, tx) => sum + tx.amount, 0);
    entries.push({
      eliminationType: 'IC_LOAN',
      debitAccount: 'IC_LOAN_PAYABLE',
      creditAccount: 'IC_LOAN_RECEIVABLE',
      amount: totalLoans,
      currency: 'USD',
      description: `Elimination of IC loans - ${loans.length} transactions`,
      supportingTransactions: loans.map(tx => tx.transactionId),
    });
  }

  return entries;
}

export function calculateICAgingBuckets(
  transactions: IntercompanyTransaction[],
  asOfDate: Date
): ICBalance['agingBuckets'] {
  const buckets = {
    current: 0,
    days30: 0,
    days60: 0,
    days90: 0,
    over90: 0,
  };

  transactions.forEach(tx => {
    const daysPast = Math.floor(
      (asOfDate.getTime() - tx.transactionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysPast <= 30) buckets.current += tx.amount;
    else if (daysPast <= 60) buckets.days30 += tx.amount;
    else if (daysPast <= 90) buckets.days60 += tx.amount;
    else if (daysPast <= 120) buckets.days90 += tx.amount;
    else buckets.over90 += tx.amount;
  });

  return buckets;
}

export function analyzeICEfficiency(
  reconciliations: ICReconciliation[]
): {
  avgReconciliationTime: number;
  avgMatchRate: number;
  topVarianceReasons: Array<{ reason: string; count: number }>;
  entityPairPerformance: Array<{ entityPair: string; matchRate: number; avgVariance: number }>;
} {
  let totalTime = 0;
  let totalMatchRate = 0;
  let completedCount = 0;
  const reasonCounts = new Map<string, number>();
  const pairMetrics = new Map<string, { totalLines: number; matchedLines: number; totalVariance: number }>();

  reconciliations.forEach(recon => {
    if (recon.status === 'COMPLETED' && recon.reconciledDate) {
      const days = Math.floor(
        (recon.reconciledDate.getTime() - recon.periodEnd.getTime()) / (1000 * 60 * 60 * 24)
      );
      totalTime += days;
      completedCount++;
    }

    const matchedLines = recon.transactions.filter(line => Math.abs(line.variance) < 0.01).length;
    const matchRate = recon.transactions.length > 0 
      ? (matchedLines / recon.transactions.length) * 100 
      : 0;
    totalMatchRate += matchRate;

    // Variance reasons
    recon.transactions.forEach(line => {
      if (line.varianceReason) {
        reasonCounts.set(line.varianceReason, (reasonCounts.get(line.varianceReason) || 0) + 1);
      }
    });

    // Entity pair performance
    const pairKey = `${recon.initiatingEntityId}-${recon.counterpartyEntityId}`;
    if (!pairMetrics.has(pairKey)) {
      pairMetrics.set(pairKey, { totalLines: 0, matchedLines: 0, totalVariance: 0 });
    }
    const metrics = pairMetrics.get(pairKey)!;
    metrics.totalLines += recon.transactions.length;
    metrics.matchedLines += matchedLines;
    metrics.totalVariance += Math.abs(recon.totalVariance);
  });

  const avgReconciliationTime = completedCount > 0 ? totalTime / completedCount : 0;
  const avgMatchRate = reconciliations.length > 0 ? totalMatchRate / reconciliations.length : 0;

  const topVarianceReasons = Array.from(reasonCounts.entries())
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const entityPairPerformance = Array.from(pairMetrics.entries()).map(([entityPair, metrics]) => ({
    entityPair,
    matchRate: metrics.totalLines > 0 ? (metrics.matchedLines / metrics.totalLines) * 100 : 0,
    avgVariance: metrics.totalLines > 0 ? metrics.totalVariance / metrics.totalLines : 0,
  }));

  return {
    avgReconciliationTime,
    avgMatchRate,
    topVarianceReasons,
    entityPairPerformance,
  };
}
