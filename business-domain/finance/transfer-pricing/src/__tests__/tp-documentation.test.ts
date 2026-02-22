import { describe, expect, it } from 'vitest';
import { generateTpDocumentation } from '../calculators/tp-documentation';

describe('TP-05 — TP Documentation', () => {
  const baseInput = {
    groupName: 'Acme Group',
    fiscalYear: '2025',
    masterFileEntity: { entityId: 'HQ', entityName: 'Acme HQ', jurisdiction: 'NL', functionalCurrency: 'EUR' },
    localFileEntity: { entityId: 'US-1', entityName: 'Acme US', jurisdiction: 'US', functionalCurrency: 'USD' },
    icTransactions: [
      { transactionId: 'T1', counterpartyId: 'HQ', description: 'Management fees', amountMinor: 500_000, tpMethod: 'TNMM' },
    ],
    groupRevenueTotalMinor: 10_000_000,
    tpPolicySummary: 'Arms length pricing per OECD guidelines',
  };

  it('generates master file and local file sections', () => {
    const { result } = generateTpDocumentation(baseInput);
    expect(result.masterFileSections).toHaveLength(5);
    expect(result.localFileSections).toHaveLength(5);
    expect(result.masterFileCompletePct).toBeGreaterThan(0);
    expect(result.localFileCompletePct).toBeGreaterThan(0);
  });

  it('marks sections as missing when data absent', () => {
    const { result } = generateTpDocumentation({
      ...baseInput,
      tpPolicySummary: '',
      icTransactions: [],
      groupRevenueTotalMinor: 0,
    });
    const missingMaster = result.masterFileSections.filter((s: { status: string }) => s.status === 'missing');
    expect(missingMaster.length).toBeGreaterThan(0);
  });

  it('counts IC transactions', () => {
    const { result } = generateTpDocumentation(baseInput);
    expect(result.totalIcTransactions).toBe(1);
    expect(result.totalIcValueMinor).toBe(500_000);
  });

  it('returns CalculatorResult shape', () => {
    const res = generateTpDocumentation(baseInput);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on missing groupName', () => {
    expect(() => generateTpDocumentation({ ...baseInput, groupName: '' })).toThrow('groupName is required');
  });
});
