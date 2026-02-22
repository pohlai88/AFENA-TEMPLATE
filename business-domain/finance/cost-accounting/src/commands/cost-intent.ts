import type { CostAllocatePayload, DomainIntent } from 'afenda-canon';

export function buildCostAllocationIntent(
  payload: CostAllocatePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'cost.allocate', payload, idempotencyKey };
}
