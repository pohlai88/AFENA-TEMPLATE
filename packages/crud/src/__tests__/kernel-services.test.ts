import { describe, expect, it, vi } from 'vitest';

// Mock afena-database to avoid DATABASE_URL requirement at module load.
vi.mock('afena-database', () => ({
  db: {},
  dbRo: {},
  sql: {},
  and: (...args: unknown[]) => args,
  eq: () => true,
  desc: () => true,
  asc: () => true,
  numberSequences: {},
  fxRates: {},
  taxRates: {},
  fiscalPeriods: {},
  priceLists: {},
  priceListItems: {},
  discountRules: {},
  matchResults: {},
  assets: {},
  depreciationSchedules: {},
  revenueSchedules: {},
  revenueScheduleLines: {},
  budgets: {},
  budgetCommitments: {},
  uomConversions: {},
  landedCostAllocations: {},
  lotTracking: {},
  inventoryTraceLinks: {},
  intercompanyTransactions: {},
  bankStatementLines: {},
  paymentAllocations: {},
  webhookEndpoints: {},
  webhookDeliveries: {},
  boms: {},
  bomLines: {},
  workOrders: {},
  wipMovements: {},
}));

import { calculateLineTax } from '../services/tax-calc';
import { resolveFiscalYear } from '../services/fiscal-year';
import { generateDepreciationSchedule } from '../services/depreciation-engine';
import { generateStraightLineSchedule } from '../services/revenue-recognition';
import { convertQuantity } from '../services/uom-conversion';
import { evaluateMatch } from '../services/three-way-match';
import { generateEliminationEntries } from '../services/intercompany';
import { scoreMatch, autoMatchBatch } from '../services/bank-reconciliation';
import { explodeBom, calculateCostRollup, generateWipJournalEntries } from '../services/manufacturing-engine';

import type { MatchInput, MatchTolerance } from '../services/three-way-match';
import type { IntercompanyPairResult } from '../services/intercompany';
import type { StatementLineForMatch } from '../services/bank-reconciliation';
import type { WipMovementType } from '../services/manufacturing-engine';

// ── Tax Calculation ─────────────────────────────────────

describe('calculateLineTax', () => {
  it('calculates 10% tax with half_up rounding', () => {
    expect(calculateLineTax(10000, '10')).toBe(1000);
  });

  it('calculates 6% SST on RM 99.90 (9990 minor)', () => {
    // 9990 * 0.06 = 599.4 → rounds to 599
    expect(calculateLineTax(9990, '6')).toBe(599);
  });

  it('rounds up with ceil method', () => {
    // 9990 * 0.06 = 599.4 → ceil = 600
    expect(calculateLineTax(9990, '6', 'ceil')).toBe(600);
  });

  it('rounds down with floor method', () => {
    // 10001 * 0.06 = 600.06 → floor = 600
    expect(calculateLineTax(10001, '6', 'floor')).toBe(600);
  });

  it('handles banker rounding on exact 0.5', () => {
    // 500 * 5% = 25.0 → no rounding needed
    expect(calculateLineTax(500, '5', 'banker')).toBe(25);
  });

  it('handles zero amount', () => {
    expect(calculateLineTax(0, '10')).toBe(0);
  });

  it('handles zero rate', () => {
    expect(calculateLineTax(10000, '0')).toBe(0);
  });
});

// ── Fiscal Year ─────────────────────────────────────────

describe('resolveFiscalYear', () => {
  it('returns current year when fiscal starts in January', () => {
    expect(resolveFiscalYear(1, new Date('2025-06-15'))).toBe(2025);
  });

  it('returns current year when date is after fiscal start', () => {
    // Fiscal year starts April, date is June → FY 2025
    expect(resolveFiscalYear(4, new Date('2025-06-15'))).toBe(2025);
  });

  it('returns previous year when date is before fiscal start', () => {
    // Fiscal year starts April, date is February → FY 2024
    expect(resolveFiscalYear(4, new Date('2025-02-15'))).toBe(2024);
  });

  it('returns current year when date is exactly on fiscal start month', () => {
    expect(resolveFiscalYear(4, new Date('2025-04-01'))).toBe(2025);
  });
});

