import { describe, expect, it } from 'vitest';
import { evaluateReconSignOff } from '../calculators/recon-signoff';
import type { ReconSummary } from '../calculators/recon-signoff';

describe('evaluateReconSignOff', () => {
  it('returns ready when fully reconciled', () => {
    const summary: ReconSummary = {
      accountId: 'bank-001', periodKey: '2026-P1', bankBalanceMinor: 5000000, glBalanceMinor: 5000000,
      matchedCount: 100, unmatchedBankCount: 0, unmatchedGlCount: 0, unmatchedBankTotalMinor: 0, unmatchedGlTotalMinor: 0,
    };
    const { result } = evaluateReconSignOff(summary);
    expect(result.signOffStatus).toBe('ready');
    expect(result.isReconciled).toBe(true);
    expect(result.matchRate).toBe(100);
  });

  it('returns pending_review when small variance exists', () => {
    const summary: ReconSummary = {
      accountId: 'bank-002', periodKey: '2026-P1', bankBalanceMinor: 5000050, glBalanceMinor: 5000000,
      matchedCount: 98, unmatchedBankCount: 1, unmatchedGlCount: 1, unmatchedBankTotalMinor: 50, unmatchedGlTotalMinor: 0,
    };
    const { result } = evaluateReconSignOff(summary);
    expect(result.signOffStatus).toBe('pending_review');
  });

  it('returns blocked when variance exceeds threshold', () => {
    const summary: ReconSummary = {
      accountId: 'bank-003', periodKey: '2026-P1', bankBalanceMinor: 5500000, glBalanceMinor: 5000000,
      matchedCount: 80, unmatchedBankCount: 15, unmatchedGlCount: 5, unmatchedBankTotalMinor: 400000, unmatchedGlTotalMinor: 0,
    };
    const { result } = evaluateReconSignOff(summary);
    expect(result.signOffStatus).toBe('blocked');
    expect(result.blockReasons.length).toBeGreaterThan(0);
  });

  it('includes evidence items', () => {
    const summary: ReconSummary = {
      accountId: 'bank-004', periodKey: '2026-P1', bankBalanceMinor: 1000000, glBalanceMinor: 1000000,
      matchedCount: 50, unmatchedBankCount: 0, unmatchedGlCount: 0, unmatchedBankTotalMinor: 0, unmatchedGlTotalMinor: 0,
    };
    const { result } = evaluateReconSignOff(summary);
    expect(result.evidenceItems.length).toBeGreaterThan(0);
    expect(result.evidenceItems.some((e) => e.includes('Bank balance'))).toBe(true);
  });

  it('throws for missing account ID', () => {
    const summary: ReconSummary = {
      accountId: '', periodKey: '2026-P1', bankBalanceMinor: 0, glBalanceMinor: 0,
      matchedCount: 0, unmatchedBankCount: 0, unmatchedGlCount: 0, unmatchedBankTotalMinor: 0, unmatchedGlTotalMinor: 0,
    };
    expect(() => evaluateReconSignOff(summary)).toThrow('required');
  });
});
