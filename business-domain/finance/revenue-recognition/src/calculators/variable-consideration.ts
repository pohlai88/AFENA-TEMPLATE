import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * RR-06 — Variable Consideration Constraint (IFRS 15 §56)
 *
 * Estimates variable consideration using expected value or most likely amount,
 * then applies the constraint: include only to the extent it is highly probable
 * that a significant reversal will not occur.
 *
 * Pure function — no I/O.
 */

export type VariableComponent = {
  componentId: string;
  description: string;
  method: 'expected_value' | 'most_likely';
  scenarios: { amountMinor: number; probabilityPct: number }[];
  reversalRiskPct: number;
};

export type ConstrainedEstimate = {
  componentId: string;
  unconstrained: number;
  constrained: number;
  excluded: number;
  isConstrained: boolean;
};

export type VariableConsiderationResult = {
  estimates: ConstrainedEstimate[];
  totalUnconstrainedMinor: number;
  totalConstrainedMinor: number;
  totalExcludedMinor: number;
};

const HIGHLY_PROBABLE_THRESHOLD = 75;

export function estimateVariableConsideration(
  components: VariableComponent[],
): CalculatorResult<VariableConsiderationResult> {
  if (components.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one variable component required');
  }

  const estimates: ConstrainedEstimate[] = components.map((comp) => {
    let unconstrained: number;
    if (comp.method === 'expected_value') {
      unconstrained = Math.round(comp.scenarios.reduce((s, sc) => s + sc.amountMinor * (sc.probabilityPct / 100), 0));
    } else {
      const sorted = [...comp.scenarios].sort((a, b) => b.probabilityPct - a.probabilityPct);
      unconstrained = sorted[0]?.amountMinor ?? 0;
    }

    const isConstrained = comp.reversalRiskPct > (100 - HIGHLY_PROBABLE_THRESHOLD);
    const constrained = isConstrained ? 0 : unconstrained;
    const excluded = unconstrained - constrained;

    return { componentId: comp.componentId, unconstrained, constrained, excluded, isConstrained };
  });

  return {
    result: {
      estimates,
      totalUnconstrainedMinor: estimates.reduce((s, e) => s + e.unconstrained, 0),
      totalConstrainedMinor: estimates.reduce((s, e) => s + e.constrained, 0),
      totalExcludedMinor: estimates.reduce((s, e) => s + e.excluded, 0),
    },
    inputs: { componentCount: components.length },
    explanation: `Variable consideration: ${estimates.length} components, constrained=${estimates.filter((e) => e.isConstrained).length}`,
  };
}