// ── Depreciation Engine ─────────────────────────────────

describe('generateDepreciationSchedule', () => {
  it('straight-line: 12000 cost, 0 residual, 12 months', () => {
    const result = generateDepreciationSchedule(12000, 0, 12, 'straight_line');
    expect(result.totalPeriods).toBe(12);
    expect(result.periods[0]!.depreciationMinor).toBe(1000);
    expect(result.periods[11]!.bookValueMinor).toBe(0);
    // Total depreciation = cost
    const totalDep = result.periods.reduce((s, p) => s + p.depreciationMinor, 0);
    expect(totalDep).toBe(12000);
  });

  it('straight-line: absorbs rounding remainder in last period', () => {
    // 10000 / 3 = 3333.33... → floor = 3333 per period, last = 10000 - 6666 = 3334
    const result = generateDepreciationSchedule(10000, 0, 3, 'straight_line');
    expect(result.periods[0]!.depreciationMinor).toBe(3333);
    expect(result.periods[1]!.depreciationMinor).toBe(3333);
    expect(result.periods[2]!.depreciationMinor).toBe(3334);
    const totalDep = result.periods.reduce((s, p) => s + p.depreciationMinor, 0);
    expect(totalDep).toBe(10000);
  });

  it('straight-line: respects residual value', () => {
    const result = generateDepreciationSchedule(12000, 2000, 10, 'straight_line');
    // Depreciable base = 10000, per period = 1000
    expect(result.periods[0]!.depreciationMinor).toBe(1000);
    const totalDep = result.periods.reduce((s, p) => s + p.depreciationMinor, 0);
    expect(totalDep).toBe(10000);
  });

  it('declining-balance: never depreciates below residual', () => {
    const result = generateDepreciationSchedule(10000, 1000, 12, 'declining_balance');
    const lastPeriod = result.periods[result.periods.length - 1]!;
    expect(lastPeriod.bookValueMinor).toBeGreaterThanOrEqual(1000);
  });
});

// ── Revenue Recognition ─────────────────────────────────

describe('generateStraightLineSchedule', () => {
  it('divides evenly across 12 months', () => {
    const result = generateStraightLineSchedule(12000, '2025-01-01', '2025-12-01');
    expect(result.periodCount).toBe(12);
    expect(result.lines[0]!.amountMinor).toBe(1000);
    expect(result.lines[11]!.cumulativeMinor).toBe(12000);
  });

  it('absorbs rounding remainder in last period', () => {
    // 10000 / 3 = 3333 per period, last = 3334
    const result = generateStraightLineSchedule(10000, '2025-01-01', '2025-03-01');
    expect(result.periodCount).toBe(3);
    expect(result.lines[0]!.amountMinor).toBe(3333);
    expect(result.lines[2]!.amountMinor).toBe(3334);
    expect(result.lines[2]!.cumulativeMinor).toBe(10000);
  });

  it('handles single-month schedule', () => {
    const result = generateStraightLineSchedule(5000, '2025-06-01', '2025-06-01');
    expect(result.periodCount).toBe(1);
    expect(result.lines[0]!.amountMinor).toBe(5000);
  });

  it('handles zero-length range', () => {
    const result = generateStraightLineSchedule(5000, '2025-06-15', '2025-01-01');
    expect(result.periodCount).toBe(1);
    expect(result.lines[0]!.amountMinor).toBe(5000);
  });
});

// ── UOM Conversion ──────────────────────────────────────

