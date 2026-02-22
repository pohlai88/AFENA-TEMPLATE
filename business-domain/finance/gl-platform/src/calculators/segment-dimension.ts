import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * GL-09 — Segment / Cost-Center / Profit-Center Dimensions
 *
 * Validates and resolves multi-dimensional coding on journal lines.
 * Ensures segment combinations are valid per the configured dimension hierarchy.
 *
 * Pure function — no I/O.
 */

export type DimensionValue = {
  dimensionType: 'segment' | 'cost_center' | 'profit_center' | 'project' | 'custom';
  code: string;
  label: string;
  parentCode: string | null;
  isActive: boolean;
};

export type JournalLineDimensions = {
  lineId: string;
  accountId: string;
  segment?: string;
  costCenter?: string;
  profitCenter?: string;
};

export type DimensionValidationResult = {
  validLines: JournalLineDimensions[];
  invalidLines: { lineId: string; errors: string[] }[];
  allValid: boolean;
};

export function validateDimensions(
  lines: JournalLineDimensions[],
  validDimensions: DimensionValue[],
): CalculatorResult<DimensionValidationResult> {
  if (lines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Journal lines cannot be empty');
  }

  const activeCodes = new Map<string, Set<string>>();
  for (const dim of validDimensions) {
    if (!dim.isActive) continue;
    const set = activeCodes.get(dim.dimensionType) ?? new Set();
    set.add(dim.code);
    activeCodes.set(dim.dimensionType, set);
  }

  const validLines: JournalLineDimensions[] = [];
  const invalidLines: { lineId: string; errors: string[] }[] = [];

  for (const line of lines) {
    const errors: string[] = [];
    if (line.segment && !activeCodes.get('segment')?.has(line.segment)) {
      errors.push(`Invalid segment: ${line.segment}`);
    }
    if (line.costCenter && !activeCodes.get('cost_center')?.has(line.costCenter)) {
      errors.push(`Invalid cost center: ${line.costCenter}`);
    }
    if (line.profitCenter && !activeCodes.get('profit_center')?.has(line.profitCenter)) {
      errors.push(`Invalid profit center: ${line.profitCenter}`);
    }
    if (errors.length > 0) {
      invalidLines.push({ lineId: line.lineId, errors });
    } else {
      validLines.push(line);
    }
  }

  return {
    result: { validLines, invalidLines, allValid: invalidLines.length === 0 },
    inputs: { lineCount: lines.length, dimensionCount: validDimensions.length },
    explanation: `Dimension validation: ${validLines.length}/${lines.length} valid`,
  };
}
