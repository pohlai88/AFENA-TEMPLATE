/**
 * IAS 36.88-99 — Goodwill Impairment
 *
 * Goodwill impairment is allocated first to reduce the carrying amount
 * of goodwill, then pro-rata to other assets in the CGU.
 * Goodwill impairment is never reversed.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type GoodwillImpairmentInput = {
  cguCarryingMinor: number;
  goodwillCarryingMinor: number;
  recoverableAmountMinor: number;
  otherAssets: Array<{ assetId: string; carryingMinor: number }>;
};

export type GoodwillImpairmentResult = {
  totalImpairmentMinor: number;
  goodwillImpairmentMinor: number;
  assetAllocations: Array<{ assetId: string; impairmentMinor: number; newCarryingMinor: number }>;
  isImpaired: boolean;
  explanation: string;
};

export function computeGoodwillImpairment(
  inputs: GoodwillImpairmentInput,
): CalculatorResult<GoodwillImpairmentResult> {
  const { cguCarryingMinor, goodwillCarryingMinor, recoverableAmountMinor, otherAssets } = inputs;

  if (cguCarryingMinor < 0) throw new DomainError('VALIDATION_FAILED', 'CGU carrying amount cannot be negative');
  if (goodwillCarryingMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Goodwill cannot be negative');

  const totalImpairmentMinor = Math.max(0, cguCarryingMinor - recoverableAmountMinor);
  const isImpaired = totalImpairmentMinor > 0;

  const goodwillImpairmentMinor = Math.min(totalImpairmentMinor, goodwillCarryingMinor);
  const remainingImpairment = totalImpairmentMinor - goodwillImpairmentMinor;

  const totalOtherCarrying = otherAssets.reduce((s, a) => s + a.carryingMinor, 0);

  const assetAllocations = otherAssets.map((asset) => {
    const ratio = totalOtherCarrying > 0 ? asset.carryingMinor / totalOtherCarrying : 0;
    const impairmentMinor = Math.round(remainingImpairment * ratio);
    return {
      assetId: asset.assetId,
      impairmentMinor,
      newCarryingMinor: asset.carryingMinor - impairmentMinor,
    };
  });

  const explanation = isImpaired
    ? `Goodwill impairment (IAS 36.88): total ${totalImpairmentMinor}, goodwill ${goodwillImpairmentMinor}, ` +
      `remaining ${remainingImpairment} allocated pro-rata to ${otherAssets.length} assets`
    : 'No impairment — recoverable amount exceeds carrying amount';

  return {
    result: { totalImpairmentMinor, goodwillImpairmentMinor, assetAllocations, isImpaired, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