describe('convertQuantity', () => {
  it('converts with factor 1 (identity)', () => {
    expect(convertQuantity(100, 1)).toBe(100);
  });

  it('converts kg to g (factor 1000)', () => {
    expect(convertQuantity(2.5, 1000)).toBe(2500);
  });

  it('converts with half_up rounding', () => {
    // 1 / 3 = 0.333333... → rounded to 6 decimal places = 0.333333
    expect(convertQuantity(1, 1 / 3, 'half_up', 6)).toBeCloseTo(0.333333, 5);
  });

  it('converts with ceil rounding', () => {
    // 10 / 3 = 3.333333... → ceil at 2 decimals = 3.34
    expect(convertQuantity(10, 1 / 3, 'ceil', 2)).toBe(3.34);
  });

  it('converts with floor rounding', () => {
    // 10 / 3 = 3.333333... → floor at 2 decimals = 3.33
    expect(convertQuantity(10, 1 / 3, 'floor', 2)).toBe(3.33);
  });
});

// ── 3-Way Match ─────────────────────────────────────────

describe('evaluateMatch', () => {
  const baseTolerance: MatchTolerance = {
    qtyTolerancePercent: 2,
    priceTolerancePercent: 1,
    totalToleranceMinor: 100,
  };

  it('3-way match: all within tolerance → matched', () => {
    const input: MatchInput = {
      companyId: 'c1',
      poLineId: 'po1',
      grnLineId: 'grn1',
      invoiceLineId: 'inv1',
      poQty: 100,
      poUnitPriceMinor: 1000,
      grnQty: 100,
      invoiceQty: 100,
      invoiceUnitPriceMinor: 1000,
    };
    const result = evaluateMatch(input, baseTolerance);
    expect(result.matchType).toBe('three_way');
    expect(result.status).toBe('matched');
  });

  it('2-way match: no GRN → two_way', () => {
    const input: MatchInput = {
      companyId: 'c1',
      poLineId: 'po1',
      poQty: 100,
      poUnitPriceMinor: 1000,
      invoiceQty: 100,
      invoiceUnitPriceMinor: 1000,
    };
    const result = evaluateMatch(input, baseTolerance);
    expect(result.matchType).toBe('two_way');
    expect(result.status).toBe('matched');
  });

  it('qty variance exceeds tolerance → exception', () => {
    const input: MatchInput = {
      companyId: 'c1',
      poLineId: 'po1',
      grnLineId: 'grn1',
      poQty: 100,
      poUnitPriceMinor: 1000,
      grnQty: 110, // 10% variance > 2% tolerance
    };
    const result = evaluateMatch(input, baseTolerance);
    expect(result.status).toBe('exception');
  });

  it('price variance exceeds tolerance → exception', () => {
    const input: MatchInput = {
      companyId: 'c1',
      poLineId: 'po1',
      poQty: 100,
      poUnitPriceMinor: 1000,
      invoiceQty: 100,
      invoiceUnitPriceMinor: 1050, // 5% variance > 1% tolerance
    };
    const result = evaluateMatch(input, baseTolerance);
    expect(result.status).toBe('exception');
  });
});

// ── Intercompany Elimination ────────────────────────────

describe('generateEliminationEntries', () => {
  it('generates 2 entries per transaction (receivable + payable)', () => {
    const transactions: IntercompanyPairResult[] = [
      {
        transactionId: 'txn1',
        sourceCompanyId: 'compA',
        targetCompanyId: 'compB',
        amountMinor: 50000,
        currencyCode: 'MYR',
        status: 'matched',
      },
    ];

    const entries = generateEliminationEntries(transactions, 'acct-recv', 'acct-pay');
    expect(entries).toHaveLength(2);

    // First entry: credit receivable on source
    expect(entries[0]!.sourceCompanyId).toBe('compA');
    expect(entries[0]!.accountId).toBe('acct-recv');
    expect(entries[0]!.creditMinor).toBe(50000);
    expect(entries[0]!.debitMinor).toBe(0);

    // Second entry: debit payable on target
    expect(entries[1]!.sourceCompanyId).toBe('compB');
    expect(entries[1]!.accountId).toBe('acct-pay');
    expect(entries[1]!.debitMinor).toBe(50000);
    expect(entries[1]!.creditMinor).toBe(0);
  });

  it('handles multiple transactions', () => {
    const transactions: IntercompanyPairResult[] = [
      { transactionId: 't1', sourceCompanyId: 'a', targetCompanyId: 'b', amountMinor: 1000, currencyCode: 'MYR', status: 'matched' },
      { transactionId: 't2', sourceCompanyId: 'b', targetCompanyId: 'c', amountMinor: 2000, currencyCode: 'MYR', status: 'matched' },
    ];
    const entries = generateEliminationEntries(transactions, 'recv', 'pay');
    expect(entries).toHaveLength(4);
  });

  it('returns empty for no transactions', () => {
    const entries = generateEliminationEntries([], 'recv', 'pay');
    expect(entries).toHaveLength(0);
  });
});

