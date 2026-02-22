import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see AR-01 — Customer invoice with line-level tax, discount, and net amou
 * @see AR-02 — Payment allocation: FIFO, specific invoice, or oldest-first
 * @see AR-03 — Customer aging report (0–30, 31–60, 61–90, 90+ days)
 */
export type AgingBucket = {
  label: string;
  minDays: number;
  maxDays: number | null;
  totalMinor: number;
  count: number;
};

export type AgingReport = {
  buckets: AgingBucket[];
  totalOutstandingMinor: number;
  totalOverdueMinor: number;
};

export function computeAging(
  invoices: Array<{ outstandingMinor: number; dueDateIso: string }>,
  asOfIso: string,
): CalculatorResult<AgingReport> {
  if (invoices.length === 0) {
    return {
      result: {
        buckets: buildEmptyBuckets(),
        totalOutstandingMinor: 0,
        totalOverdueMinor: 0,
      },
      inputs: { invoices, asOfIso },
      explanation: 'No invoices to age',
    };
  }

  const asOf = parseDateOnly(asOfIso);
  const buckets = buildEmptyBuckets();
  let totalOutstanding = 0;
  let totalOverdue = 0;

  for (const inv of invoices) {
    if (!Number.isInteger(inv.outstandingMinor)) {
      throw new DomainError('VALIDATION_FAILED', 'outstandingMinor must be integer minor units', {
        value: inv.outstandingMinor,
      });
    }

    const due = parseDateOnly(inv.dueDateIso);
    const daysOverdue = Math.floor((asOf - due) / 86_400_000);

    totalOutstanding += inv.outstandingMinor;
    if (daysOverdue > 0) {
      totalOverdue += inv.outstandingMinor;
    }

    const bucket = buckets.find(
      (b) => daysOverdue >= b.minDays && (b.maxDays === null || daysOverdue <= b.maxDays),
    );
    if (bucket) {
      bucket.totalMinor += inv.outstandingMinor;
      bucket.count += 1;
    }
  }

  return {
    result: { buckets, totalOutstandingMinor: totalOutstanding, totalOverdueMinor: totalOverdue },
    inputs: { invoices, asOfIso },
    explanation: `Aged ${invoices.length} invoices as of ${asOfIso}: outstanding=${totalOutstanding}, overdue=${totalOverdue}`,
  };
}

function buildEmptyBuckets(): AgingBucket[] {
  return [
    { label: 'Current', minDays: -999999, maxDays: 0, totalMinor: 0, count: 0 },
    { label: '1-30', minDays: 1, maxDays: 30, totalMinor: 0, count: 0 },
    { label: '31-60', minDays: 31, maxDays: 60, totalMinor: 0, count: 0 },
    { label: '61-90', minDays: 61, maxDays: 90, totalMinor: 0, count: 0 },
    { label: '90+', minDays: 91, maxDays: null, totalMinor: 0, count: 0 },
  ];
}

function parseDateOnly(iso: string): number {
  return Date.parse(iso.slice(0, 10) + 'T00:00:00Z');
}
