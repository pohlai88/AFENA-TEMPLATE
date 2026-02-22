import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see BR-01 — Bank statement import: OFX, MT940, camt.053, CSV
 * BR-10 — Intraday Balance Monitoring
 * Pure function — no I/O.
 */

export type IntradayEntry = { accountId: string; timestampIso: string; balanceMinor: number };
export type BalanceAlert = { accountId: string; timestampIso: string; balanceMinor: number; alertType: 'below_minimum' | 'above_maximum' };

export type IntradayResult = {
  currentBalances: { accountId: string; balanceMinor: number }[];
  alerts: BalanceAlert[]; totalBalanceMinor: number;
};

export function monitorIntradayBalances(entries: IntradayEntry[], minBalanceMinor: number, maxBalanceMinor: number): CalculatorResult<IntradayResult> {
  if (entries.length === 0) throw new DomainError('VALIDATION_FAILED', 'No entries');
  const latestByAccount = new Map<string, IntradayEntry>();
  for (const e of entries) {
    const existing = latestByAccount.get(e.accountId);
    if (!existing || e.timestampIso > existing.timestampIso) latestByAccount.set(e.accountId, e);
  }
  const currentBalances = [...latestByAccount.values()].map((e) => ({ accountId: e.accountId, balanceMinor: e.balanceMinor }));
  const alerts: BalanceAlert[] = [];
  for (const e of currentBalances) {
    if (e.balanceMinor < minBalanceMinor) alerts.push({ accountId: e.accountId, timestampIso: latestByAccount.get(e.accountId)!.timestampIso, balanceMinor: e.balanceMinor, alertType: 'below_minimum' });
    if (e.balanceMinor > maxBalanceMinor) alerts.push({ accountId: e.accountId, timestampIso: latestByAccount.get(e.accountId)!.timestampIso, balanceMinor: e.balanceMinor, alertType: 'above_maximum' });
  }
  return { result: { currentBalances, alerts, totalBalanceMinor: currentBalances.reduce((s, b) => s + b.balanceMinor, 0) }, inputs: { entryCount: entries.length, minBalanceMinor, maxBalanceMinor }, explanation: `Intraday: ${currentBalances.length} accounts, ${alerts.length} alerts` };
}