// ── Bank Reconciliation Auto-Match ──────────────────────

describe('scoreMatch', () => {
  it('exact amount + reference = high confidence', () => {
    const line: StatementLineForMatch = {
      lineId: 'l1',
      amountMinor: 10000,
      transactionDate: '2025-06-15',
      description: 'Payment',
      reference: 'INV-001',
    };
    const candidate = {
      entityType: 'payment',
      entityId: 'p1',
      amountMinor: 10000,
      date: '2025-06-15',
      reference: 'INV-001',
    };
    const result = scoreMatch(line, candidate);
    expect(result.confidence).toBe('exact');
    expect(result.score).toBe(100);
  });

  it('exact amount + close date = high confidence', () => {
    const line: StatementLineForMatch = {
      lineId: 'l1',
      amountMinor: 10000,
      transactionDate: '2025-06-15',
      description: 'Payment',
    };
    const candidate = {
      entityType: 'payment',
      entityId: 'p1',
      amountMinor: 10000,
      date: '2025-06-17', // 2 days apart
    };
    const result = scoreMatch(line, candidate);
    expect(result.confidence).toBe('high');
    expect(result.score).toBe(70);
  });

  it('amount mismatch beyond 1% = low confidence', () => {
    const line: StatementLineForMatch = {
      lineId: 'l1',
      amountMinor: 10000,
      transactionDate: '2025-06-15',
      description: 'Payment',
    };
    const candidate = {
      entityType: 'payment',
      entityId: 'p1',
      amountMinor: 12000, // 20% off
      date: '2025-06-15',
    };
    const result = scoreMatch(line, candidate);
    expect(result.confidence).toBe('low');
    expect(result.score).toBe(0);
  });
});

describe('autoMatchBatch', () => {
  it('matches lines to best candidates', () => {
    const lines: StatementLineForMatch[] = [
      { lineId: 'l1', amountMinor: 10000, transactionDate: '2025-06-15', description: 'A' },
      { lineId: 'l2', amountMinor: 20000, transactionDate: '2025-06-16', description: 'B' },
    ];
    const candidates = [
      { entityType: 'payment', entityId: 'p1', amountMinor: 10000, date: '2025-06-15' },
      { entityType: 'payment', entityId: 'p2', amountMinor: 20000, date: '2025-06-16' },
    ];
    const results = autoMatchBatch(lines, candidates);
    expect(results[0]!.matched).toBe(true);
    expect(results[0]!.candidate?.entityId).toBe('p1');
    expect(results[1]!.matched).toBe(true);
    expect(results[1]!.candidate?.entityId).toBe('p2');
  });

  it('does not double-match candidates', () => {
    const lines: StatementLineForMatch[] = [
      { lineId: 'l1', amountMinor: 10000, transactionDate: '2025-06-15', description: 'A' },
      { lineId: 'l2', amountMinor: 10000, transactionDate: '2025-06-15', description: 'B' },
    ];
    const candidates = [
      { entityType: 'payment', entityId: 'p1', amountMinor: 10000, date: '2025-06-15' },
    ];
    const results = autoMatchBatch(lines, candidates);
    expect(results[0]!.matched).toBe(true);
    expect(results[1]!.matched).toBe(false);
  });

  it('respects minimum confidence threshold', () => {
    const lines: StatementLineForMatch[] = [
      { lineId: 'l1', amountMinor: 10000, transactionDate: '2025-06-15', description: 'A' },
    ];
    const candidates = [
      { entityType: 'payment', entityId: 'p1', amountMinor: 10000, date: '2025-07-15' }, // 30 days apart
    ];
    const results = autoMatchBatch(lines, candidates, 'high');
    // Exact amount (50) + date >7 days (0) = 50 → medium, below 'high' threshold
    expect(results[0]!.matched).toBe(false);
  });
});

