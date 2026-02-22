/**
 * IAS 36.126-137 — Impairment Disclosure Computation
 *
 * Computes the disclosure amounts for impairment losses recognised
 * and reversed during the period, by class of asset and CGU.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type ImpairmentEvent = {
  assetId: string;
  assetClass: 'ppe' | 'intangible' | 'goodwill' | 'rou';
  lossMinor: number;
  reversalMinor: number;
  cguId?: string;
};

export type ImpairmentDisclosureInput = {
  events: ImpairmentEvent[];
};

export type ImpairmentDisclosureResult = {
  totalLossesMinor: number;
  totalReversalsMinor: number;
  netImpairmentMinor: number;
  byClass: Array<{
    assetClass: string;
    lossMinor: number;
    reversalMinor: number;
    netMinor: number;
    count: number;
  }>;
  explanation: string;
};

export function computeImpairmentDisclosure(
  inputs: ImpairmentDisclosureInput,
): CalculatorResult<ImpairmentDisclosureResult> {
  const { events } = inputs;

  if (events.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one impairment event required');

  const totalLossesMinor = events.reduce((s, e) => s + e.lossMinor, 0);
  const totalReversalsMinor = events.reduce((s, e) => s + e.reversalMinor, 0);
  const netImpairmentMinor = totalLossesMinor - totalReversalsMinor;

  const classMap = new Map<string, { lossMinor: number; reversalMinor: number; count: number }>();
  for (const e of events) {
    const existing = classMap.get(e.assetClass) ?? { lossMinor: 0, reversalMinor: 0, count: 0 };
    existing.lossMinor += e.lossMinor;
    existing.reversalMinor += e.reversalMinor;
    existing.count += 1;
    classMap.set(e.assetClass, existing);
  }

  const byClass = [...classMap.entries()].map(([assetClass, data]) => ({
    assetClass,
    lossMinor: data.lossMinor,
    reversalMinor: data.reversalMinor,
    netMinor: data.lossMinor - data.reversalMinor,
    count: data.count,
  }));

  const explanation =
    `Impairment disclosure (IAS 36.126): losses ${totalLossesMinor}, reversals ${totalReversalsMinor}, ` +
    `net ${netImpairmentMinor} across ${events.length} events in ${byClass.length} classes`;

  return {
    result: { totalLossesMinor, totalReversalsMinor, netImpairmentMinor, byClass, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
