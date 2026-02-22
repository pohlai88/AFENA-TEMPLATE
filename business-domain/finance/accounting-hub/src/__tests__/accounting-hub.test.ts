import { describe, expect, it, vi } from 'vitest';

import { computeAccrualLines } from '../calculators/accrual-calculator';
import { allocateProportional } from '../calculators/allocation-engine';
import { computeDerivationId, deriveJournalLines } from '../calculators/derivation-engine';
import { computeReclassLines } from '../calculators/reclass-calculator';
import {
  buildAccrualRunIntent,
  buildAllocationRunIntent,
  buildDeriveCommitIntent,
  buildPublishMappingIntent,
  buildReclassRunIntent,
} from '../commands/hub-intent';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
}));

/* ────────── Derivation Engine ────────── */

describe('deriveJournalLines', () => {
  it('produces balanced DR=CR lines from rules', () => {
    const { result } = deriveJournalLines({
      eventId: 'evt-001',
      amountMinor: 10000,
      currencyCode: 'MYR',
      rules: [{ debitAccountId: 'acc-expense', creditAccountId: 'acc-payable', fraction: 1.0 }],
      mappingVersion: 1,
    });

    expect(result.journalLines).toHaveLength(2);
    expect(result.totalDebitMinor).toBe(10000);
    expect(result.totalCreditMinor).toBe(10000);
    expect(result.derivationId).toBeTruthy();
  });

  it('handles multiple rules with fractional splits', () => {
    const { result } = deriveJournalLines({
      eventId: 'evt-002',
      amountMinor: 10000,
      currencyCode: 'MYR',
      rules: [
        { debitAccountId: 'acc-exp-a', creditAccountId: 'acc-pay', fraction: 0.6 },
        { debitAccountId: 'acc-exp-b', creditAccountId: 'acc-pay', fraction: 0.4 },
      ],
      mappingVersion: 1,
    });

    expect(result.journalLines).toHaveLength(4);
    expect(result.totalDebitMinor).toBe(10000);
    expect(result.totalCreditMinor).toBe(10000);
  });

  it('throws for empty rules', () => {
    expect(() =>
      deriveJournalLines({
        eventId: 'evt-003',
        amountMinor: 5000,
        currencyCode: 'MYR',
        rules: [],
        mappingVersion: 1,
      }),
    ).toThrow(/at least one mapping rule/);
  });

  it('throws for negative amount', () => {
    expect(() =>
      deriveJournalLines({
        eventId: 'evt-004',
        amountMinor: -100,
        currencyCode: 'MYR',
        rules: [{ debitAccountId: 'a', creditAccountId: 'b', fraction: 1.0 }],
        mappingVersion: 1,
      }),
    ).toThrow(/non-negative/);
  });
});

describe('computeDerivationId', () => {
  it('produces deterministic IDs', () => {
    const { result: id1 } = computeDerivationId('evt-1', 1, 'hash-1');
    const { result: id2 } = computeDerivationId('evt-1', 1, 'hash-1');
    expect(id1).toBe(id2);
  });

  it('produces different IDs for different inputs', () => {
    const { result: id1 } = computeDerivationId('evt-1', 1, 'hash-1');
    const { result: id2 } = computeDerivationId('evt-1', 2, 'hash-1');
    expect(id1).not.toBe(id2);
  });
});

/* ────────── Allocation Engine ────────── */

describe('allocateProportional', () => {
  it('splits evenly by equal weights', () => {
    const { result } = allocateProportional(10000, [
      { costCenterId: 'cc-1', weight: 1 },
      { costCenterId: 'cc-2', weight: 1 },
    ]);
    expect(result).toHaveLength(2);
    const total = result.reduce((s, l) => s + l.amountMinor, 0);
    expect(total).toBe(10000);
  });

  it('handles weighted split with penny distribution', () => {
    const { result } = allocateProportional(10001, [
      { costCenterId: 'cc-1', weight: 1 },
      { costCenterId: 'cc-2', weight: 1 },
      { costCenterId: 'cc-3', weight: 1 },
    ]);
    const total = result.reduce((s, l) => s + l.amountMinor, 0);
    expect(total).toBe(10001); // Last target absorbs remainder
  });

  it('throws for empty targets', () => {
    expect(() => allocateProportional(10000, [])).toThrow(/at least one target/);
  });

  it('throws for negative amount', () => {
    expect(() => allocateProportional(-100, [{ costCenterId: 'cc-1', weight: 1 }])).toThrow(
      /non-negative/,
    );
  });
});

/* ────────── Reclassification Calculator ────────── */