// ── Manufacturing Engine ────────────────────────────────

describe('explodeBom', () => {
  const baseBom = {
    bomId: 'bom-1',
    productId: 'prod-1',
    bomVersion: 1,
    yieldQty: 1,
    lines: [
      { componentProductId: 'comp-a', qty: 2, wastePercent: 0, uomId: null, isOptional: false, sortOrder: 1 },
      { componentProductId: 'comp-b', qty: 0.5, wastePercent: 10, uomId: null, isOptional: false, sortOrder: 2 },
      { componentProductId: 'comp-c', qty: 1, wastePercent: 0, uomId: null, isOptional: true, sortOrder: 3 },
    ],
  };

  it('scales quantities by order qty', () => {
    const result = explodeBom(baseBom, 10);
    expect(result.orderQty).toBe(10);
    expect(result.lines[0]!.requiredQty).toBe(20); // 2 * 10
    expect(result.lines[1]!.requiredQty).toBe(5);  // 0.5 * 10
  });

  it('applies waste percentage to gross qty', () => {
    const result = explodeBom(baseBom, 10);
    // comp-b: 5 * 1.10 = 5.5
    expect(result.lines[1]!.grossQty).toBe(5.5);
    // comp-a: 20 * 1.00 = 20
    expect(result.lines[0]!.grossQty).toBe(20);
  });

  it('counts only non-optional components in totalComponents', () => {
    const result = explodeBom(baseBom, 1);
    expect(result.totalComponents).toBe(2); // comp-a and comp-b, not comp-c
  });

  it('handles yield qty > 1 (batch recipe)', () => {
    const batchBom = { ...baseBom, yieldQty: 5 };
    const result = explodeBom(batchBom, 10);
    // Scale factor = 10/5 = 2
    expect(result.lines[0]!.requiredQty).toBe(4); // 2 * 2
  });

  it('sorts lines by sortOrder', () => {
    const unsorted = {
      ...baseBom,
      lines: [
        { componentProductId: 'z', qty: 1, wastePercent: 0, uomId: null, isOptional: false, sortOrder: 3 },
        { componentProductId: 'a', qty: 1, wastePercent: 0, uomId: null, isOptional: false, sortOrder: 1 },
      ],
    };
    const result = explodeBom(unsorted, 1);
    expect(result.lines[0]!.componentProductId).toBe('a');
    expect(result.lines[1]!.componentProductId).toBe('z');
  });
});

