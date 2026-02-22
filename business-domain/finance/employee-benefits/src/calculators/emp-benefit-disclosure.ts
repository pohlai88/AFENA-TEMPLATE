/**
 * IAS 19.120 — Employee Benefit Disclosure Computation
 *
 * Computes the disclosure amounts for defined benefit plans:
 * DBO reconciliation, plan asset reconciliation, and net position.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type EmpBenefitDisclosureInput = {
  openingDboMinor: number;
  serviceCostMinor: number;
  interestCostMinor: number;
  actuarialGainLossMinor: number;
  benefitsPaidMinor: number;
  pastServiceCostMinor: number;
  openingPlanAssetsMinor: number;
  expectedReturnMinor: number;
  contributionsMinor: number;
  assetRemeasurementMinor: number;
};

export type EmpBenefitDisclosureResult = {
  closingDboMinor: number;
  closingPlanAssetsMinor: number;
  netDefinedBenefitMinor: number;
  isFunded: boolean;
  fundingRatioPct: string;
  explanation: string;
};

export function computeEmpBenefitDisclosure(
  inputs: EmpBenefitDisclosureInput,
): CalculatorResult<EmpBenefitDisclosureResult> {
  const {
    openingDboMinor, serviceCostMinor, interestCostMinor, actuarialGainLossMinor,
    benefitsPaidMinor, pastServiceCostMinor, openingPlanAssetsMinor,
    expectedReturnMinor, contributionsMinor, assetRemeasurementMinor,
  } = inputs;

  if (openingDboMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Opening DBO cannot be negative');

  const closingDboMinor =
    openingDboMinor + serviceCostMinor + interestCostMinor +
    actuarialGainLossMinor - benefitsPaidMinor + pastServiceCostMinor;

  const closingPlanAssetsMinor =
    openingPlanAssetsMinor + expectedReturnMinor + contributionsMinor +
    assetRemeasurementMinor - benefitsPaidMinor;

  const netDefinedBenefitMinor = closingDboMinor - closingPlanAssetsMinor;
  const isFunded = closingPlanAssetsMinor > 0;
  const fundingRatio = closingDboMinor > 0 ? closingPlanAssetsMinor / closingDboMinor : 0;

  const explanation =
    `Employee benefit disclosure (IAS 19.120): DBO ${closingDboMinor}, ` +
    `plan assets ${closingPlanAssetsMinor}, net ${netDefinedBenefitMinor}, ` +
    `funding ratio ${(fundingRatio * 100).toFixed(1)}%`;

  return {
    result: {
      closingDboMinor,
      closingPlanAssetsMinor,
      netDefinedBenefitMinor,
      isFunded,
      fundingRatioPct: `${(fundingRatio * 100).toFixed(1)}%`,
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}