describe('computeReclassLines', () => {
  it('produces balanced debit/credit pairs', () => {
    const { result } = computeReclassLines([
      { fromAccountId: 'acc-a', toAccountId: 'acc-b', amountMinor: 5000 },
    ]);
    expect(result).toHaveLength(2);
    const dr = result.filter((l) => l.side === 'debit');
    const cr = result.filter((l) => l.side === 'credit');
    expect(dr[0]!.amountMinor).toBe(cr[0]!.amountMinor);
  });

  it('handles multiple entries', () => {
    const { result } = computeReclassLines([
      { fromAccountId: 'acc-a', toAccountId: 'acc-b', amountMinor: 5000 },
      { fromAccountId: 'acc-c', toAccountId: 'acc-d', amountMinor: 3000 },
    ]);
    expect(result).toHaveLength(4);
  });

  it('throws for same account', () => {
    expect(() =>
      computeReclassLines([{ fromAccountId: 'acc-a', toAccountId: 'acc-a', amountMinor: 1000 }]),
    ).toThrow(/itself/);
  });

  it('throws for zero/negative amount', () => {
    expect(() =>
      computeReclassLines([{ fromAccountId: 'acc-a', toAccountId: 'acc-b', amountMinor: 0 }]),
    ).toThrow(/positive/);
  });
});

/* ────────── Accrual Calculator ────────── */

describe('computeAccrualLines', () => {
  it('computes correct accrual for middle period', () => {
    const { result } = computeAccrualLines({
      expenseAccountId: 'acc-exp',
      liabilityAccountId: 'acc-liab',
      totalMinor: 12000,
      totalPeriods: 12,
      currentPeriod: 6,
    });
    expect(result).toHaveLength(2);
    expect(result[0]!.amountMinor).toBe(1000);
    expect(result[1]!.amountMinor).toBe(1000);
  });

  it('last period absorbs rounding remainder', () => {
    const { result } = computeAccrualLines({
      expenseAccountId: 'acc-exp',
      liabilityAccountId: 'acc-liab',
      totalMinor: 10000,
      totalPeriods: 3,
      currentPeriod: 3,
    });
    // 10000/3 ≈ 3333. Periods 1-2 = 3333 each = 6666. Last = 10000-6666 = 3334
    expect(result[0]!.amountMinor).toBe(3334);
  });

  it('throws for period out of range', () => {
    expect(() =>
      computeAccrualLines({
        expenseAccountId: 'a',
        liabilityAccountId: 'b',
        totalMinor: 1000,
        totalPeriods: 3,
        currentPeriod: 4,
      }),
    ).toThrow(/out of range/);
  });

  it('throws for same account', () => {
    expect(() =>
      computeAccrualLines({
        expenseAccountId: 'acc-a',
        liabilityAccountId: 'acc-a',
        totalMinor: 1000,
        totalPeriods: 1,
        currentPeriod: 1,
      }),
    ).toThrow(/must differ/);
  });
});

/* ────────── Intent Builders ────────── */

describe('buildDeriveCommitIntent', () => {
  it('builds correct intent', () => {
    const intent = buildDeriveCommitIntent(
      {
        eventId: 'evt-1',
        mappingVersion: 1,
        derivationId: 'deriv-1',
        journalLines: [
          { accountId: 'acc-1', side: 'debit', amountMinor: 5000 },
          { accountId: 'acc-2', side: 'credit', amountMinor: 5000 },
        ],
      },
      'idem-1',
    );
    expect(intent.type).toBe('acct.derive.commit');
    expect(intent.idempotencyKey).toBe('idem-1');
  });
});

describe('buildPublishMappingIntent', () => {
  it('builds correct intent', () => {
    const intent = buildPublishMappingIntent(
      { mappingId: 'map-1', version: 2, ruleCount: 5 },
      'idem-2',
    );
    expect(intent.type).toBe('acct.mapping.publish');
    expect(intent.payload).toMatchObject({ version: 2, ruleCount: 5 });
  });
});

describe('buildReclassRunIntent', () => {
  it('builds correct intent', () => {
    const intent = buildReclassRunIntent(
      {
        periodKey: '2026-01',
        effectiveAt: '2026-01-31T23:59:59Z',
        reclassCount: 3,
        totalMinor: 15000,
      },
      'idem-3',
    );
    expect(intent.type).toBe('gl.reclass.run');
  });
});

describe('buildAllocationRunIntent', () => {
  it('builds correct intent', () => {
    const intent = buildAllocationRunIntent(
      {
        periodKey: '2026-01',
        effectiveAt: '2026-01-31T23:59:59Z',
        allocationMethod: 'proportional',
        poolCount: 4,
      },
      'idem-4',
    );
    expect(intent.type).toBe('gl.allocation.run');
    expect(intent.payload).toMatchObject({ allocationMethod: 'proportional' });
  });
});

describe('buildAccrualRunIntent', () => {
  it('builds correct intent', () => {
    const intent = buildAccrualRunIntent(
      {
        periodKey: '2026-01',
        effectiveAt: '2026-01-31T23:59:59Z',
        accrualCount: 10,
        totalMinor: 50000,
      },
      'idem-5',
    );
    expect(intent.type).toBe('gl.accrual.run');
  });
});
