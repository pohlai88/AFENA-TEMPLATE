import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FA-06 — Impairment testing: recoverable amount vs carrying amount
 * @see FA-01 — Asset register: acquisition, disposal, transfer tracking
 * @see FA-03 — Useful life review and residual value reassessment
 * @see FA-04 — Component Accounting: Major Components Depreciated Separately
 * @see FA-08 — Asset transfer between entities / locations
 *
 * IAS 16 §43–47: Each significant component of an item of PPE is depreciated
 * separately using its own useful life and depreciation method.
 * Pure function — no I/O.
 */

export type AssetComponent = {
  componentId: string;
  name: string;
  costMinor: number;
  residualValueMinor: number;
  usefulLifeMonths: number;
  method: 'straight-line' | 'declining-balance';
  decliningRatePct?: number;
  elapsedMonths: number;
};

export type ComponentScheduleLine = {
  componentId: string;
  name: string;
  costMinor: number;
  accumulatedDepreciationMinor: number;
  currentPeriodDepreciationMinor: number;
  netBookValueMinor: number;
  remainingLifeMonths: number;
};

export type ComponentDepreciationResult = {
  assetId: string;
  components: ComponentScheduleLine[];
  totalCostMinor: number;
  totalAccumulatedMinor: number;
  totalCurrentPeriodMinor: number;
  totalNbvMinor: number;
};

export function computeComponentDepreciation(
  assetId: string,
  components: AssetComponent[],
): CalculatorResult<ComponentDepreciationResult> {
  if (!assetId) throw new DomainError('VALIDATION_FAILED', 'assetId is required');
  if (components.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one component required');

  const lines: ComponentScheduleLine[] = components.map((c) => {
    if (c.costMinor < 0) throw new DomainError('VALIDATION_FAILED', `Negative cost for component ${c.componentId}`);
    if (c.usefulLifeMonths <= 0) throw new DomainError('VALIDATION_FAILED', `Useful life must be positive for component ${c.componentId}`);
    if (c.elapsedMonths < 0) throw new DomainError('VALIDATION_FAILED', `Elapsed months must be non-negative for component ${c.componentId}`);

    const depreciableAmount = c.costMinor - c.residualValueMinor;
    let accumulatedDep: number;
    let currentPeriodDep: number;

    if (c.method === 'straight-line') {
      const monthlyDep = depreciableAmount / c.usefulLifeMonths;
      const cappedElapsed = Math.min(c.elapsedMonths, c.usefulLifeMonths);
      accumulatedDep = Math.round(monthlyDep * cappedElapsed);
      currentPeriodDep = c.elapsedMonths >= c.usefulLifeMonths ? 0 : Math.round(monthlyDep);
    } else {
      // Declining balance
      const rate = (c.decliningRatePct ?? (2 / c.usefulLifeMonths * 100 * 12)) / 100 / 12;
      let nbv = c.costMinor;
      accumulatedDep = 0;
      currentPeriodDep = 0;

      for (let m = 0; m < c.elapsedMonths && m < c.usefulLifeMonths; m++) {
        const dep = Math.round(nbv * rate);
        const cappedDep = Math.min(dep, nbv - c.residualValueMinor);
        if (cappedDep <= 0) break;
        accumulatedDep += cappedDep;
        nbv -= cappedDep;
        if (m === c.elapsedMonths - 1) currentPeriodDep = cappedDep;
      }
    }

    const nbv = c.costMinor - accumulatedDep;
    const remaining = Math.max(0, c.usefulLifeMonths - c.elapsedMonths);

    return {
      componentId: c.componentId,
      name: c.name,
      costMinor: c.costMinor,
      accumulatedDepreciationMinor: accumulatedDep,
      currentPeriodDepreciationMinor: currentPeriodDep,
      netBookValueMinor: nbv,
      remainingLifeMonths: remaining,
    };
  });

  const totalCost = lines.reduce((s, l) => s + l.costMinor, 0);
  const totalAccum = lines.reduce((s, l) => s + l.accumulatedDepreciationMinor, 0);
  const totalCurrent = lines.reduce((s, l) => s + l.currentPeriodDepreciationMinor, 0);
  const totalNbv = lines.reduce((s, l) => s + l.netBookValueMinor, 0);

  return {
    result: { assetId, components: lines, totalCostMinor: totalCost, totalAccumulatedMinor: totalAccum, totalCurrentPeriodMinor: totalCurrent, totalNbvMinor: totalNbv },
    inputs: { assetId, componentCount: components.length },
    explanation: `Component depreciation for ${assetId}: ${components.length} components, total NBV=${totalNbv}, current period=${totalCurrent}`,
  };
}
