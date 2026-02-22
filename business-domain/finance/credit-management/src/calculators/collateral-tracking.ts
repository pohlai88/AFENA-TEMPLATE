import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see CM-05 — Credit scoring model (configurable weights)
 * G-11 / CM-08 — Insurance / Guarantee / Collateral Tracking
 *
 * Tracks collateral, guarantees, and credit insurance against exposures.
 * Computes net unsecured exposure and coverage ratios.
 *
 * Pure function — no I/O.
 */

export type CollateralItem = {
  collateralId: string;
  type: 'property' | 'cash_deposit' | 'guarantee' | 'insurance' | 'receivable_pledge' | 'other';
  description: string;
  valuationMinor: number;
  haircutPct: number;
  linkedExposureId: string;
  expiryDate: string | null;
};

export type Exposure = {
  exposureId: string;
  counterpartyId: string;
  grossExposureMinor: number;
};

export type CollateralCoverageResult = {
  exposures: {
    exposureId: string;
    counterpartyId: string;
    grossMinor: number;
    collateralValueMinor: number;
    adjustedCollateralMinor: number;
    netUnsecuredMinor: number;
    coverageRatioPct: number;
  }[];
  totalGrossMinor: number;
  totalAdjustedCollateralMinor: number;
  totalNetUnsecuredMinor: number;
  overallCoverageRatioPct: number;
};

export function computeCollateralCoverage(
  exposures: Exposure[],
  collaterals: CollateralItem[],
): CalculatorResult<CollateralCoverageResult> {
  if (exposures.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one exposure required');
  }

  const collateralByExposure = new Map<string, CollateralItem[]>();
  for (const c of collaterals) {
    const group = collateralByExposure.get(c.linkedExposureId) ?? [];
    group.push(c);
    collateralByExposure.set(c.linkedExposureId, group);
  }

  const results = exposures.map((exp) => {
    const linked = collateralByExposure.get(exp.exposureId) ?? [];
    const collateralValueMinor = linked.reduce((s, c) => s + c.valuationMinor, 0);
    const adjustedCollateralMinor = linked.reduce((s, c) => s + Math.round(c.valuationMinor * (1 - c.haircutPct / 100)), 0);
    const netUnsecuredMinor = Math.max(0, exp.grossExposureMinor - adjustedCollateralMinor);
    const coverageRatioPct = exp.grossExposureMinor === 0 ? 100 : Math.round((adjustedCollateralMinor / exp.grossExposureMinor) * 10000) / 100;

    return {
      exposureId: exp.exposureId,
      counterpartyId: exp.counterpartyId,
      grossMinor: exp.grossExposureMinor,
      collateralValueMinor,
      adjustedCollateralMinor,
      netUnsecuredMinor,
      coverageRatioPct,
    };
  });

  const totalGross = results.reduce((s, r) => s + r.grossMinor, 0);
  const totalAdj = results.reduce((s, r) => s + r.adjustedCollateralMinor, 0);

  return {
    result: {
      exposures: results,
      totalGrossMinor: totalGross,
      totalAdjustedCollateralMinor: totalAdj,
      totalNetUnsecuredMinor: results.reduce((s, r) => s + r.netUnsecuredMinor, 0),
      overallCoverageRatioPct: totalGross === 0 ? 100 : Math.round((totalAdj / totalGross) * 10000) / 100,
    },
    inputs: { exposureCount: exposures.length, collateralCount: collaterals.length },
    explanation: `Collateral: ${exposures.length} exposures, overall coverage ${totalGross === 0 ? 100 : Math.round((totalAdj / totalGross) * 10000) / 100}%`,
  };
}
