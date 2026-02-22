import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import { describeIntegration, mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { postJournalEntry, trialBalance } from '../services/accounting-service';

describeIntegration('Accounting — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('postJournalEntry validates balance and returns intent', async () => {
    const result = await postJournalEntry(db, ctx, {
      journalId: 'JE-INT-001',
      lines: [
        { lineNo: 1, accountId: 'ACC-100', side: 'debit', amountMinor: 10000, currency: 'USD' },
        { lineNo: 2, accountId: 'ACC-200', side: 'credit', amountMinor: 10000, currency: 'USD' },
      ],
    });
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents).toHaveLength(1);
    }
  });

  it('postJournalEntry rejects unbalanced journal', async () => {
    await expect(
      postJournalEntry(db, ctx, {
        journalId: 'JE-INT-002',
        lines: [
          { lineNo: 1, accountId: 'ACC-100', side: 'debit', amountMinor: 10000, currency: 'USD' },
          { lineNo: 2, accountId: 'ACC-200', side: 'credit', amountMinor: 5000, currency: 'USD' },
        ],
      }),
    ).rejects.toThrow();
  });

  it('postJournalEntry rejects actor with no roles', async () => {
    const noRoleCtx = testCtx({ actor: { userId: 'test', roles: [] } });
    await expect(
      postJournalEntry(db, noRoleCtx, {
        journalId: 'JE-INT-003',
        lines: [
          { lineNo: 1, accountId: 'ACC-100', side: 'debit', amountMinor: 1000, currency: 'USD' },
          { lineNo: 2, accountId: 'ACC-200', side: 'credit', amountMinor: 1000, currency: 'USD' },
        ],
      }),
    ).rejects.toThrow('no roles');
  });

  it('trialBalance returns rows for test company', async () => {
    const result = await trialBalance(db, ctx, { asOf: '2026-01-31', companyId: 'test-company' });
    expect(result.kind).toBe('read');
    if (result.kind === 'read') {
      expect(Array.isArray(result.data)).toBe(true);
    }
  });
});
