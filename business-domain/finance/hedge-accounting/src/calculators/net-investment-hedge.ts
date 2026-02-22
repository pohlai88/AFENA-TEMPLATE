/**
 * IFRS 9.6.5.13 — Net Investment Hedge
 *
 * Computes the effective and ineffective portions of a hedge of a
 * net investment in a foreign operation, with the effective portion
 * recognised in OCI (CTA) and ineffective in P&L.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type NetInvestmentHedgeInput = {
  designationId: string;
  hedgingInstrumentFvChangeMinor: number;
  netInvestmentFvChangeMinor: number;
  hedgeRatio: number;
};

export type NetInvestmentHedgeResult = {
  effectivePortionMinor: number;
  ineffectivePortionMinor: number;
  recogniseToOci: number;
  recogniseToPnl: number;
  explanation: string;
};

export function computeNetInvestmentHedge(
  inputs: NetInvestmentHedgeInput,
): CalculatorResult<NetInvestmentHedgeResult> {
  const { hedgingInstrumentFvChangeMinor, netInvestmentFvChangeMinor, hedgeRatio } = inputs;

  if (hedgeRatio <= 0 || hedgeRatio > 1) throw new DomainError('VALIDATION_FAILED', 'Hedge ratio must be between 0 and 1');

  const adjustedHedgedChange = Math.round(netInvestmentFvChangeMinor * hedgeRatio);
  const absInstrument = Math.abs(hedgingInstrumentFvChangeMinor);
  const absHedged = Math.abs(adjustedHedgedChange);

  const effectivePortionMinor = Math.min(absInstrument, absHedged);
  const ineffectivePortionMinor = absInstrument - effectivePortionMinor;

  const signedEffective = hedgingInstrumentFvChangeMinor < 0 ? -effectivePortionMinor : effectivePortionMinor;

  const explanation =
    `Net investment hedge (IFRS 9.6.5.13): instrument change ${hedgingInstrumentFvChangeMinor}, ` +
    `hedged change ${adjustedHedgedChange}, effective ${effectivePortionMinor} → OCI/CTA, ` +
    `ineffective ${ineffectivePortionMinor} → P&L`;

  return {
    result: {
      effectivePortionMinor,
      ineffectivePortionMinor,
      recogniseToOci: signedEffective,
      recogniseToPnl: hedgingInstrumentFvChangeMinor < 0 ? -ineffectivePortionMinor : ineffectivePortionMinor,
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}
