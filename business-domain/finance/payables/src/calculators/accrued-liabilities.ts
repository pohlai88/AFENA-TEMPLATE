import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see AP-01 — Invoice matching: 2-way / 3-way (PO, GR, invoice)
 * @see AP-02 — Payment terms and due date calculation
 * @see AP-03 — Early payment discount (2/10 net 30)
 * @see AP-10 — Accrued Liabilities for Uninvoiced Goods Receipts
 *
 * Computes period-end accrual for goods received but not yet invoiced (GRNI).
 * Per IAS 37 / accrual basis — ensures completeness of liabilities at period-end.
 *
 * Pure function — no I/O.
 */

export type UninvoicedGr = {
  grId: string;
  poNumber: string;
  supplierId: string;
  receivedDateIso: string;
  expectedAmountMinor: number;
  currency: string;
};

export type AccrualResult = {
  accrualEntries: { grId: string; poNumber: string; supplierId: string; accrualMinor: number; currency: string }[];
  totalAccrualMinor: number;
  grCount: number;
};

export function computeAccruedLiabilities(
  uninvoicedGrs: UninvoicedGr[],
  periodEndIso: string,
): CalculatorResult<AccrualResult> {
  if (!periodEndIso) {
    throw new DomainError('VALIDATION_FAILED', 'periodEndIso is required');
  }

  const eligible = uninvoicedGrs.filter((gr) => gr.receivedDateIso <= periodEndIso);

  const accrualEntries = eligible.map((gr) => ({
    grId: gr.grId,
    poNumber: gr.poNumber,
    supplierId: gr.supplierId,
    accrualMinor: gr.expectedAmountMinor,
    currency: gr.currency,
  }));

  const totalAccrualMinor = accrualEntries.reduce((s, e) => s + e.accrualMinor, 0);

  return {
    result: { accrualEntries, totalAccrualMinor, grCount: accrualEntries.length },
    inputs: { uninvoicedGrCount: uninvoicedGrs.length, periodEndIso },
    explanation: `GRNI accrual: ${accrualEntries.length} items, total ${totalAccrualMinor}`,
  };
}
