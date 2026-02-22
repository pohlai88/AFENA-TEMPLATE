import type { CalculatorResult } from 'afenda-canon';

/**
 * IAS 40 Investment Property Calculators
 *
 * Pure deterministic functions — no I/O.
 */

export type InvPropertyMeasurementResult = {
  carryingMinor: number;
  gainLossMinor: number;
  recogniseTo: 'pnl' | 'none';
  model: 'fair-value' | 'cost';
  explanation: string;
};

export type TransferAdjustmentResult = {
  transferValueMinor: number;
  revaluationSurplusMinor: number;
  explanation: string;
};

/**
 * IAS 40.33–55 — Measure investment property under chosen model.
 *
 * Fair-value model: changes recognised in P&L.
 * Cost model: carried at cost less depreciation/impairment (no gain here).
 */
export function measureInvestmentProperty(inputs: {
  model: 'fair-value' | 'cost';
  prevValueMinor: number;
  currValueMinor: number;
}): CalculatorResult<InvPropertyMeasurementResult> {
  const { model, prevValueMinor, currValueMinor } = inputs;

  if (model === 'fair-value') {
    const gainLossMinor = currValueMinor - prevValueMinor;
    const explanation = `FV model: carrying ${currValueMinor}, gain/loss ${gainLossMinor} → P&L (IAS 40.35)`;
    return {
      result: {
        carryingMinor: currValueMinor,
        gainLossMinor,
        recogniseTo: 'pnl',
        model,
        explanation,
      },
      inputs,
      explanation,
    };
  }

  // Cost model — no FV gain/loss
  const explanation = `Cost model: carrying ${currValueMinor}, no FV gain/loss (IAS 40.56)`;
  return {
    result: {
      carryingMinor: currValueMinor,
      gainLossMinor: 0,
      recogniseTo: 'none',
      model,
      explanation,
    },
    inputs,
    explanation,
  };
}

/**
 * IAS 40.57–64 — Transfer to/from investment property.
 *
 * When transferring from owner-occupied to IP under fair-value model,
 * any uplift above carrying goes to revaluation surplus (IAS 40.61).
 */
export function calculateTransferAdjustment(inputs: {
  direction: 'to-investment' | 'from-investment';
  carryingMinor: number;
  fairValueMinor: number;
}): CalculatorResult<TransferAdjustmentResult> {
  const { direction, carryingMinor, fairValueMinor } = inputs;

  if (direction === 'to-investment') {
    const revaluationSurplusMinor = Math.max(0, fairValueMinor - carryingMinor);
    const explanation = `Transfer to IP at FV ${fairValueMinor}; surplus ${revaluationSurplusMinor} (IAS 40.61)`;
    return {
      result: { transferValueMinor: fairValueMinor, revaluationSurplusMinor, explanation },
      inputs,
      explanation,
    };
  }

  // From investment property — transfer at FV (which becomes deemed cost for new category)
  const explanation = `Transfer from IP at FV ${fairValueMinor} → deemed cost (IAS 40.60)`;
  return {
    result: { transferValueMinor: fairValueMinor, revaluationSurplusMinor: 0, explanation },
    inputs,
    explanation,
  };
}
