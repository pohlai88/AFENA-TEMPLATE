import type { DomainContext, DomainResult, JournalPostPayload } from 'afenda-canon';
import { DomainError, stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { validateJournalBalance } from '../calculators/journal-balance';
import { buildPostJournalIntent } from '../commands/journal-intent';
import type { JournalLineReadModel, TrialBalanceRow } from '../queries/journal-query';
import { getJournalEntry, getTrialBalance } from '../queries/journal-query';

export async function postJournalEntry(
  _db: DbSession,
  ctx: DomainContext,
  input: JournalPostPayload,
): Promise<DomainResult> {
  if (ctx.actor.roles.length === 0) {
    throw new DomainError('NOT_AUTHORIZED', 'Actor has no roles');
  }

  validateJournalBalance(input.lines.map((l) => ({ side: l.side, amountMinor: l.amountMinor })));

  return {
    kind: 'intent',
    intents: [buildPostJournalIntent(input, stableCanonicalJson({ journalId: input.journalId }))],
  };
}

export async function reverseEntry(
  db: DbSession,
  ctx: DomainContext,
  input: { originalJournalId: string; newJournalId: string; memo?: string; effectiveAt: string },
): Promise<DomainResult> {
  if (ctx.actor.roles.length === 0) {
    throw new DomainError('NOT_AUTHORIZED', 'Actor has no roles');
  }

  const originalLines = await getJournalEntry(db, ctx, input.originalJournalId);

  const reversalLines = originalLines.map((l) => ({
    lineNo: l.lineNo,
    accountId: l.accountId,
    side: (l.side === 'debit' ? 'credit' : 'debit') as 'debit' | 'credit',
    amountMinor: l.amountMinor,
    currency: l.currency,
    ...(input.memo !== undefined ? { memo: input.memo } : {}),
  }));

  const reversalPayload: JournalPostPayload = {
    journalId: input.newJournalId,
    effectiveAt: input.effectiveAt,
    lines: reversalLines,
  };

  validateJournalBalance(reversalLines);

  return {
    kind: 'intent',
    intents: [
      buildPostJournalIntent(
        reversalPayload,
        stableCanonicalJson({
          originalJournalId: input.originalJournalId,
          newJournalId: input.newJournalId,
        }),
      ),
    ],
  };
}

export async function trialBalance(
  db: DbSession,
  ctx: DomainContext,
  input: { asOf: string; companyId: string },
): Promise<DomainResult<TrialBalanceRow[]>> {
  const rows = await getTrialBalance(db, ctx, input);
  return { kind: 'read', data: rows };
}

export type { JournalLineReadModel, TrialBalanceRow };
