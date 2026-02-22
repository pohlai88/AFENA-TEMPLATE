import { describe, expect, it } from 'vitest';
import { generateAccountingPoliciesNote } from '../calculators/accounting-policies-note';

describe('SR-05 — Accounting Policies Note', () => {
  const baseInput = {
    reportingEntityName: 'Acme Corp',
    fiscalYear: '2025',
    policies: [
      { policyId: 'P1', title: 'Revenue Recognition', standard: 'IFRS 15', description: 'Revenue from contracts', changeInPeriod: false },
      { policyId: 'P2', title: 'Lease Accounting', standard: 'IFRS 16', description: 'Right-of-use assets', changeInPeriod: true },
    ],
    estimates: [
      { estimateId: 'E1', title: 'ECL Provision', description: 'Expected credit losses', sensitivityDescription: '±10% impact', carryingAmountMinor: 500_000 },
    ],
    judgements: [
      { judgementId: 'J1', title: 'Control Assessment', description: 'Consolidation scope', impactArea: 'Group structure' },
    ],
  };

  it('generates three sections', () => {
    const { result } = generateAccountingPoliciesNote(baseInput);
    expect(result.sections).toHaveLength(3);
    expect(result.sections[0].title).toContain('Policies');
    expect(result.sections[1].title).toContain('Estimates');
    expect(result.sections[2].title).toContain('Judgements');
  });

  it('counts policies, estimates, judgements', () => {
    const { result } = generateAccountingPoliciesNote(baseInput);
    expect(result.totalPolicies).toBe(2);
    expect(result.totalEstimates).toBe(1);
    expect(result.totalJudgements).toBe(1);
  });

  it('identifies changed policies', () => {
    const { result } = generateAccountingPoliciesNote(baseInput);
    expect(result.changedPoliciesCount).toBe(1);
    expect(result.sections[0].items[1].detail).toContain('[CHANGED]');
  });

  it('handles empty inputs', () => {
    const { result } = generateAccountingPoliciesNote({
      ...baseInput, policies: [], estimates: [], judgements: [],
    });
    expect(result.totalPolicies).toBe(0);
    expect(result.sections[0].itemCount).toBe(0);
  });

  it('returns CalculatorResult shape', () => {
    const res = generateAccountingPoliciesNote(baseInput);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on missing entity name', () => {
    expect(() => generateAccountingPoliciesNote({ ...baseInput, reportingEntityName: '' })).toThrow('reportingEntityName is required');
  });
});
