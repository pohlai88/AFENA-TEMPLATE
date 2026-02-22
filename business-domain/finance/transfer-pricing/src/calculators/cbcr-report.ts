import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * TP-08 — Country-by-Country Reporting (CbCR) (OECD BEPS Action 13)
 * Pure function — no I/O.
 */

export type CbcrEntity = { entityName: string; jurisdiction: string; revenueRelatedMinor: number; revenueUnrelatedMinor: number; profitBeforeTaxMinor: number; taxPaidMinor: number; taxAccruedMinor: number; statedCapitalMinor: number; retainedEarningsMinor: number; employeeCount: number; tangibleAssetsMinor: number };

export type CbcrJurisdictionSummary = { jurisdiction: string; entityCount: number; totalRevenueMinor: number; profitBeforeTaxMinor: number; taxPaidMinor: number; employeeCount: number; tangibleAssetsMinor: number; effectiveTaxRatePct: number };

export type CbcrResult = { jurisdictions: CbcrJurisdictionSummary[]; totalEntities: number; totalJurisdictions: number; groupRevenueMinor: number };

export function generateCbcrReport(entities: CbcrEntity[]): CalculatorResult<CbcrResult> {
  if (entities.length === 0) throw new DomainError('VALIDATION_FAILED', 'No entities');
  const byJurisdiction = new Map<string, CbcrEntity[]>();
  for (const e of entities) { const arr = byJurisdiction.get(e.jurisdiction) ?? []; arr.push(e); byJurisdiction.set(e.jurisdiction, arr); }

  const jurisdictions: CbcrJurisdictionSummary[] = [...byJurisdiction.entries()].map(([j, ents]) => {
    const totalRevenue = ents.reduce((s, e) => s + e.revenueRelatedMinor + e.revenueUnrelatedMinor, 0);
    const pbt = ents.reduce((s, e) => s + e.profitBeforeTaxMinor, 0);
    const taxPaid = ents.reduce((s, e) => s + e.taxPaidMinor, 0);
    return { jurisdiction: j, entityCount: ents.length, totalRevenueMinor: totalRevenue, profitBeforeTaxMinor: pbt, taxPaidMinor: taxPaid, employeeCount: ents.reduce((s, e) => s + e.employeeCount, 0), tangibleAssetsMinor: ents.reduce((s, e) => s + e.tangibleAssetsMinor, 0), effectiveTaxRatePct: pbt > 0 ? Math.round((taxPaid / pbt) * 10000) / 100 : 0 };
  });

  return { result: { jurisdictions, totalEntities: entities.length, totalJurisdictions: jurisdictions.length, groupRevenueMinor: jurisdictions.reduce((s, j) => s + j.totalRevenueMinor, 0) }, inputs: { entityCount: entities.length }, explanation: `CbCR: ${jurisdictions.length} jurisdictions, ${entities.length} entities` };
}
