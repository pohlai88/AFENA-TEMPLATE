/**
 * IFRS 9.5.5.3-5 — ECL Stage Transition
 *
 * Determines the expected credit loss stage for a financial instrument
 * based on changes in credit risk since initial recognition.
 * Stage 1: 12-month ECL, Stage 2: lifetime ECL, Stage 3: credit-impaired.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type EclStageTransitionInput = {
  instrumentId: string;
  currentStage: 1 | 2 | 3;
  initialCreditRating: number;
  currentCreditRating: number;
  daysPastDue: number;
  isDefaulted: boolean;
  significantIncreaseThreshold: number;
};

export type EclStageTransitionResult = {
  newStage: 1 | 2 | 3;
  stageChanged: boolean;
  direction: 'upgrade' | 'downgrade' | 'unchanged';
  eclBasis: '12-month' | 'lifetime';
  explanation: string;
};

export function evaluateEclStageTransition(
  inputs: EclStageTransitionInput,
): CalculatorResult<EclStageTransitionResult> {
  const {
    currentStage, initialCreditRating, currentCreditRating,
    daysPastDue, isDefaulted, significantIncreaseThreshold,
  } = inputs;

  if (currentStage < 1 || currentStage > 3) {
    throw new DomainError('VALIDATION_FAILED', 'Current stage must be 1, 2, or 3');
  }

  let newStage: 1 | 2 | 3;

  if (isDefaulted || daysPastDue > 90) {
    newStage = 3;
  } else {
    const ratingDeterioration = currentCreditRating - initialCreditRating;
    if (ratingDeterioration >= significantIncreaseThreshold || daysPastDue > 30) {
      newStage = 2;
    } else {
      newStage = 1;
    }
  }

  const stageChanged = newStage !== currentStage;
  const direction: EclStageTransitionResult['direction'] = newStage > currentStage
    ? 'downgrade'
    : newStage < currentStage
      ? 'upgrade'
      : 'unchanged';

  const eclBasis: EclStageTransitionResult['eclBasis'] = newStage === 1 ? '12-month' : 'lifetime';

  const explanation = stageChanged
    ? `ECL stage transition (IFRS 9.5.5.3): stage ${currentStage} → ${newStage} (${direction}), ECL basis: ${eclBasis}`
    : `ECL stage unchanged at ${currentStage}, ECL basis: ${eclBasis}`;

  return {
    result: { newStage, stageChanged, direction, eclBasis, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
