import { describe, expect, it } from 'vitest';

import { evaluateEclStageTransition } from '../calculators/ecl-stage-transition';

describe('evaluateEclStageTransition', () => {
  it('downgrades to stage 3 when defaulted', () => {
    const { result } = evaluateEclStageTransition({
      instrumentId: 'fi-1', currentStage: 1,
      initialCreditRating: 3, currentCreditRating: 8,
      daysPastDue: 0, isDefaulted: true, significantIncreaseThreshold: 3,
    });
    expect(result.newStage).toBe(3);
    expect(result.stageChanged).toBe(true);
    expect(result.direction).toBe('downgrade');
    expect(result.eclBasis).toBe('lifetime');
  });

  it('downgrades to stage 3 when >90 DPD', () => {
    const { result } = evaluateEclStageTransition({
      instrumentId: 'fi-1', currentStage: 2,
      initialCreditRating: 3, currentCreditRating: 5,
      daysPastDue: 95, isDefaulted: false, significantIncreaseThreshold: 3,
    });
    expect(result.newStage).toBe(3);
    expect(result.eclBasis).toBe('lifetime');
  });

  it('downgrades to stage 2 on significant credit deterioration', () => {
    const { result } = evaluateEclStageTransition({
      instrumentId: 'fi-1', currentStage: 1,
      initialCreditRating: 3, currentCreditRating: 7,
      daysPastDue: 10, isDefaulted: false, significantIncreaseThreshold: 3,
    });
    expect(result.newStage).toBe(2);
    expect(result.direction).toBe('downgrade');
  });

  it('stays at stage 1 when no deterioration', () => {
    const { result } = evaluateEclStageTransition({
      instrumentId: 'fi-1', currentStage: 1,
      initialCreditRating: 3, currentCreditRating: 4,
      daysPastDue: 5, isDefaulted: false, significantIncreaseThreshold: 3,
    });
    expect(result.newStage).toBe(1);
    expect(result.stageChanged).toBe(false);
    expect(result.eclBasis).toBe('12-month');
  });

  it('upgrades from stage 2 to 1 when credit improves', () => {
    const { result } = evaluateEclStageTransition({
      instrumentId: 'fi-1', currentStage: 2,
      initialCreditRating: 3, currentCreditRating: 4,
      daysPastDue: 0, isDefaulted: false, significantIncreaseThreshold: 3,
    });
    expect(result.newStage).toBe(1);
    expect(result.direction).toBe('upgrade');
  });
});
