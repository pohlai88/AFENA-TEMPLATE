import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * G-14 / EM-10 — VAT/GST Reclaim on Business Expenses
 *
 * Computes reclaimable VAT/GST from expense claims based on jurisdiction
 * rules, expense categories, and receipt evidence.
 *
 * Pure function — no I/O.
 */

export type ExpenseForReclaim = {
  expenseId: string;
  category: string;
  grossAmountMinor: number;
  vatAmountMinor: number;
  vatRatePct: number;
  hasValidReceipt: boolean;
  jurisdiction: string;
};

export type ReclaimRule = {
  category: string;
  reclaimablePct: number;
  requiresReceipt: boolean;
};

export type VatReclaimResult = {
  reclaimableItems: { expenseId: string; reclaimMinor: number; reason: string }[];
  nonReclaimableItems: { expenseId: string; reason: string }[];
  totalVatMinor: number;
  totalReclaimableMinor: number;
  totalNonReclaimableMinor: number;
  reclaimRatePct: number;
};

export function computeVatReclaim(
  expenses: ExpenseForReclaim[],
  rules: ReclaimRule[],
): CalculatorResult<VatReclaimResult> {
  if (expenses.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one expense required');
  }

  const ruleMap = new Map(rules.map((r) => [r.category, r]));
  const reclaimableItems: { expenseId: string; reclaimMinor: number; reason: string }[] = [];
  const nonReclaimableItems: { expenseId: string; reason: string }[] = [];
  let totalVat = 0;
  let totalReclaimable = 0;

  for (const exp of expenses) {
    totalVat += exp.vatAmountMinor;
    const rule = ruleMap.get(exp.category);

    if (!rule) {
      nonReclaimableItems.push({ expenseId: exp.expenseId, reason: `No reclaim rule for category: ${exp.category}` });
      continue;
    }
    if (rule.requiresReceipt && !exp.hasValidReceipt) {
      nonReclaimableItems.push({ expenseId: exp.expenseId, reason: 'Missing valid receipt' });
      continue;
    }
    if (rule.reclaimablePct <= 0) {
      nonReclaimableItems.push({ expenseId: exp.expenseId, reason: `Category ${exp.category} not reclaimable` });
      continue;
    }

    const reclaimMinor = Math.round(exp.vatAmountMinor * (rule.reclaimablePct / 100));
    totalReclaimable += reclaimMinor;
    reclaimableItems.push({ expenseId: exp.expenseId, reclaimMinor, reason: `${rule.reclaimablePct}% reclaimable` });
  }

  return {
    result: {
      reclaimableItems,
      nonReclaimableItems,
      totalVatMinor: totalVat,
      totalReclaimableMinor: totalReclaimable,
      totalNonReclaimableMinor: totalVat - totalReclaimable,
      reclaimRatePct: totalVat === 0 ? 0 : Math.round((totalReclaimable / totalVat) * 10000) / 100,
    },
    inputs: { expenseCount: expenses.length, ruleCount: rules.length },
    explanation: `VAT reclaim: ${reclaimableItems.length}/${expenses.length} reclaimable, total ${totalReclaimable} of ${totalVat}`,
  };
}
