import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * BU-03 — Budget Consolidation Across Companies
 *
 * Rolls up department/company budgets into group-level consolidated budget.
 * Pure function — no I/O.
 */

export type BudgetEntry = { companyId: string; departmentId: string; accountId: string; periodKey: string; amountMinor: number };

export type ConsolidatedBudgetLine = { accountId: string; periodKey: string; totalMinor: number; companyCount: number };

export type BudgetConsolidationResult = { lines: ConsolidatedBudgetLine[]; totalBudgetMinor: number; companyCount: number; periodCount: number };

export function consolidateBudgets(entries: BudgetEntry[]): CalculatorResult<BudgetConsolidationResult> {
  if (entries.length === 0) throw new DomainError('VALIDATION_FAILED', 'No budget entries provided');

  const map = new Map<string, { totalMinor: number; companies: Set<string> }>();
  const allCompanies = new Set<string>();
  const allPeriods = new Set<string>();

  for (const e of entries) {
    const key = `${e.accountId}|${e.periodKey}`;
    const existing = map.get(key) ?? { totalMinor: 0, companies: new Set<string>() };
    existing.totalMinor += e.amountMinor;
    existing.companies.add(e.companyId);
    map.set(key, existing);
    allCompanies.add(e.companyId);
    allPeriods.add(e.periodKey);
  }

  const lines: ConsolidatedBudgetLine[] = [...map.entries()].map(([key, val]) => {
    const [accountId, periodKey] = key.split('|') as [string, string];
    return { accountId, periodKey, totalMinor: val.totalMinor, companyCount: val.companies.size };
  });

  return {
    result: { lines, totalBudgetMinor: lines.reduce((s, l) => s + l.totalMinor, 0), companyCount: allCompanies.size, periodCount: allPeriods.size },
    inputs: { entryCount: entries.length },
    explanation: `Budget consolidation: ${lines.length} lines, ${allCompanies.size} companies, ${allPeriods.size} periods`,
  };
}
