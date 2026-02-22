/**
 * WHT Remittance Calculation
 *
 * Aggregates withholding tax certificates for a tax period into
 * a remittance batch for submission to the tax authority.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type WhtCertificateForRemittance = {
  certificateNo: string;
  whtAmountMinor: number;
  whtCode: string;
  supplierId: string;
};

export type WhtRemittanceInput = {
  taxPeriod: string;
  taxAuthority: string;
  certificates: WhtCertificateForRemittance[];
};

export type WhtRemittanceResult = {
  totalRemittanceMinor: number;
  certificateCount: number;
  byCode: Array<{ whtCode: string; totalMinor: number; count: number }>;
  explanation: string;
};

export function computeWhtRemittance(
  inputs: WhtRemittanceInput,
): CalculatorResult<WhtRemittanceResult> {
  const { taxPeriod, taxAuthority, certificates } = inputs;

  if (certificates.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one certificate required');

  const totalRemittanceMinor = certificates.reduce((s, c) => s + c.whtAmountMinor, 0);

  const codeMap = new Map<string, { totalMinor: number; count: number }>();
  for (const cert of certificates) {
    const existing = codeMap.get(cert.whtCode) ?? { totalMinor: 0, count: 0 };
    existing.totalMinor += cert.whtAmountMinor;
    existing.count += 1;
    codeMap.set(cert.whtCode, existing);
  }

  const byCode = [...codeMap.entries()].map(([whtCode, data]) => ({
    whtCode,
    totalMinor: data.totalMinor,
    count: data.count,
  }));

  const explanation =
    `WHT remittance for ${taxPeriod} to ${taxAuthority}: ${totalRemittanceMinor} ` +
    `from ${certificates.length} certificates across ${byCode.length} codes`;

  return {
    result: { totalRemittanceMinor, certificateCount: certificates.length, byCode, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