describe('calculateCostRollup', () => {
  it('sums costs by movement type', () => {
    const movements: Array<{ movementType: WipMovementType; costMinor: number }> = [
      { movementType: 'material_issue', costMinor: 5000 },
      { movementType: 'material_issue', costMinor: 3000 },
      { movementType: 'labor', costMinor: 2000 },
      { movementType: 'overhead', costMinor: 1000 },
      { movementType: 'scrap', costMinor: 500 },
    ];
    const result = calculateCostRollup(movements, 10);
    expect(result.materialCostMinor).toBe(8000);
    expect(result.laborCostMinor).toBe(2000);
    expect(result.overheadCostMinor).toBe(1000);
    expect(result.scrapCostMinor).toBe(500);
    expect(result.totalCostMinor).toBe(11500);
    expect(result.unitCostMinor).toBe(1150);
  });

  it('material_return reduces material cost', () => {
    const movements: Array<{ movementType: WipMovementType; costMinor: number }> = [
      { movementType: 'material_issue', costMinor: 5000 },
      { movementType: 'material_return', costMinor: 1000 },
    ];
    const result = calculateCostRollup(movements, 1);
    expect(result.materialCostMinor).toBe(4000);
    expect(result.totalCostMinor).toBe(4000);
  });

  it('completion does not add cost', () => {
    const movements: Array<{ movementType: WipMovementType; costMinor: number }> = [
      { movementType: 'material_issue', costMinor: 5000 },
      { movementType: 'completion', costMinor: 5000 },
    ];
    const result = calculateCostRollup(movements, 1);
    expect(result.totalCostMinor).toBe(5000); // completion doesn't add
  });

  it('unit cost is 0 when completedQty is 0', () => {
    const movements: Array<{ movementType: WipMovementType; costMinor: number }> = [
      { movementType: 'material_issue', costMinor: 5000 },
    ];
    const result = calculateCostRollup(movements, 0);
    expect(result.unitCostMinor).toBe(0);
  });
});

describe('generateWipJournalEntries', () => {
  const accountMap = {
    rawMaterialInventory: 'acct-rm',
    wagesPayable: 'acct-wages',
    overheadApplied: 'acct-oh',
    finishedGoods: 'acct-fg',
    scrapExpense: 'acct-scrap',
  };
  const wipAccount = 'acct-wip';

  it('material_issue: debit WIP, credit raw material', () => {
    const spec = generateWipJournalEntries('wo-1', 'co-1', wipAccount, [
      { movementType: 'material_issue', costMinor: 5000 },
    ], accountMap);
    expect(spec.entries).toHaveLength(2);
    expect(spec.entries[0]!.accountId).toBe(wipAccount);
    expect(spec.entries[0]!.debitMinor).toBe(5000);
    expect(spec.entries[1]!.accountId).toBe('acct-rm');
    expect(spec.entries[1]!.creditMinor).toBe(5000);
  });

  it('completion: debit FG, credit WIP', () => {
    const spec = generateWipJournalEntries('wo-1', 'co-1', wipAccount, [
      { movementType: 'completion', costMinor: 10000 },
    ], accountMap);
    expect(spec.entries).toHaveLength(2);
    expect(spec.entries[0]!.accountId).toBe('acct-fg');
    expect(spec.entries[0]!.debitMinor).toBe(10000);
    expect(spec.entries[1]!.accountId).toBe(wipAccount);
    expect(spec.entries[1]!.creditMinor).toBe(10000);
  });

  it('skips zero-cost movements', () => {
    const spec = generateWipJournalEntries('wo-1', 'co-1', wipAccount, [
      { movementType: 'labor', costMinor: 0 },
    ], accountMap);
    expect(spec.entries).toHaveLength(0);
  });

  it('generates balanced entries (total debits = total credits)', () => {
    const spec = generateWipJournalEntries('wo-1', 'co-1', wipAccount, [
      { movementType: 'material_issue', costMinor: 5000 },
      { movementType: 'labor', costMinor: 2000 },
      { movementType: 'overhead', costMinor: 1000 },
      { movementType: 'completion', costMinor: 8000 },
    ], accountMap);
    const totalDebits = spec.entries.reduce((s, e) => s + e.debitMinor, 0);
    const totalCredits = spec.entries.reduce((s, e) => s + e.creditMinor, 0);
    expect(totalDebits).toBe(totalCredits);
  });

  it('scrap: debit scrap expense, credit WIP', () => {
    const spec = generateWipJournalEntries('wo-1', 'co-1', wipAccount, [
      { movementType: 'scrap', costMinor: 300 },
    ], accountMap);
    expect(spec.entries[0]!.accountId).toBe('acct-scrap');
    expect(spec.entries[0]!.debitMinor).toBe(300);
    expect(spec.entries[1]!.accountId).toBe(wipAccount);
    expect(spec.entries[1]!.creditMinor).toBe(300);
  });
});
