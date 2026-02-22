import { describe, expect, it } from 'vitest';
import { evaluateApaCompliance } from '../calculators/apa-tracker';

describe('TP-06 — APA Tracker', () => {
  const baseInput = {
    apaId: 'APA-1',
    status: 'monitoring' as const,
    startDate: '2023-01-01',
    endDate: '2027-12-31',
    jurisdictions: ['US', 'NL'],
    coveredTransactions: [
      { transactionId: 'T1', description: 'Mgmt fees', agreedMethod: 'TNMM', agreedMarginPct: 8, actualMarginPct: 8.5 },
      { transactionId: 'T2', description: 'Royalties', agreedMethod: 'CUP', agreedMarginPct: 5, actualMarginPct: 3 },
    ],
    tolerancePct: 2,
  };

  it('evaluates compliance within tolerance', () => {
    const { result } = evaluateApaCompliance(baseInput);
    expect(result.complianceResults[0].compliant).toBe(true);
    expect(result.complianceResults[0].deviationPct).toBe(0.5);
  });

  it('flags non-compliant transactions', () => {
    const { result } = evaluateApaCompliance({ ...baseInput, tolerancePct: 1 });
    expect(result.complianceResults[1].compliant).toBe(false);
    expect(result.nonCompliantCount).toBe(1);
    expect(result.overallCompliant).toBe(false);
  });

  it('reports overall compliance when all pass', () => {
    const { result } = evaluateApaCompliance({ ...baseInput, tolerancePct: 5 });
    expect(result.overallCompliant).toBe(true);
    expect(result.nonCompliantCount).toBe(0);
  });

  it('returns CalculatorResult shape', () => {
    const res = evaluateApaCompliance(baseInput);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on missing apaId', () => {
    expect(() => evaluateApaCompliance({ ...baseInput, apaId: '' })).toThrow('apaId is required');
  });

  it('throws on empty jurisdictions', () => {
    expect(() => evaluateApaCompliance({ ...baseInput, jurisdictions: [] })).toThrow('At least one jurisdiction');
  });
});
