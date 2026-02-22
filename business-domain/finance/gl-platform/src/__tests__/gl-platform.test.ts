import type { DomainContext } from 'afenda-canon';
import { describe, expect, it, vi } from 'vitest';

import type { AccountNode } from '../calculators/coa-hierarchy';
import { getAncestors, getSubtree, validateCoaIntegrity } from '../calculators/coa-hierarchy';
import { validatePeriodOverlap } from '../calculators/period-overlap';
import { computeTrialBalance } from '../calculators/trial-balance';
import {
  buildClosePeriodIntent,
  buildOpenPeriodIntent,
  buildPublishCoaIntent,
} from '../commands/gl-intent';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
}));

const mockCtx = (roles: string[] = ['gl-admin']): DomainContext =>
  ({
    orgId: 'org-1' as DomainContext['orgId'],
    companyId: 'co-1' as DomainContext['companyId'],
    currency: 'MYR' as DomainContext['currency'],
    actor: {
      userId: 'user-1' as DomainContext['actor']['userId'],
      roles: roles as DomainContext['actor']['roles'],
    },
    asOf: '2026-01-01T00:00:00+08:00' as DomainContext['asOf'],
  }) as DomainContext;

/* ────────── Period Overlap Calculator ────────── */

describe('validatePeriodOverlap', () => {
  it('passes when no overlap exists', () => {
    const result = validatePeriodOverlap(
      { periodKey: '2026-03', startDate: '2026-03-01', endDate: '2026-03-31' },
      [
        { periodKey: '2026-01', startDate: '2026-01-01', endDate: '2026-01-31' },
        { periodKey: '2026-02', startDate: '2026-02-01', endDate: '2026-02-28' },
      ],
    );
    expect(result.result).toBe(true);
  });

  it('throws when overlap detected', () => {
    expect(() =>
      validatePeriodOverlap(
        { periodKey: '2026-01', startDate: '2026-01-15', endDate: '2026-02-15' },
        [{ periodKey: '2026-01', startDate: '2026-01-01', endDate: '2026-01-31' }],
      ),
    ).toThrow(/overlaps/);
  });

  it('handles empty existing periods', () => {
    const result = validatePeriodOverlap(
      { periodKey: '2026-01', startDate: '2026-01-01', endDate: '2026-01-31' },
      [],
    );
    expect(result.result).toBe(true);
    expect(result.explanation).toContain('0 existing');
  });
});

/* ────────── Trial Balance Calculator ────────── */

describe('computeTrialBalance', () => {
  it('aggregates debits and credits correctly', () => {
    const { result } = computeTrialBalance(
      [
        { accountId: 'acc-1', side: 'debit', amountMinor: 5000 },
        { accountId: 'acc-1', side: 'credit', amountMinor: 2000 },
        { accountId: 'acc-2', side: 'credit', amountMinor: 3000 },
      ],
      '2026-01-31',
    );

    expect(result).toHaveLength(2);
    const acc1 = result.find((r) => r.accountId === 'acc-1');
    expect(acc1).toEqual({
      accountId: 'acc-1',
      debitMinor: 5000,
      creditMinor: 2000,
      netMinor: 3000,
    });
    const acc2 = result.find((r) => r.accountId === 'acc-2');
    expect(acc2).toEqual({ accountId: 'acc-2', debitMinor: 0, creditMinor: 3000, netMinor: -3000 });
  });

  it('returns empty array for empty lines', () => {
    const { result } = computeTrialBalance([], '2026-01-31');
    expect(result).toEqual([]);
  });

  it('includes explanation with totals', () => {
    const { explanation } = computeTrialBalance(
      [
        { accountId: 'acc-1', side: 'debit', amountMinor: 100 },
        { accountId: 'acc-1', side: 'credit', amountMinor: 100 },
      ],
      '2026-06-30',
    );
    expect(explanation).toContain('DR 100');
    expect(explanation).toContain('CR 100');
    expect(explanation).toContain('2026-06-30');
  });
});

/* ────────── CoA Hierarchy Calculator ────────── */

