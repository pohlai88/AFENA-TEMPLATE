import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see IA-01 — Recognition criteria: identifiable, controlled, future econo
 * @see IA-02 — Research phase → expense always
 * @see IA-07 — Computer software: capitalize development, expense research
 * IA-03 — Development Phase Capitalization Criteria (IAS 38 §57)
 *
 * Evaluates 6 criteria for capitalizing development costs.
 * Pure function — no I/O.
 */

export type DevCapitalizationInput = {
  projectId: string;
  technicalFeasibility: boolean;
  intentionToComplete: boolean;
  abilityToUseOrSell: boolean;
  futureEconomicBenefits: boolean;
  adequateResources: boolean;
  reliableMeasurement: boolean;
  totalCostMinor: number;
};

export type DevCapitalizationResult = { projectId: string; allCriteriaMet: boolean; criteriaMetCount: number; capitalizeMinor: number; expenseMinor: number; failedCriteria: string[] };

export function evaluateDevCapitalization(input: DevCapitalizationInput): CalculatorResult<DevCapitalizationResult> {
  if (input.totalCostMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Cost must be non-negative');
  const criteria: [string, boolean][] = [
    ['Technical feasibility', input.technicalFeasibility], ['Intention to complete', input.intentionToComplete],
    ['Ability to use or sell', input.abilityToUseOrSell], ['Future economic benefits', input.futureEconomicBenefits],
    ['Adequate resources', input.adequateResources], ['Reliable measurement', input.reliableMeasurement],
  ];
  const failedCriteria = criteria.filter(([, met]) => !met).map(([name]) => name);
  const allCriteriaMet = failedCriteria.length === 0;
  return { result: { projectId: input.projectId, allCriteriaMet, criteriaMetCount: 6 - failedCriteria.length, capitalizeMinor: allCriteriaMet ? input.totalCostMinor : 0, expenseMinor: allCriteriaMet ? 0 : input.totalCostMinor, failedCriteria }, inputs: input, explanation: `Dev capitalization: ${allCriteriaMet ? 'CAPITALIZE' : 'EXPENSE'} ${input.totalCostMinor}, ${failedCriteria.length} criteria failed` };
}
