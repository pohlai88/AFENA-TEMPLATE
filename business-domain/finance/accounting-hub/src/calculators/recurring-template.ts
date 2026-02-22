import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * DE-07 — Recurring Journal Templates
 *
 * Generates journal entries from recurring templates with fixed or formula-based
 * amounts. Supports monthly/quarterly/annual frequency.
 *
 * Pure function — no I/O.
 */

export type RecurringTemplateLine = {
  accountId: string;
  debitMinor: number;
  creditMinor: number;
  description: string;
};

export type RecurringTemplate = {
  templateId: string;
  name: string;
  frequency: 'monthly' | 'quarterly' | 'annual';
  lines: RecurringTemplateLine[];
  lastRunPeriod: string | null;
  nextRunPeriod: string;
};

export type GeneratedJournal = {
  templateId: string;
  periodKey: string;
  lines: RecurringTemplateLine[];
  totalDebitMinor: number;
  totalCreditMinor: number;
  isBalanced: boolean;
};

export function generateFromTemplate(
  template: RecurringTemplate,
  targetPeriod: string,
): CalculatorResult<GeneratedJournal> {
  if (template.lines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Template must have at least one line');
  }

  const totalDebitMinor = template.lines.reduce((s, l) => s + l.debitMinor, 0);
  const totalCreditMinor = template.lines.reduce((s, l) => s + l.creditMinor, 0);
  const isBalanced = totalDebitMinor === totalCreditMinor;

  if (!isBalanced) {
    throw new DomainError('VALIDATION_FAILED', `Template is unbalanced: debits=${totalDebitMinor}, credits=${totalCreditMinor}`);
  }

  return {
    result: {
      templateId: template.templateId,
      periodKey: targetPeriod,
      lines: template.lines,
      totalDebitMinor,
      totalCreditMinor,
      isBalanced,
    },
    inputs: { templateId: template.templateId, targetPeriod },
    explanation: `Recurring journal from "${template.name}" for ${targetPeriod}: ${template.lines.length} lines, total ${totalDebitMinor}`,
  };
}
