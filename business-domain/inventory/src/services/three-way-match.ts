import { and, eq, matchResults } from 'afenda-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Match input — references to PO line, GRN line, and invoice line.
 */
export interface MatchInput {
  companyId: string;
  poLineId: string;
  grnLineId?: string;
  invoiceLineId?: string;
  poQty: number;
  poUnitPriceMinor: number;
  grnQty?: number;
  invoiceQty?: number;
  invoiceUnitPriceMinor?: number;
}

/**
 * Tolerance configuration for match evaluation.
 */
export interface MatchTolerance {
  qtyTolerancePercent: number;
  priceTolerancePercent: number;
  totalToleranceMinor: number;
}

/**
 * Match evaluation result.
 */
export interface MatchEvaluation {
  matchType: 'two_way' | 'three_way';
  status: 'matched' | 'exception';
  qtyVariance: number | null;
  priceVarianceMinor: number | null;
  totalVarianceMinor: number | null;
  details: string;
}

const DEFAULT_TOLERANCE: MatchTolerance = {
  qtyTolerancePercent: 2,
  priceTolerancePercent: 1,
  totalToleranceMinor: 100, // 1.00 in minor units
};

/**
 * Evaluate a 3-way match (PO–GRN–Invoice) or 2-way match (PO–Invoice).
 *
 * PRD G0.17 + Phase D #18.5:
 * - Compares quantities and prices across PO, GRN, and Invoice lines
 * - Applies tolerance thresholds to determine match/exception
 * - 2-way match: PO vs Invoice (no GRN)
 * - 3-way match: PO vs GRN vs Invoice
 *
 * @param input - Line references and quantities/prices
 * @param tolerance - Tolerance thresholds (defaults provided)
 */
export function evaluateMatch(
  input: MatchInput,
  tolerance: MatchTolerance = DEFAULT_TOLERANCE,
): MatchEvaluation {
  const matchType = input.grnLineId ? 'three_way' : 'two_way';
  const details: string[] = [];

  let qtyVariance: number | null = null;
  let priceVarianceMinor: number | null = null;
  let totalVarianceMinor: number | null = null;
  let hasException = false;

  // Qty variance: GRN qty vs PO qty (3-way) or Invoice qty vs PO qty (2-way)
  const compareQty = matchType === 'three_way'
    ? input.grnQty ?? input.poQty
    : input.invoiceQty ?? input.poQty;

  if (compareQty !== undefined) {
    qtyVariance = compareQty - input.poQty;
    const qtyVariancePercent = input.poQty > 0
      ? Math.abs(qtyVariance / input.poQty) * 100
      : 0;

    if (qtyVariancePercent > tolerance.qtyTolerancePercent) {
      hasException = true;
      details.push(
        `Qty variance ${qtyVariance} (${qtyVariancePercent.toFixed(1)}%) exceeds tolerance ${tolerance.qtyTolerancePercent}%`,
      );
    }
  }

  // Price variance: Invoice unit price vs PO unit price
  if (input.invoiceUnitPriceMinor !== undefined) {
    priceVarianceMinor = input.invoiceUnitPriceMinor - input.poUnitPriceMinor;
    const priceVariancePercent = input.poUnitPriceMinor > 0
      ? Math.abs(priceVarianceMinor / input.poUnitPriceMinor) * 100
      : 0;

    if (priceVariancePercent > tolerance.priceTolerancePercent) {
      hasException = true;
      details.push(
        `Price variance ${priceVarianceMinor} (${priceVariancePercent.toFixed(1)}%) exceeds tolerance ${tolerance.priceTolerancePercent}%`,
      );
    }
  }

  // Total variance: (invoice qty * invoice price) vs (PO qty * PO price)
  if (input.invoiceQty !== undefined && input.invoiceUnitPriceMinor !== undefined) {
    const poTotal = input.poQty * input.poUnitPriceMinor;
    const invoiceTotal = input.invoiceQty * input.invoiceUnitPriceMinor;
    totalVarianceMinor = invoiceTotal - poTotal;

    if (Math.abs(totalVarianceMinor) > tolerance.totalToleranceMinor) {
      hasException = true;
      details.push(
        `Total variance ${totalVarianceMinor} exceeds tolerance ${tolerance.totalToleranceMinor}`,
      );
    }
  }

  return {
    matchType,
    status: hasException ? 'exception' : 'matched',
    qtyVariance,
    priceVarianceMinor,
    totalVarianceMinor,
    details: details.length > 0 ? details.join('; ') : 'All within tolerance',
  };
}

/**
 * Evaluate and persist a match result.
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param input - Match input
 * @param tolerance - Optional tolerance overrides
 */
export async function matchDocumentLines(
  tx: NeonHttpDatabase,
  orgId: string,
  input: MatchInput,
  tolerance?: MatchTolerance,
): Promise<{ matchResultId: string; evaluation: MatchEvaluation }> {
  const evaluation = evaluateMatch(input, tolerance);

  const [row] = await (tx as any)
    .insert(matchResults)
    .values({
      orgId,
      companyId: input.companyId,
      poLineId: input.poLineId,
      grnLineId: input.grnLineId ?? null,
      invoiceLineId: input.invoiceLineId ?? null,
      matchType: evaluation.matchType,
      status: evaluation.status,
      qtyVariance: evaluation.qtyVariance?.toString() ?? null,
      priceVarianceMinor: evaluation.priceVarianceMinor ?? null,
      totalVarianceMinor: evaluation.totalVarianceMinor ?? null,
      memo: evaluation.details,
    })
    .returning({ id: matchResults.id });

  return { matchResultId: row.id, evaluation };
}

/**
 * Override a match exception (manual approval).
 */
export async function overrideMatchException(
  tx: NeonHttpDatabase,
  orgId: string,
  matchResultId: string,
  resolvedBy: string,
  resolutionNote: string,
): Promise<void> {
  await (tx as any)
    .update(matchResults)
    .set({
      status: 'approved_override',
      resolvedBy,
      resolutionNote,
    })
    .where(
      and(
        eq(matchResults.orgId, orgId),
        eq(matchResults.id, matchResultId),
        eq(matchResults.status, 'exception'),
      ),
    );
}
