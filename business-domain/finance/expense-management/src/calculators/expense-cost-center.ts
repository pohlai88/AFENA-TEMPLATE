import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see EM-02 — Multi-level approval routing (amount-based)
 * @see EM-05 — Policy enforcement: category limits, blacklisted vendors
 * @see EM-08 — Project / cost center coding on expense lines
 */
export type ExpenseLineAllocation = {
  expenseLineId: string;
  description: string;
  amountMinor: number;
  costCenterId: string | null;
  projectId: string | null;
};

export type CostCenterAllocationResult = {
  allocatedLines: Array<{ expenseLineId: string; costCenterId: string; projectId: string | null; amountMinor: number }>;
  unallocatedLines: Array<{ expenseLineId: string; amountMinor: number; reason: string }>;
  totalAllocatedMinor: number;
  totalUnallocatedMinor: number;
  allocationRate: number;
};

export function validateExpenseCostCenterCoding(
  lines: ExpenseLineAllocation[],
  defaultCostCenterId: string | null = null,
): CalculatorResult<CostCenterAllocationResult> {
  if (lines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Must provide at least one expense line');
  }

  const allocated: CostCenterAllocationResult['allocatedLines'] = [];
  const unallocated: CostCenterAllocationResult['unallocatedLines'] = [];

  for (const line of lines) {
    const cc = line.costCenterId ?? defaultCostCenterId;
    if (cc) {
      allocated.push({ expenseLineId: line.expenseLineId, costCenterId: cc, projectId: line.projectId, amountMinor: line.amountMinor });
    } else {
      unallocated.push({ expenseLineId: line.expenseLineId, amountMinor: line.amountMinor, reason: 'No cost center assigned and no default available' });
    }
  }

  const totalAllocated = allocated.reduce((s, a) => s + a.amountMinor, 0);
  const totalUnallocated = unallocated.reduce((s, u) => s + u.amountMinor, 0);
  const rate = Math.round((allocated.length * 100) / lines.length);

  return {
    result: { allocatedLines: allocated, unallocatedLines: unallocated, totalAllocatedMinor: totalAllocated, totalUnallocatedMinor: totalUnallocated, allocationRate: rate },
    inputs: { lineCount: lines.length, hasDefault: !!defaultCostCenterId },
    explanation: `Expense cost center coding: ${allocated.length}/${lines.length} lines allocated (${rate}%). Unallocated: ${totalUnallocated}.`,
  };
}
