import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * BR-06 — Outstanding Checks / Deposits-in-Transit Tracking
 * Pure function — no I/O.
 */

export type OutstandingItem = { itemId: string; type: 'check' | 'deposit'; amountMinor: number; dateIso: string; daysOutstanding: number };

export type OutstandingItemsResult = {
  checks: OutstandingItem[]; deposits: OutstandingItem[];
  totalChecksMinor: number; totalDepositsMinor: number; netAdjustmentMinor: number;
  staleItems: OutstandingItem[];
};

const STALE_DAYS = 180;

export function analyzeOutstandingItems(items: OutstandingItem[]): CalculatorResult<OutstandingItemsResult> {
  if (items.length === 0) throw new DomainError('VALIDATION_FAILED', 'No items');
  const checks = items.filter((i) => i.type === 'check');
  const deposits = items.filter((i) => i.type === 'deposit');
  const totalChecksMinor = checks.reduce((s, c) => s + c.amountMinor, 0);
  const totalDepositsMinor = deposits.reduce((s, d) => s + d.amountMinor, 0);
  const staleItems = items.filter((i) => i.daysOutstanding > STALE_DAYS);
  return { result: { checks, deposits, totalChecksMinor, totalDepositsMinor, netAdjustmentMinor: totalDepositsMinor - totalChecksMinor, staleItems }, inputs: { count: items.length }, explanation: `Outstanding: ${checks.length} checks (${totalChecksMinor}), ${deposits.length} deposits (${totalDepositsMinor}), ${staleItems.length} stale` };
}
