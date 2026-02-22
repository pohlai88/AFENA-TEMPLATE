import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * SR-06 — Segment Reporting: Operating Segments per IFRS 8
 * Pure function — no I/O.
 */

export type SegmentData = { segmentId: string; name: string; revenueExternalMinor: number; revenueInterSegmentMinor: number; profitLossMinor: number; assetsMinor: number; liabilitiesMinor: number };

export type SegmentReportResult = { segments: (SegmentData & { revenuePct: number; isReportable: boolean })[]; reportableCount: number; totalRevenueMinor: number; totalProfitLossMinor: number; coveragePct: number };

const REPORTABLE_THRESHOLD_PCT = 10;
const COVERAGE_TARGET_PCT = 75;

export function generateSegmentReport(segments: SegmentData[]): CalculatorResult<SegmentReportResult> {
  if (segments.length === 0) throw new DomainError('VALIDATION_FAILED', 'No segments');
  const totalRevenue = segments.reduce((s, seg) => s + seg.revenueExternalMinor, 0);
  const enriched = segments.map((seg) => {
    const revenuePct = totalRevenue > 0 ? Math.round((seg.revenueExternalMinor / totalRevenue) * 100) : 0;
    return { ...seg, revenuePct, isReportable: revenuePct >= REPORTABLE_THRESHOLD_PCT };
  });
  const reportableRevenue = enriched.filter((s) => s.isReportable).reduce((sum, s) => sum + s.revenueExternalMinor, 0);
  const coveragePct = totalRevenue > 0 ? Math.round((reportableRevenue / totalRevenue) * 100) : 100;
  return { result: { segments: enriched, reportableCount: enriched.filter((s) => s.isReportable).length, totalRevenueMinor: totalRevenue, totalProfitLossMinor: segments.reduce((s, seg) => s + seg.profitLossMinor, 0), coveragePct }, inputs: { segmentCount: segments.length }, explanation: `Segment report: ${enriched.filter((s) => s.isReportable).length} reportable, coverage=${coveragePct}% (target ${COVERAGE_TARGET_PCT}%)` };
}
