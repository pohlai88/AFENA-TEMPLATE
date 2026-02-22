import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see PA-01 — Project master: budget, start/end date, billing type
 * @see PA-02 — Cost posting to project (labor, material, expense)
 * PA-07 — Intercompany Project Cost Recharge (IAS 24)
 * Pure function — no I/O.
 */

export type RechargeItem = { costId: string; fromCompanyId: string; toCompanyId: string; costMinor: number; markupPct: number };

export type RechargeResult = { items: { costId: string; fromCompanyId: string; toCompanyId: string; costMinor: number; markupMinor: number; rechargeMinor: number }[]; totalRechargeMinor: number };

export function computeIcRecharge(items: RechargeItem[]): CalculatorResult<RechargeResult> {
  if (items.length === 0) throw new DomainError('VALIDATION_FAILED', 'No recharge items');
  const results = items.map((i) => {
    const markupMinor = Math.round(i.costMinor * i.markupPct / 100);
    return { costId: i.costId, fromCompanyId: i.fromCompanyId, toCompanyId: i.toCompanyId, costMinor: i.costMinor, markupMinor, rechargeMinor: i.costMinor + markupMinor };
  });
  return { result: { items: results, totalRechargeMinor: results.reduce((s, r) => s + r.rechargeMinor, 0) }, inputs: { count: items.length }, explanation: `IC recharge: ${results.length} items, total=${results.reduce((s, r) => s + r.rechargeMinor, 0)}` };
}
