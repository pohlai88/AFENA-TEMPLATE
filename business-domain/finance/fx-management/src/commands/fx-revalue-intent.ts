import type { DomainIntent, JournalPostPayload } from 'afenda-canon';

/**
 * @see FX-02 — Period-end revaluation of monetary items
 */
export type FxRevalueInput = {
  accountId: string;
  originalMinor: number;
  revaluedMinor: number;
  currency: string;
  gainLossAccountId: string;
  journalId: string;
  effectiveAt: string;
  memo?: string;
};

export function buildFxRevalueIntent(input: FxRevalueInput, idempotencyKey: string): DomainIntent {
  const diff = input.revaluedMinor - input.originalMinor;
  const isGain = diff >= 0;
  const absDiff = Math.abs(diff);

  const lines: JournalPostPayload['lines'] = [
    {
      lineNo: 1,
      accountId: input.accountId,
      side: isGain ? 'debit' : 'credit',
      amountMinor: absDiff,
      currency: input.currency,
      ...(input.memo !== undefined ? { memo: input.memo } : {}),
    },
    {
      lineNo: 2,
      accountId: input.gainLossAccountId,
      side: isGain ? 'credit' : 'debit',
      amountMinor: absDiff,
      currency: input.currency,
      ...(input.memo !== undefined ? { memo: input.memo } : {}),
    },
  ];

  return {
    type: 'accounting.post',
    payload: { journalId: input.journalId, effectiveAt: input.effectiveAt, lines },
    idempotencyKey,
  };
}
