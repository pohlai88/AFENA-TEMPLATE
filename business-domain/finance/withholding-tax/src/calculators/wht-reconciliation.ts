/**
 * WHT Reconciliation
 *
 * Reconciles withholding tax deducted against certificates issued
 * and remittances made to identify discrepancies.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type WhtReconciliationInput = {
  totalDeductedMinor: number;
  totalCertificatesIssuedMinor: number;
  totalRemittedMinor: number;
  taxPeriod: string;
};

export type WhtReconciliationResult = {
  deductedVsCertifiedDiffMinor: number;
  certifiedVsRemittedDiffMinor: number;
  isReconciled: boolean;
  discrepancies: string[];
  explanation: string;
};

export function computeWhtReconciliation(
  inputs: WhtReconciliationInput,
): CalculatorResult<WhtReconciliationResult> {
  const { totalDeductedMinor, totalCertificatesIssuedMinor, totalRemittedMinor, taxPeriod } = inputs;

  if (totalDeductedMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Total deducted cannot be negative');

  const deductedVsCertifiedDiffMinor = totalDeductedMinor - totalCertificatesIssuedMinor;
  const certifiedVsRemittedDiffMinor = totalCertificatesIssuedMinor - totalRemittedMinor;

  const discrepancies: string[] = [];
  if (deductedVsCertifiedDiffMinor !== 0) {
    discrepancies.push(`Deducted vs certified: ${deductedVsCertifiedDiffMinor}`);
  }
  if (certifiedVsRemittedDiffMinor !== 0) {
    discrepancies.push(`Certified vs remitted: ${certifiedVsRemittedDiffMinor}`);
  }

  const isReconciled = discrepancies.length === 0;

  const explanation = isReconciled
    ? `WHT reconciliation ${taxPeriod}: fully reconciled — deducted ${totalDeductedMinor} = certified = remitted`
    : `WHT reconciliation ${taxPeriod}: ${discrepancies.length} discrepancies — ${discrepancies.join('; ')}`;

  return {
    result: { deductedVsCertifiedDiffMinor, certifiedVsRemittedDiffMinor, isReconciled, discrepancies, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
