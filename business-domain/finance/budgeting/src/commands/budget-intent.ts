import type { BudgetCommitPayload, DomainIntent } from 'afenda-canon';

export function buildBudgetCommitIntent(
  payload: BudgetCommitPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'budget.commit', payload, idempotencyKey };
}
