import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * SB-06 — Usage-Based Billing Metering (API Calls, Seats, GB)
 * Pure function — no I/O.
 */

export type UsageRecord = { metricType: 'api_calls' | 'seats' | 'storage_gb' | 'bandwidth_gb'; quantity: number; unitPriceMinor: number };
export type UsageBillingResult = { lineItems: { metricType: string; quantity: number; unitPriceMinor: number; totalMinor: number }[]; grandTotalMinor: number };

export function computeUsageBilling(subscriptionId: string, records: UsageRecord[]): CalculatorResult<UsageBillingResult> {
  if (records.length === 0) throw new DomainError('VALIDATION_FAILED', 'No usage records');
  const lineItems = records.map((r) => ({ metricType: r.metricType, quantity: r.quantity, unitPriceMinor: r.unitPriceMinor, totalMinor: Math.round(r.quantity * r.unitPriceMinor) }));
  return { result: { lineItems, grandTotalMinor: lineItems.reduce((s, l) => s + l.totalMinor, 0) }, inputs: { subscriptionId, recordCount: records.length }, explanation: `Usage billing: ${lineItems.length} metrics, total=${lineItems.reduce((s, l) => s + l.totalMinor, 0)}` };
}
