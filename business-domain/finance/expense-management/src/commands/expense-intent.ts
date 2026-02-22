import type { DomainIntent, ExpenseReimbursePayload } from 'afenda-canon';

export function buildExpenseReimburseIntent(
  payload: ExpenseReimbursePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'expense.reimburse', payload, idempotencyKey };
}
