import { describe, expect, it } from 'vitest';

import { computeWhtCertificate } from '../calculators/wht-certificate-generation';
import { computeWhtRemittance } from '../calculators/wht-remittance-calc';
import { evaluateWhtExemption } from '../calculators/wht-exemption-check';
import { computeWhtReconciliation } from '../calculators/wht-reconciliation';

describe('computeWhtCertificate', () => {
  it('computes WHT amount and net payable', () => {
    const { result } = computeWhtCertificate({
      grossAmountMinor: 100_000, whtRate: 0.10, whtCode: 'WHT-SVC',
      supplierId: 's1', taxPeriod: '2025-P06', incomeType: 'services',
    });
    expect(result.whtAmountMinor).toBe(10_000);
    expect(result.netPayableMinor).toBe(90_000);
    expect(result.effectiveRatePct).toBe('10.00%');
  });

  it('throws on zero gross amount', () => {
    expect(() => computeWhtCertificate({
      grossAmountMinor: 0, whtRate: 0.10, whtCode: 'WHT-SVC',
      supplierId: 's1', taxPeriod: '2025-P06', incomeType: 'services',
    })).toThrow('Gross amount must be positive');
  });
});

describe('computeWhtRemittance', () => {
  it('aggregates certificates by code', () => {
    const { result } = computeWhtRemittance({
      taxPeriod: '2025-P06', taxAuthority: 'LHDN',
      certificates: [
        { certificateNo: 'C001', whtAmountMinor: 10_000, whtCode: 'WHT-SVC', supplierId: 's1' },
        { certificateNo: 'C002', whtAmountMinor: 5_000, whtCode: 'WHT-SVC', supplierId: 's2' },
        { certificateNo: 'C003', whtAmountMinor: 8_000, whtCode: 'WHT-INT', supplierId: 's3' },
      ],
    });
    expect(result.totalRemittanceMinor).toBe(23_000);
    expect(result.certificateCount).toBe(3);
    expect(result.byCode).toHaveLength(2);
  });

  it('throws on empty certificates', () => {
    expect(() => computeWhtRemittance({
      taxPeriod: '2025-P06', taxAuthority: 'LHDN', certificates: [],
    })).toThrow('At least one certificate');
  });
});

describe('evaluateWhtExemption', () => {
  it('exempts below threshold', () => {
    const { result } = evaluateWhtExemption({
      grossAmountMinor: 500, standardWhtRate: 0.10, supplierCountry: 'MY',
      hasTreatyRelief: false, hasExemptionCertificate: false, thresholdMinor: 1_000,
    });
    expect(result.isExempt).toBe(true);
    expect(result.whtAmountMinor).toBe(0);
  });

  it('applies treaty rate when available', () => {
    const { result } = evaluateWhtExemption({
      grossAmountMinor: 100_000, standardWhtRate: 0.15, supplierCountry: 'SG',
      hasTreatyRelief: true, treatyRate: 0.10,
      hasExemptionCertificate: false, thresholdMinor: 0,
    });
    expect(result.isExempt).toBe(false);
    expect(result.applicableRate).toBe(0.10);
    expect(result.whtAmountMinor).toBe(10_000);
  });

  it('exempts with certificate', () => {
    const { result } = evaluateWhtExemption({
      grossAmountMinor: 100_000, standardWhtRate: 0.15, supplierCountry: 'US',
      hasTreatyRelief: false, hasExemptionCertificate: true, thresholdMinor: 0,
    });
    expect(result.isExempt).toBe(true);
  });
});

describe('computeWhtReconciliation', () => {
  it('identifies reconciled state', () => {
    const { result } = computeWhtReconciliation({
      totalDeductedMinor: 50_000, totalCertificatesIssuedMinor: 50_000,
      totalRemittedMinor: 50_000, taxPeriod: '2025-P06',
    });
    expect(result.isReconciled).toBe(true);
    expect(result.discrepancies).toHaveLength(0);
  });

  it('identifies discrepancies', () => {
    const { result } = computeWhtReconciliation({
      totalDeductedMinor: 50_000, totalCertificatesIssuedMinor: 45_000,
      totalRemittedMinor: 40_000, taxPeriod: '2025-P06',
    });
    expect(result.isReconciled).toBe(false);
    expect(result.discrepancies).toHaveLength(2);
    expect(result.deductedVsCertifiedDiffMinor).toBe(5_000);
    expect(result.certifiedVsRemittedDiffMinor).toBe(5_000);
  });
});
