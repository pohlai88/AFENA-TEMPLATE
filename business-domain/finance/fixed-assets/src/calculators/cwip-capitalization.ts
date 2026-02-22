import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * FA-10 — Capital Work-in-Progress (CWIP) → Asset Capitalization
 *
 * Tracks accumulated costs on a CWIP project and determines when
 * capitalization criteria are met (IAS 16.7 recognition criteria).
 *
 * Pure function — no I/O.
 */

export type CwipCostLine = {
  costLineId: string;
  description: string;
  amountMinor: number;
  costDate: string;
  costCategory: 'material' | 'labour' | 'overhead' | 'borrowing' | 'other';
};

export type CapitalizationResult = {
  cwipProjectId: string;
  totalAccumulatedMinor: number;
  costBreakdown: Record<CwipCostLine['costCategory'], number>;
  readyToCapitalize: boolean;
  assetCostMinor: number;
  capitalizationDate: string | null;
};

export type CapitalizationInput = {
  cwipProjectId: string;
  costLines: CwipCostLine[];
  isReadyForUse: boolean;
  targetCapitalizationDate?: string;
};

/**
 * Evaluate CWIP project for capitalization.
 *
 * IAS 16.7: An item of PPE shall be recognised as an asset when:
 * (a) it is probable that future economic benefits will flow to the entity; and
 * (b) the cost can be measured reliably.
 *
 * Capitalization occurs when the asset is ready for its intended use.
 */
export function evaluateCwipCapitalization(
  input: CapitalizationInput,
): CalculatorResult<CapitalizationResult> {
  if (input.costLines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'CWIP project must have at least one cost line');
  }

  const breakdown: Record<CwipCostLine['costCategory'], number> = {
    material: 0,
    labour: 0,
    overhead: 0,
    borrowing: 0,
    other: 0,
  };

  let totalAccumulatedMinor = 0;
  for (const line of input.costLines) {
    if (line.amountMinor < 0) {
      throw new DomainError('VALIDATION_FAILED', `Negative cost not allowed: ${line.costLineId}`);
    }
    breakdown[line.costCategory] += line.amountMinor;
    totalAccumulatedMinor += line.amountMinor;
  }

  const readyToCapitalize = input.isReadyForUse && totalAccumulatedMinor > 0;

  return {
    result: {
      cwipProjectId: input.cwipProjectId,
      totalAccumulatedMinor,
      costBreakdown: breakdown,
      readyToCapitalize,
      assetCostMinor: readyToCapitalize ? totalAccumulatedMinor : 0,
      capitalizationDate: readyToCapitalize ? (input.targetCapitalizationDate ?? null) : null,
    },
    inputs: { cwipProjectId: input.cwipProjectId, lineCount: input.costLines.length, isReadyForUse: input.isReadyForUse },
    explanation: readyToCapitalize
      ? `CWIP ${input.cwipProjectId}: ready to capitalize ${totalAccumulatedMinor} minor units`
      : `CWIP ${input.cwipProjectId}: ${totalAccumulatedMinor} accumulated, not yet ready for use`,
  };
}
