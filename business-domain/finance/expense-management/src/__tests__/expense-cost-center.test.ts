import { describe, expect, it } from 'vitest';
import { validateExpenseCostCenterCoding } from '../calculators/expense-cost-center';

describe('validateExpenseCostCenterCoding', () => {
  it('allocates lines with cost centers', () => {
    const lines = [
      { expenseLineId: 'L1', description: 'Travel', amountMinor: 5000, costCenterId: 'CC-100', projectId: null },
      { expenseLineId: 'L2', description: 'Meals', amountMinor: 2000, costCenterId: 'CC-200', projectId: 'P1' },
    ];
    const r = validateExpenseCostCenterCoding(lines);
    expect(r.result.allocatedLines).toHaveLength(2);
    expect(r.result.allocationRate).toBe(100);
  });

  it('uses default cost center for unassigned lines', () => {
    const lines = [{ expenseLineId: 'L1', description: 'Misc', amountMinor: 1000, costCenterId: null, projectId: null }];
    const r = validateExpenseCostCenterCoding(lines, 'CC-DEFAULT');
    expect(r.result.allocatedLines).toHaveLength(1);
    expect(r.result.allocatedLines[0]!.costCenterId).toBe('CC-DEFAULT');
  });

  it('reports unallocated when no default', () => {
    const lines = [{ expenseLineId: 'L1', description: 'Misc', amountMinor: 1000, costCenterId: null, projectId: null }];
    const r = validateExpenseCostCenterCoding(lines);
    expect(r.result.unallocatedLines).toHaveLength(1);
    expect(r.result.allocationRate).toBe(0);
  });

  it('throws on empty lines', () => {
    expect(() => validateExpenseCostCenterCoding([])).toThrow('at least one');
  });
});
