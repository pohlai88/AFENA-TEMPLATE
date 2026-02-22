import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FI-10 — Offsetting: legal right + intention to net settle
 * G-15 / FI — Financial Instrument Offsetting (IAS 32 §42)
 *
 * IAS 32 §42: A financial asset and liability shall be offset and the net
 * amount presented when, and only when, an entity:
 * (a) currently has a legally enforceable right to set off; AND
 * (b) intends either to settle on a net basis, or to realise the asset
 *     and settle the liability simultaneously.
 *
 * Pure function — no I/O.
 */

export type OffsettingCandidate = {
  assetId: string;
  liabilityId: string;
  counterpartyId: string;
  assetAmountMinor: number;
  liabilityAmountMinor: number;
  hasLegalRight: boolean;
  intendNetSettlement: boolean;
  masterNettingAgreement: boolean;
};

export type OffsettingResult = {
  qualifyingPairs: {
    assetId: string;
    liabilityId: string;
    counterpartyId: string;
    netAmountMinor: number;
    side: 'asset' | 'liability';
    offsetAmountMinor: number;
  }[];
  nonQualifyingPairs: { assetId: string; liabilityId: string; reason: string }[];
  totalGrossAssetMinor: number;
  totalGrossLiabilityMinor: number;
  totalNetAssetMinor: number;
  totalNetLiabilityMinor: number;
  totalOffsetMinor: number;
};

export function evaluateOffsetting(
  candidates: OffsettingCandidate[],
): CalculatorResult<OffsettingResult> {
  if (candidates.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one offsetting candidate required');
  }

  const qualifying: OffsettingResult['qualifyingPairs'] = [];
  const nonQualifying: OffsettingResult['nonQualifyingPairs'] = [];
  let totalGrossAsset = 0;
  let totalGrossLiability = 0;
  let totalOffset = 0;

  for (const c of candidates) {
    totalGrossAsset += c.assetAmountMinor;
    totalGrossLiability += c.liabilityAmountMinor;

    if (!c.hasLegalRight) {
      nonQualifying.push({ assetId: c.assetId, liabilityId: c.liabilityId, reason: 'No legally enforceable right to set off (IAS 32 §42a)' });
      continue;
    }
    if (!c.intendNetSettlement) {
      nonQualifying.push({ assetId: c.assetId, liabilityId: c.liabilityId, reason: 'No intent to settle net or simultaneously (IAS 32 §42b)' });
      continue;
    }

    const offsetAmount = Math.min(c.assetAmountMinor, c.liabilityAmountMinor);
    const netAmount = Math.abs(c.assetAmountMinor - c.liabilityAmountMinor);
    const side = c.assetAmountMinor >= c.liabilityAmountMinor ? 'asset' : 'liability';
    totalOffset += offsetAmount;

    qualifying.push({
      assetId: c.assetId,
      liabilityId: c.liabilityId,
      counterpartyId: c.counterpartyId,
      netAmountMinor: netAmount,
      side,
      offsetAmountMinor: offsetAmount,
    });
  }

  const netAsset = qualifying.filter((q) => q.side === 'asset').reduce((s, q) => s + q.netAmountMinor, 0);
  const netLiability = qualifying.filter((q) => q.side === 'liability').reduce((s, q) => s + q.netAmountMinor, 0);

  return {
    result: {
      qualifyingPairs: qualifying,
      nonQualifyingPairs: nonQualifying,
      totalGrossAssetMinor: totalGrossAsset,
      totalGrossLiabilityMinor: totalGrossLiability,
      totalNetAssetMinor: totalGrossAsset - totalOffset + netAsset - netAsset,
      totalNetLiabilityMinor: totalGrossLiability - totalOffset + netLiability - netLiability,
      totalOffsetMinor: totalOffset,
    },
    inputs: { candidateCount: candidates.length },
    explanation: `Offsetting: ${qualifying.length}/${candidates.length} qualify, total offset ${totalOffset}`,
  };
}
