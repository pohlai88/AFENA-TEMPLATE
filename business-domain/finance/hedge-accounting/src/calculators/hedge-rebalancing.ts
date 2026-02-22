import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * HA-08 — Hedge Rebalancing (IFRS 9 §6.5.8)
 *
 * Adjusts hedge ratio without discontinuation when the hedging relationship
 * drifts from the designated ratio.
 * Pure function — no I/O.
 */

export type HedgeRebalanceInput = { hedgeId: string; designatedRatio: number; currentRatio: number; hedgedItemFvMinor: number; hedgingInstrumentFvMinor: number; tolerancePct: number };

export type HedgeRebalanceResult = { hedgeId: string; needsRebalancing: boolean; currentRatio: number; targetRatio: number; adjustmentMinor: number; newInstrumentFvMinor: number };

export function evaluateHedgeRebalancing(input: HedgeRebalanceInput): CalculatorResult<HedgeRebalanceResult> {
  if (input.designatedRatio <= 0) throw new DomainError('VALIDATION_FAILED', 'Designated ratio must be positive');
  const drift = Math.abs(input.currentRatio - input.designatedRatio) / input.designatedRatio * 100;
  const needsRebalancing = drift > input.tolerancePct;
  const targetInstrumentFv = Math.round(input.hedgedItemFvMinor * input.designatedRatio);
  const adjustmentMinor = targetInstrumentFv - input.hedgingInstrumentFvMinor;
  return { result: { hedgeId: input.hedgeId, needsRebalancing, currentRatio: input.currentRatio, targetRatio: input.designatedRatio, adjustmentMinor: needsRebalancing ? adjustmentMinor : 0, newInstrumentFvMinor: needsRebalancing ? targetInstrumentFv : input.hedgingInstrumentFvMinor }, inputs: input, explanation: `Hedge rebalance ${input.hedgeId}: drift=${drift.toFixed(1)}%, ${needsRebalancing ? 'REBALANCE' : 'OK'}` };
}
