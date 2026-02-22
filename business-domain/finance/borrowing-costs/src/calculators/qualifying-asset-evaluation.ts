/**
 * IAS 23.5-7 — Qualifying Asset Test
 *
 * Determines whether an asset qualifies for borrowing cost capitalisation.
 * A qualifying asset is one that necessarily takes a substantial period
 * of time to get ready for its intended use or sale.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type QualifyingAssetTestInput = {
  assetType: 'ppe' | 'intangible' | 'inventory' | 'investment-property' | 'biological';
  estimatedConstructionMonths: number;
  /** Threshold in months — assets below this are not "substantial period" */
  substantialPeriodThresholdMonths: number;
  isReadyForUseOrSale: boolean;
};

export type QualifyingAssetTestResult = {
  qualifies: boolean;
  reason: string;
  explanation: string;
};

export function evaluateQualifyingAsset(
  inputs: QualifyingAssetTestInput,
): CalculatorResult<QualifyingAssetTestResult> {
  const { assetType, estimatedConstructionMonths, substantialPeriodThresholdMonths, isReadyForUseOrSale } = inputs;

  if (estimatedConstructionMonths < 0) {
    throw new DomainError('VALIDATION_FAILED', 'Construction months cannot be negative');
  }

  if (isReadyForUseOrSale) {
    const explanation = `Asset already ready for use/sale — does not qualify (IAS 23.5)`;
    return {
      result: { qualifies: false, reason: 'already_complete', explanation },
      inputs: { ...inputs },
      explanation,
    };
  }

  const meetsSubstantialPeriod = estimatedConstructionMonths >= substantialPeriodThresholdMonths;

  if (!meetsSubstantialPeriod) {
    const explanation =
      `${assetType} with ${estimatedConstructionMonths}m construction < ${substantialPeriodThresholdMonths}m threshold — does not qualify (IAS 23.5)`;
    return {
      result: { qualifies: false, reason: 'below_threshold', explanation },
      inputs: { ...inputs },
      explanation,
    };
  }

  const explanation =
    `${assetType} with ${estimatedConstructionMonths}m construction ≥ ${substantialPeriodThresholdMonths}m threshold — qualifies for capitalisation (IAS 23.5)`;
  return {
    result: { qualifies: true, reason: 'meets_criteria', explanation },
    inputs: { ...inputs },
    explanation,
  };
}
