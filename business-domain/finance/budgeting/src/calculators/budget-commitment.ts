import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see BU-01 — Budget versions: original / revised / latest estimate
 * @see BU-02 — Bottom-up budget entry by cost center / department
 * @see BU-04 — Rolling forecast vs static annual budget
 * BU-06 — Budget Commitment / Encumbrance on PO Creation
 *
 * Tracks budget consumption: committed (PO) + actual (invoice) vs budget.
 * Flags over-commitment.
 * Pure function — no I/O.
 */

export type BudgetLine = { accountId: string; periodKey: string; budgetMinor: number; committedMinor: number; actualMinor: number };

export type CommitmentCheck = {
  accountId: string;
  periodKey: string;
  budgetMinor: number;
  committedMinor: number;
  actualMinor: number;
  consumedMinor: number;
  availableMinor: number;
  consumptionPct: number;
  isOverCommitted: boolean;
};

export type CommitmentResult = { checks: CommitmentCheck[]; overCommittedCount: number; totalAvailableMinor: number };

export type BudgetAvailabilityInput = {
  accountId: string;
  periodKey: string;
  requestedAmountMinor: number;
  budgetLine: BudgetLine;
  dimension?: string;
};

export type BudgetAvailabilityResult = {
  approved: boolean;
  accountId: string;
  periodKey: string;
  requestedAmountMinor: number;
  availableMinor: number;
  shortfallMinor: number;
  reason: string;
  dimension?: string;
};

export function checkBudgetAvailability(
  input: BudgetAvailabilityInput,
): CalculatorResult<BudgetAvailabilityResult> {
  const { accountId, periodKey, requestedAmountMinor, budgetLine, dimension } = input;
  if (requestedAmountMinor <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Requested amount must be positive');
  }

  const consumedMinor = budgetLine.committedMinor + budgetLine.actualMinor;
  const availableMinor = budgetLine.budgetMinor - consumedMinor;
  const approved = availableMinor >= requestedAmountMinor;
  const shortfallMinor = approved ? 0 : requestedAmountMinor - availableMinor;

  const reason = approved
    ? `Budget available: ${availableMinor} >= ${requestedAmountMinor}`
    : `Budget exceeded: available ${availableMinor} < requested ${requestedAmountMinor} (shortfall: ${shortfallMinor})`;

  return {
    result: { approved, accountId, periodKey, requestedAmountMinor, availableMinor, shortfallMinor, reason, ...(dimension ? { dimension } : {}) },
    inputs: { accountId, periodKey, requestedAmountMinor },
    explanation: reason,
  };
}

export function checkBudgetCommitments(lines: BudgetLine[]): CalculatorResult<CommitmentResult> {
  if (lines.length === 0) throw new DomainError('VALIDATION_FAILED', 'No budget lines provided');

  const checks: CommitmentCheck[] = lines.map((l) => {
    const consumedMinor = l.committedMinor + l.actualMinor;
    const availableMinor = l.budgetMinor - consumedMinor;
    const consumptionPct = l.budgetMinor > 0 ? Math.round((consumedMinor / l.budgetMinor) * 100) : 0;
    return { ...l, consumedMinor, availableMinor, consumptionPct, isOverCommitted: availableMinor < 0 };
  });

  return {
    result: { checks, overCommittedCount: checks.filter((c) => c.isOverCommitted).length, totalAvailableMinor: checks.reduce((s, c) => s + c.availableMinor, 0) },
    inputs: { count: lines.length },
    explanation: `Budget commitment: ${checks.filter((c) => c.isOverCommitted).length} over-committed of ${checks.length}`,
  };
}
