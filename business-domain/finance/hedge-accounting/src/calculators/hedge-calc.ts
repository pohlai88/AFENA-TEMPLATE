import type { CalculatorResult } from 'afenda-canon';

/**
 * @see FX-05 — Hedge accounting entries (fair value / cash flow / net investment)
 * @see HA-01 — Hedge designation: qualifying criteria (IFRS 9 §6.4.1)
 * @see HA-02 — Prospective effectiveness test (economic relationship)
 * @see HA-03 — Retrospective effectiveness measurement (dollar-offset / regression)
 * @see HA-04 — Cash flow hedge: OCI movement + reclassification to P&L
 * @see HA-07 — Fair value hedge: hedged item + instrument P&L offset
 * @see HA-09 — Hedge ratio rebalancing (IFRS 9 §6.5.5)
 * @see HA-10 — Net investment hedge (IAS 21 + IFRS 9 §6.5.13)
 *
 * IFRS 9 §6 Hedge Accounting Calculators
 *
 * Pure deterministic functions — no I/O, no side effects.
 */

export type EffectivenessResult = {
  ratio: number;
  isEffective: boolean;
  explanation: string;
};

export type OciMovementResult = {
  /**
   * Amount to recognise in OCI (minor units).
   * Positive = gain in OCI; negative = loss in OCI.
   */
  ociAmountMinor: number;
  /**
   * Amount to reclassify from OCI to P&L (minor units).
   */
  reclassToPlMinor: number;
  explanation: string;
};

/**
 * IFRS 9 §6.4.1(c)(iii) — Prospective / retrospective effectiveness test.
 *
 * Dollar-offset method:
 *   ratio = hedge_instrument_change / hedged_item_change
 *
 * Effective if ratio is within the 80 – 125% corridor.
 */
export function testEffectiveness(inputs: {
  hedgingInstrumentChangeMinor: number;
  hedgedItemChangeMinor: number;
}): CalculatorResult<EffectivenessResult> {
  const { hedgingInstrumentChangeMinor, hedgedItemChangeMinor } = inputs;

  if (hedgedItemChangeMinor === 0) {
    const explanation =
      hedgingInstrumentChangeMinor === 0
        ? 'Both zero — trivially effective'
        : 'Hedged item zero but instrument non-zero — ineffective';
    return {
      result: {
        ratio: 0,
        isEffective: hedgingInstrumentChangeMinor === 0,
        explanation,
      },
      inputs: { hedgingInstrumentChangeMinor, hedgedItemChangeMinor },
      explanation,
    };
  }

  // Dollar-offset: instrument ÷ item (absolute for opposing signs)
  const ratio = Math.abs(hedgingInstrumentChangeMinor / hedgedItemChangeMinor);
  const isEffective = ratio >= 0.8 && ratio <= 1.25;

  const explanation = isEffective
    ? `Ratio ${(ratio * 100).toFixed(2)}% — within 80-125% corridor`
    : `Ratio ${(ratio * 100).toFixed(2)}% — outside 80-125% corridor → discontinue`;
  return {
    result: {
      ratio: Math.round(ratio * 10_000) / 10_000, // 4 dp
      isEffective,
      explanation,
    },
    inputs: { hedgingInstrumentChangeMinor, hedgedItemChangeMinor },
    explanation,
  };
}

/**
 * Computes OCI movement for a cash-flow hedge.
 *
 * The "lower of" test (IFRS 9 §6.5.11):
 *   OCI = min(abs(cumulative instrument gain), abs(cumulative hedged item loss))
 *   with the sign of the hedging instrument.
 *
 * Any excess is the ineffective portion → P&L.
 */
export function computeOciMovement(inputs: {
  cumulativeInstrumentMinor: number;
  cumulativeHedgedItemMinor: number;
}): CalculatorResult<OciMovementResult> {
  const { cumulativeInstrumentMinor, cumulativeHedgedItemMinor } = inputs;

  const absInstrument = Math.abs(cumulativeInstrumentMinor);
  const absHedgedItem = Math.abs(cumulativeHedgedItemMinor);

  const ociAbsolute = Math.min(absInstrument, absHedgedItem);
  const sign = cumulativeInstrumentMinor >= 0 ? 1 : -1;
  const ociAmountMinor = ociAbsolute * sign;
  const reclassToPlMinor = cumulativeInstrumentMinor - ociAmountMinor;

  const explanation = `OCI: ${ociAmountMinor} (lower-of test), ineffective → P&L: ${reclassToPlMinor}`;
  return {
    result: {
      ociAmountMinor,
      reclassToPlMinor,
      explanation,
    },
    inputs: { cumulativeInstrumentMinor, cumulativeHedgedItemMinor },
    explanation,
  };
}
