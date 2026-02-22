import { describe, expect, it } from 'vitest';
import { evaluateDevCapitalization } from '../calculators/dev-capitalization';

describe('evaluateDevCapitalization', () => {
  it('capitalizes when all 6 criteria met', () => {
    const r = evaluateDevCapitalization({ projectId: 'P1', technicalFeasibility: true, intentionToComplete: true, abilityToUseOrSell: true, futureEconomicBenefits: true, adequateResources: true, reliableMeasurement: true, totalCostMinor: 50000 });
    expect(r.result.allCriteriaMet).toBe(true);
    expect(r.result.capitalizeMinor).toBe(50000);
    expect(r.result.expenseMinor).toBe(0);
  });

  it('expenses when any criterion fails', () => {
    const r = evaluateDevCapitalization({ projectId: 'P2', technicalFeasibility: true, intentionToComplete: true, abilityToUseOrSell: false, futureEconomicBenefits: true, adequateResources: true, reliableMeasurement: true, totalCostMinor: 30000 });
    expect(r.result.allCriteriaMet).toBe(false);
    expect(r.result.capitalizeMinor).toBe(0);
    expect(r.result.expenseMinor).toBe(30000);
    expect(r.result.failedCriteria).toContain('Ability to use or sell');
  });

  it('throws on negative cost', () => {
    expect(() => evaluateDevCapitalization({ projectId: 'P3', technicalFeasibility: true, intentionToComplete: true, abilityToUseOrSell: true, futureEconomicBenefits: true, adequateResources: true, reliableMeasurement: true, totalCostMinor: -1 })).toThrow();
  });
});
