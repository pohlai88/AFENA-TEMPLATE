import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type PaymentScheduleEntry = {
  vendorId: string;
  invoiceId: string;
  amountMinor: number;
  dueDateIso: string;
  priority: 'high' | 'medium' | 'low';
};

export type PaymentBatch = {
  entries: PaymentScheduleEntry[];
  totalMinor: number;
  count: number;
};

export function buildPaymentBatch(
  invoices: PaymentScheduleEntry[],
  budgetMinor: number,
): CalculatorResult<PaymentBatch> {
  if (!Number.isInteger(budgetMinor) || budgetMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'budgetMinor must be non-negative integer', {
      value: budgetMinor,
    });
  }

  const sorted = [...invoices].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    return a.dueDateIso.localeCompare(b.dueDateIso);
  });

  const selected: PaymentScheduleEntry[] = [];
  let remaining = budgetMinor;

  for (const inv of sorted) {
    if (inv.amountMinor <= remaining) {
      selected.push(inv);
      remaining -= inv.amountMinor;
    }
  }

  return {
    result: {
      entries: selected,
      totalMinor: budgetMinor - remaining,
      count: selected.length,
    },
    inputs: { invoices, budgetMinor },
    explanation: `Payment batch: ${selected.length} of ${invoices.length} invoices selected within budget ${budgetMinor}`,
  };
}
