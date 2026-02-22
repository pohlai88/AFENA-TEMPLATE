import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * CA-05 — Job Costing vs Process Costing
 *
 * Job costing: accumulates costs per discrete job/order.
 * Process costing: computes cost per equivalent unit using weighted-average
 * or FIFO method across continuous production.
 * Pure function — no I/O.
 */

// ── Job Costing ──

export type JobCostEntry = {
  category: 'material' | 'labor' | 'overhead';
  amountMinor: number;
};

export type JobCostResult = {
  jobId: string;
  materialMinor: number;
  laborMinor: number;
  overheadMinor: number;
  totalCostMinor: number;
};

export function computeJobCost(
  jobId: string,
  entries: JobCostEntry[],
): CalculatorResult<JobCostResult> {
  if (!jobId) throw new DomainError('VALIDATION_FAILED', 'jobId is required');
  if (entries.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one cost entry required');

  let material = 0;
  let labor = 0;
  let overhead = 0;

  for (const e of entries) {
    if (e.amountMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Cost amounts must be non-negative');
    if (e.category === 'material') material += e.amountMinor;
    else if (e.category === 'labor') labor += e.amountMinor;
    else overhead += e.amountMinor;
  }

  const total = material + labor + overhead;

  return {
    result: { jobId, materialMinor: material, laborMinor: labor, overheadMinor: overhead, totalCostMinor: total },
    inputs: { jobId, entryCount: entries.length },
    explanation: `Job ${jobId}: material=${material}, labor=${labor}, overhead=${overhead}, total=${total}`,
  };
}

// ── Process Costing ──

export type ProcessCostInput = {
  beginningWipUnits: number;
  beginningWipCompletionPct: number;
  unitsStarted: number;
  unitsCompleted: number;
  endingWipCompletionPct: number;
  totalCostMinor: number;
  beginningWipCostMinor: number;
  method: 'weighted-average' | 'fifo';
};

export type ProcessCostResult = {
  equivalentUnits: number;
  costPerEquivalentUnit: number;
  completedCostMinor: number;
  endingWipCostMinor: number;
  endingWipUnits: number;
};

export function computeProcessCost(
  input: ProcessCostInput,
): CalculatorResult<ProcessCostResult> {
  const { beginningWipUnits, beginningWipCompletionPct, unitsStarted, unitsCompleted, endingWipCompletionPct, totalCostMinor, beginningWipCostMinor, method } = input;

  if (endingWipCompletionPct < 0 || endingWipCompletionPct > 100) {
    throw new DomainError('VALIDATION_FAILED', 'endingWipCompletionPct must be 0–100');
  }
  if (beginningWipCompletionPct < 0 || beginningWipCompletionPct > 100) {
    throw new DomainError('VALIDATION_FAILED', 'beginningWipCompletionPct must be 0–100');
  }

  const endingWipUnits = beginningWipUnits + unitsStarted - unitsCompleted;
  if (endingWipUnits < 0) throw new DomainError('VALIDATION_FAILED', 'Ending WIP units cannot be negative');

  let equivalentUnits: number;
  let totalCostPool: number;

  if (method === 'weighted-average') {
    equivalentUnits = unitsCompleted + endingWipUnits * (endingWipCompletionPct / 100);
    totalCostPool = beginningWipCostMinor + totalCostMinor;
  } else {
    // FIFO: exclude beginning WIP already-completed equivalent units
    const beginningEquivDone = beginningWipUnits * (beginningWipCompletionPct / 100);
    equivalentUnits = (unitsCompleted - beginningWipUnits) + beginningWipUnits * ((100 - beginningWipCompletionPct) / 100) + endingWipUnits * (endingWipCompletionPct / 100);
    totalCostPool = totalCostMinor; // FIFO uses only current-period costs
    if (equivalentUnits <= 0) equivalentUnits = beginningEquivDone || 1;
  }

  if (equivalentUnits <= 0) throw new DomainError('VALIDATION_FAILED', 'Equivalent units must be positive');

  const costPerUnit = totalCostPool / equivalentUnits;
  const completedCost = Math.round(costPerUnit * unitsCompleted);
  const endingWipCost = Math.round(costPerUnit * endingWipUnits * (endingWipCompletionPct / 100));

  return {
    result: {
      equivalentUnits: Math.round(equivalentUnits * 100) / 100,
      costPerEquivalentUnit: Math.round(costPerUnit * 100) / 100,
      completedCostMinor: completedCost,
      endingWipCostMinor: endingWipCost,
      endingWipUnits,
    },
    inputs: { method, unitsCompleted, endingWipUnits },
    explanation: `Process costing (${method}): ${equivalentUnits.toFixed(1)} equiv units, cost/unit=${costPerUnit.toFixed(2)}, completed=${completedCost}, endingWIP=${endingWipCost}`,
  };
}