const sampleAccounts: AccountNode[] = [
  {
    id: 'a1',
    accountCode: '1000',
    accountName: 'Assets',
    accountType: 'asset',
    parentAccountId: null,
    isPostable: false,
    normalBalance: 'debit',
  },
  {
    id: 'a2',
    accountCode: '1100',
    accountName: 'Cash',
    accountType: 'asset',
    parentAccountId: 'a1',
    isPostable: true,
    normalBalance: 'debit',
  },
  {
    id: 'a3',
    accountCode: '1200',
    accountName: 'Receivables',
    accountType: 'asset',
    parentAccountId: 'a1',
    isPostable: true,
    normalBalance: 'debit',
  },
  {
    id: 'b1',
    accountCode: '2000',
    accountName: 'Liabilities',
    accountType: 'liability',
    parentAccountId: null,
    isPostable: false,
    normalBalance: 'credit',
  },
  {
    id: 'b2',
    accountCode: '2100',
    accountName: 'Payables',
    accountType: 'liability',
    parentAccountId: 'b1',
    isPostable: true,
    normalBalance: 'credit',
  },
];

describe('getSubtree', () => {
  it('returns all descendants from root', () => {
    const { result } = getSubtree(null, sampleAccounts);
    expect(result).toHaveLength(5);
  });

  it('returns subtree of a specific node', () => {
    const { result } = getSubtree('a1', sampleAccounts);
    expect(result).toHaveLength(2);
    expect(result.map((n) => n.id)).toContain('a2');
    expect(result.map((n) => n.id)).toContain('a3');
  });

  it('returns empty for leaf node', () => {
    const { result } = getSubtree('a2', sampleAccounts);
    expect(result).toHaveLength(0);
  });
});

describe('getAncestors', () => {
  it('returns chain from leaf to root', () => {
    const chain = getAncestors('a2', sampleAccounts);
    expect(chain).toHaveLength(2);
    expect(chain[0]!.id).toBe('a2');
    expect(chain[1]!.id).toBe('a1');
  });

  it('returns single element for root', () => {
    const chain = getAncestors('a1', sampleAccounts);
    expect(chain).toHaveLength(1);
    expect(chain[0]!.id).toBe('a1');
  });
});

describe('validateCoaIntegrity', () => {
  it('passes for valid hierarchy', () => {
    const result = validateCoaIntegrity(sampleAccounts);
    expect(result.valid).toBe(true);
  });

  it('throws for missing parent', () => {
    const bad: AccountNode[] = [
      {
        id: 'x1',
        accountCode: '9000',
        accountName: 'Bad',
        accountType: 'asset',
        parentAccountId: 'missing',
        isPostable: true,
        normalBalance: 'debit',
      },
    ];
    expect(() => validateCoaIntegrity(bad)).toThrow(/non-existent parent/);
  });
});

/* ────────── GL Intent Builders ────────── */

describe('buildOpenPeriodIntent', () => {
  it('builds correct intent', () => {
    const intent = buildOpenPeriodIntent(
      { ledgerId: 'ledger-1', periodKey: '2026-01', companyId: 'co-1' },
      'idem-key-1',
    );
    expect(intent.type).toBe('gl.period.open');
    expect(intent.payload).toEqual({
      ledgerId: 'ledger-1',
      periodKey: '2026-01',
      companyId: 'co-1',
    });
    expect(intent.idempotencyKey).toBe('idem-key-1');
  });
});

describe('buildClosePeriodIntent', () => {
  it('builds correct intent for soft close', () => {
    const intent = buildClosePeriodIntent(
      { ledgerId: 'ledger-1', periodKey: '2026-01', companyId: 'co-1', closeType: 'soft' },
      'idem-key-2',
    );
    expect(intent.type).toBe('gl.period.close');
    expect(intent.payload).toMatchObject({ closeType: 'soft' });
  });

  it('builds correct intent for hard close', () => {
    const intent = buildClosePeriodIntent(
      { ledgerId: 'ledger-1', periodKey: '2026-01', companyId: 'co-1', closeType: 'hard' },
      'idem-key-3',
    );
    expect(intent.payload).toMatchObject({ closeType: 'hard' });
  });
});

describe('buildPublishCoaIntent', () => {
  it('builds correct intent', () => {
    const intent = buildPublishCoaIntent(
      { ledgerId: 'ledger-1', version: 3, accountCount: 150 },
      'idem-key-4',
    );
    expect(intent.type).toBe('gl.coa.publish');
    expect(intent.payload).toEqual({ ledgerId: 'ledger-1', version: 3, accountCount: 150 });
  });
});
