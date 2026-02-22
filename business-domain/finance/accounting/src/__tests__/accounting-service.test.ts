import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { describe, expect, it, vi } from 'vitest';
import { postJournalEntry, reverseEntry, trialBalance } from '../services/accounting-service';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
}));

vi.mock('../queries/journal-query', () => ({
  getJournalEntry: vi.fn().mockResolvedValue([
    { journalId: 'je-001', lineNo: 1, accountId: 'acc-cash', side: 'debit', amountMinor: 10000, currency: 'MYR', memo: null },
    { journalId: 'je-001', lineNo: 2, accountId: 'acc-revenue', side: 'credit', amountMinor: 10000, currency: 'MYR', memo: null },
  ]),
  getTrialBalance: vi.fn().mockResolvedValue([
    { accountId: 'acc-cash', debitMinor: 50000, creditMinor: 0 },
    { accountId: 'acc-revenue', debitMinor: 0, creditMinor: 50000 },
  ]),
}));


const mockCtx = (roles: string[] = ['accountant']): DomainContext =>
  ({
    orgId: 'org-1' as DomainContext['orgId'],
    companyId: 'co-1' as DomainContext['companyId'],
    currency: 'MYR' as DomainContext['currency'],
    actor: { userId: 'user-1' as DomainContext['actor']['userId'], roles: roles as DomainContext['actor']['roles'] },
    asOf: '2026-01-01T00:00:00+08:00' as DomainContext['asOf'],
  }) as DomainContext;

const mockDb = {} as DbSession;

describe('postJournalEntry', () => {
  it('returns intent for a balanced entry', async () => {
    const result = await postJournalEntry(mockDb, mockCtx(), {
      journalId: 'je-001',
      lines: [
        { lineNo: 1, accountId: 'acc-cash', side: 'debit', amountMinor: 10000, currency: 'MYR' },
        { lineNo: 2, accountId: 'acc-revenue', side: 'credit', amountMinor: 10000, currency: 'MYR' },
      ],
    });

    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents).toHaveLength(1);
      expect(result.intents[0]?.type).toBe('accounting.post');
    }
  });

  it('throws NOT_AUTHORIZED when actor has no roles', async () => {
    await expect(
      postJournalEntry(mockDb, mockCtx([]), {
        journalId: 'je-002',
        lines: [
          { lineNo: 1, accountId: 'acc-cash', side: 'debit', amountMinor: 5000, currency: 'MYR' },
          { lineNo: 2, accountId: 'acc-revenue', side: 'credit', amountMinor: 5000, currency: 'MYR' },
        ],
      }),
    ).rejects.toMatchObject({ code: 'NOT_AUTHORIZED' });
  });

  it('throws VALIDATION_FAILED for imbalanced entry', async () => {
    await expect(
      postJournalEntry(mockDb, mockCtx(), {
        journalId: 'je-003',
        lines: [
          { lineNo: 1, accountId: 'acc-cash', side: 'debit', amountMinor: 10000, currency: 'MYR' },
          { lineNo: 2, accountId: 'acc-revenue', side: 'credit', amountMinor: 9000, currency: 'MYR' },
        ],
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
  });
});

describe('reverseEntry', () => {
  it('returns intent with flipped debit/credit sides', async () => {
    const result = await reverseEntry(mockDb, mockCtx(), {
      originalJournalId: 'je-001',
      newJournalId: 'je-rev-001',
    });

    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents).toHaveLength(1);
      expect(result.intents[0]?.type).toBe('accounting.post');
    }
  });

  it('includes memo when provided', async () => {
    const result = await reverseEntry(mockDb, mockCtx(), {
      originalJournalId: 'je-001',
      newJournalId: 'je-rev-002',
      memo: 'Correction',
    });

    expect(result.kind).toBe('intent');
  });

  it('throws NOT_AUTHORIZED when actor has no roles', async () => {
    await expect(
      reverseEntry(mockDb, mockCtx([]), {
        originalJournalId: 'je-001',
        newJournalId: 'je-rev-003',
      }),
    ).rejects.toMatchObject({ code: 'NOT_AUTHORIZED' });
  });
});

describe('trialBalance', () => {
  it('returns read result with trial balance rows', async () => {
    const result = await trialBalance(mockDb, mockCtx(), {
      asOf: '2026-01-31',
      companyId: 'co-1',
    });

    expect(result.kind).toBe('read');
    if (result.kind === 'read') {
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toMatchObject({ accountId: 'acc-cash', debitMinor: 50000 });
    }
  });
});
