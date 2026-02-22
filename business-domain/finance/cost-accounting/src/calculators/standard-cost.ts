import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type CostComponent = { type: 'material' | 'labor' | 'overhead'; amountMinor: number };

export function computeStandardCost(components: CostComponent[]): CalculatorResult<number> {
  let total = 0;
  for (const c of components) {
    if (!Number.isInteger(c.amountMinor) || c.amountMinor < 0) {
      throw new DomainError(
        'VALIDATION_FAILED',
        `amountMinor must be a non-negative integer, got ${c.amountMinor}`,
      );
    }
    total += c.amountMinor;
  }
  return {
    result: total,
    inputs: { components },
    explanation: `Standard cost: ${total} minor units from ${components.length} components`,
  };
}
