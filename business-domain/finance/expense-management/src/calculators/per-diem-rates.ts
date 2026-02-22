import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * EM-03 — Per-Diem Rate Tables (Jurisdiction-Aware, Time-Bounded)
 * Pure function — no I/O.
 */

export type PerDiemRate = { jurisdiction: string; effectiveFromIso: string; effectiveToIso: string | null; dailyRateMinor: number; mealRateMinor: number; lodgingRateMinor: number };
export type TravelClaim = { claimId: string; jurisdiction: string; travelDateIso: string; days: number };

export type PerDiemResult = { claimId: string; jurisdiction: string; days: number; dailyRateMinor: number; totalMinor: number; rateFound: boolean };
export type PerDiemBatchResult = { claims: PerDiemResult[]; totalMinor: number; unmatchedCount: number };

export function computePerDiem(claims: TravelClaim[], rates: PerDiemRate[]): CalculatorResult<PerDiemBatchResult> {
  if (claims.length === 0) throw new DomainError('VALIDATION_FAILED', 'No claims');
  const results: PerDiemResult[] = claims.map((c) => {
    const rate = rates.find((r) => r.jurisdiction === c.jurisdiction && r.effectiveFromIso <= c.travelDateIso && (!r.effectiveToIso || r.effectiveToIso >= c.travelDateIso));
    const dailyRateMinor = rate ? rate.dailyRateMinor : 0;
    return { claimId: c.claimId, jurisdiction: c.jurisdiction, days: c.days, dailyRateMinor, totalMinor: dailyRateMinor * c.days, rateFound: !!rate };
  });
  return { result: { claims: results, totalMinor: results.reduce((s, r) => s + r.totalMinor, 0), unmatchedCount: results.filter((r) => !r.rateFound).length }, inputs: { claimCount: claims.length, rateCount: rates.length }, explanation: `Per diem: ${results.length} claims, ${results.filter((r) => !r.rateFound).length} unmatched` };
}
