import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * CA-10 — Profitability Analysis (CO-PA equivalent)
 *
 * Computes contribution margin and profitability by any dimension:
 * product, customer, region, channel, or custom segment.
 *
 * Pure function — no I/O.
 */

export type ProfitabilityDimension = 'product' | 'customer' | 'region' | 'channel' | 'segment';

export type ProfitabilityLineItem = {
  dimensionKey: string;
  dimensionType: ProfitabilityDimension;
  revenueMinor: number;
  directCostMinor: number;
  allocatedOverheadMinor: number;
};

export type ProfitabilitySegment = {
  dimensionKey: string;
  dimensionType: ProfitabilityDimension;
  revenueMinor: number;
  directCostMinor: number;
  allocatedOverheadMinor: number;
  contributionMarginMinor: number;
  contributionMarginPct: number;
  netProfitMinor: number;
  netProfitPct: number;
};

export type ProfitabilityResult = {
  segments: ProfitabilitySegment[];
  totalRevenueMinor: number;
  totalDirectCostMinor: number;
  totalOverheadMinor: number;
  totalContributionMarginMinor: number;
  totalNetProfitMinor: number;
  overallMarginPct: number;
};

/**
 * Compute profitability by dimension.
 *
 * Groups line items by (dimensionType, dimensionKey), then computes:
 * - Contribution margin = revenue - direct cost
 * - Net profit = contribution margin - allocated overhead
 * - Margin percentages (basis points precision)
 */
export function analyzeProfitability(
  items: ProfitabilityLineItem[],
): CalculatorResult<ProfitabilityResult> {
  if (items.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one line item required for profitability analysis');
  }

  const grouped = new Map<string, ProfitabilityLineItem[]>();
  for (const item of items) {
    const key = `${item.dimensionType}|${item.dimensionKey}`;
    const group = grouped.get(key) ?? [];
    group.push(item);
    grouped.set(key, group);
  }

  const segments: ProfitabilitySegment[] = [];

  for (const [, group] of grouped) {
    const first = group[0]!;
    const revenueMinor = group.reduce((s, i) => s + i.revenueMinor, 0);
    const directCostMinor = group.reduce((s, i) => s + i.directCostMinor, 0);
    const allocatedOverheadMinor = group.reduce((s, i) => s + i.allocatedOverheadMinor, 0);
    const contributionMarginMinor = revenueMinor - directCostMinor;
    const netProfitMinor = contributionMarginMinor - allocatedOverheadMinor;

    segments.push({
      dimensionKey: first.dimensionKey,
      dimensionType: first.dimensionType,
      revenueMinor,
      directCostMinor,
      allocatedOverheadMinor,
      contributionMarginMinor,
      contributionMarginPct: revenueMinor === 0 ? 0 : round2((contributionMarginMinor / revenueMinor) * 100),
      netProfitMinor,
      netProfitPct: revenueMinor === 0 ? 0 : round2((netProfitMinor / revenueMinor) * 100),
    });
  }

  segments.sort((a, b) => b.netProfitMinor - a.netProfitMinor);

  const totalRevenueMinor = segments.reduce((s, seg) => s + seg.revenueMinor, 0);
  const totalDirectCostMinor = segments.reduce((s, seg) => s + seg.directCostMinor, 0);
  const totalOverheadMinor = segments.reduce((s, seg) => s + seg.allocatedOverheadMinor, 0);
  const totalContributionMarginMinor = totalRevenueMinor - totalDirectCostMinor;
  const totalNetProfitMinor = totalContributionMarginMinor - totalOverheadMinor;

  return {
    result: {
      segments,
      totalRevenueMinor,
      totalDirectCostMinor,
      totalOverheadMinor,
      totalContributionMarginMinor,
      totalNetProfitMinor,
      overallMarginPct: totalRevenueMinor === 0 ? 0 : round2((totalNetProfitMinor / totalRevenueMinor) * 100),
    },
    inputs: { lineItemCount: items.length, segmentCount: segments.length },
    explanation: `Profitability analysis: ${segments.length} segments, overall margin ${totalRevenueMinor === 0 ? 0 : round2((totalNetProfitMinor / totalRevenueMinor) * 100)}%`,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
