/**
 * IAS 19 Employee Benefit Calculators
 *
 * Pure deterministic functions — no I/O.
 */

import type { CalculatorResult } from 'afenda-canon';

export type DefinedBenefitCostResult = {
  /** Current service cost + interest cost - expected return on plan assets */
  netPeriodCostMinor: number;
  serviceCostMinor: number;
  netInterestMinor: number;
  explanation: string;
};

export type RemeasurementResult = {
  /** Net defined benefit liability (DBO - plan assets) */
  netLiabilityMinor: number;
  /** Actuarial gain (negative) or loss (positive) */
  actuarialGainLossMinor: number;
  /** Remeasurements go to OCI per IAS 19.120 */
  recogniseTo: 'oci';
  explanation: string;
};

/**
 * IAS 19.66–69 — Compute defined-benefit cost for the period.
 *
 * Period cost = Current service cost + Net interest on net defined benefit liability/asset.
 * Net interest = (DBO - plan assets) × discount rate.
 */
export function computeDefinedBenefitCost(inputs: {
  serviceCostMinor: number;
  interestCostMinor: number;
  expectedReturnMinor: number;
}): CalculatorResult<DefinedBenefitCostResult> {
  const { serviceCostMinor, interestCostMinor, expectedReturnMinor } = inputs;
  const netInterestMinor = interestCostMinor - expectedReturnMinor;
  const netPeriodCostMinor = serviceCostMinor + netInterestMinor;

  const explanation = `Service cost ${serviceCostMinor} + net interest ${netInterestMinor} = total ${netPeriodCostMinor} (IAS 19.120)`;
  return {
    result: {
      netPeriodCostMinor,
      serviceCostMinor,
      netInterestMinor,
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}

/**
 * IAS 19.120–130 — Remeasure the net defined benefit obligation.
 *
 * Actuarial gains/losses are recognised in OCI (never recycled to P&L).
 */
export function remeasureObligation(inputs: {
  dboMinor: number;
  planAssetsMinor: number;
  prevNetLiabilityMinor: number;
  periodCostMinor: number;
  contributionsMinor: number;
}): RemeasurementResult {
  const { dboMinor, planAssetsMinor, prevNetLiabilityMinor, periodCostMinor, contributionsMinor } =
    inputs;
  const netLiabilityMinor = dboMinor - planAssetsMinor;
  const expectedNetLiability = prevNetLiabilityMinor + periodCostMinor - contributionsMinor;
  const actuarialGainLossMinor = netLiabilityMinor - expectedNetLiability;

  const explanation = `DBO ${dboMinor} - assets ${planAssetsMinor} = net liability ${netLiabilityMinor}; actuarial ${actuarialGainLossMinor > 0 ? 'loss' : 'gain'} ${Math.abs(actuarialGainLossMinor)} → OCI (IAS 19.120)`;
  return {
    result: {
      netLiabilityMinor,
      actuarialGainLossMinor,
      recogniseTo: 'oci',
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}
