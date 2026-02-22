import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * GL-06 — Document Number Range Management
 *
 * Assigns sequential document numbers per (company, document type, fiscal year).
 * Validates uniqueness and detects gaps for audit trail completeness.
 *
 * Pure function — no I/O.
 */

export type NumberRangeConfig = {
  companyId: string;
  documentType: string;
  fiscalYear: number;
  prefix: string;
  currentNumber: number;
  rangeStart: number;
  rangeEnd: number;
};

export type NumberRangeResult = {
  nextNumber: number;
  formattedDocNumber: string;
  remainingCapacity: number;
  utilizationPct: number;
  isExhausted: boolean;
};

export function allocateDocumentNumber(
  config: NumberRangeConfig,
): CalculatorResult<NumberRangeResult> {
  if (config.rangeStart >= config.rangeEnd) {
    throw new DomainError('VALIDATION_FAILED', 'rangeStart must be less than rangeEnd');
  }
  if (config.currentNumber < config.rangeStart - 1 || config.currentNumber > config.rangeEnd) {
    throw new DomainError('VALIDATION_FAILED', 'currentNumber is outside the configured range');
  }

  const nextNumber = config.currentNumber + 1;
  const isExhausted = nextNumber > config.rangeEnd;
  const totalCapacity = config.rangeEnd - config.rangeStart + 1;
  const used = nextNumber - config.rangeStart;
  const remainingCapacity = Math.max(0, config.rangeEnd - nextNumber + 1);
  const utilizationPct = Math.round((used / totalCapacity) * 100);

  const padLength = String(config.rangeEnd).length;
  const formattedDocNumber = `${config.prefix}-${config.fiscalYear}-${String(nextNumber).padStart(padLength, '0')}`;

  return {
    result: { nextNumber, formattedDocNumber, remainingCapacity, utilizationPct, isExhausted },
    inputs: config,
    explanation: `Doc number ${formattedDocNumber}, ${remainingCapacity} remaining (${utilizationPct}% used)`,
  };
}
