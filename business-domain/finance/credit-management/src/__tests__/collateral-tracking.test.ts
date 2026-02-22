import { describe, expect, it } from 'vitest';
import { computeCollateralCoverage } from '../calculators/collateral-tracking';
import type { CollateralItem, Exposure } from '../calculators/collateral-tracking';

const exposures: Exposure[] = [
  { exposureId: 'exp-1', counterpartyId: 'cp-A', grossExposureMinor: 1000000 },
  { exposureId: 'exp-2', counterpartyId: 'cp-B', grossExposureMinor: 500000 },
];

const collaterals: CollateralItem[] = [
  { collateralId: 'col-1', type: 'property', description: 'Office building', valuationMinor: 800000, haircutPct: 20, linkedExposureId: 'exp-1', expiryDate: null },
  { collateralId: 'col-2', type: 'cash_deposit', description: 'Fixed deposit', valuationMinor: 200000, haircutPct: 0, linkedExposureId: 'exp-1', expiryDate: '2027-01-01' },
];

describe('computeCollateralCoverage', () => {
  it('computes adjusted collateral after haircut', () => {
    const { result } = computeCollateralCoverage(exposures, collaterals);
    const exp1 = result.exposures.find((e) => e.exposureId === 'exp-1')!;
    expect(exp1.adjustedCollateralMinor).toBe(840000);
  });

  it('computes net unsecured exposure', () => {
    const { result } = computeCollateralCoverage(exposures, collaterals);
    const exp1 = result.exposures.find((e) => e.exposureId === 'exp-1')!;
    expect(exp1.netUnsecuredMinor).toBe(160000);
  });

  it('shows fully unsecured when no collateral linked', () => {
    const { result } = computeCollateralCoverage(exposures, collaterals);
    const exp2 = result.exposures.find((e) => e.exposureId === 'exp-2')!;
    expect(exp2.netUnsecuredMinor).toBe(500000);
    expect(exp2.coverageRatioPct).toBe(0);
  });

  it('computes overall coverage ratio', () => {
    const { result } = computeCollateralCoverage(exposures, collaterals);
    expect(result.overallCoverageRatioPct).toBeGreaterThan(0);
    expect(result.overallCoverageRatioPct).toBeLessThan(100);
  });

  it('throws for empty exposures', () => {
    expect(() => computeCollateralCoverage([], collaterals)).toThrow('At least one exposure');
  });
});
