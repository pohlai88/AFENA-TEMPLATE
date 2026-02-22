import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * CM-09 — Customer Payment History Analysis (Behavioral Scoring)
 * Pure function — no I/O.
 */

export type PaymentRecord = { invoiceId: string; dueDateIso: string; paidDateIso: string; amountMinor: number };

export type PaymentHistoryResult = {
  customerId: string; totalInvoices: number; onTimeCount: number; lateCount: number;
  avgDaysLate: number; onTimeRatioPct: number; behaviorScore: 'excellent' | 'good' | 'fair' | 'poor';
};

export function analyzePaymentHistory(customerId: string, records: PaymentRecord[]): CalculatorResult<PaymentHistoryResult> {
  if (records.length === 0) throw new DomainError('VALIDATION_FAILED', 'No payment records');
  let totalDaysLate = 0; let lateCount = 0;
  for (const r of records) {
    const daysLate = Math.max(0, Math.floor((new Date(r.paidDateIso).getTime() - new Date(r.dueDateIso).getTime()) / 86400000));
    if (daysLate > 0) { lateCount++; totalDaysLate += daysLate; }
  }
  const onTimeCount = records.length - lateCount;
  const onTimeRatioPct = Math.round((onTimeCount / records.length) * 100);
  const avgDaysLate = lateCount > 0 ? Math.round(totalDaysLate / lateCount) : 0;
  const behaviorScore: PaymentHistoryResult['behaviorScore'] = onTimeRatioPct >= 95 ? 'excellent' : onTimeRatioPct >= 80 ? 'good' : onTimeRatioPct >= 60 ? 'fair' : 'poor';
  return { result: { customerId, totalInvoices: records.length, onTimeCount, lateCount, avgDaysLate, onTimeRatioPct, behaviorScore }, inputs: { customerId, recordCount: records.length }, explanation: `Payment history: ${onTimeRatioPct}% on-time, score=${behaviorScore}` };
}
