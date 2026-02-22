import { describe, expect, it } from 'vitest';
import { validateBankStatement } from '../calculators/bank-statement-import';

describe('validateBankStatement', () => {
  it('validates balanced statement', () => {
    const lines = [
      { date: '2026-01-01', reference: 'TXN1', description: 'Deposit', amountMinor: 5000, currency: 'USD', balanceMinor: 15000 },
      { date: '2026-01-02', reference: 'TXN2', description: 'Payment', amountMinor: -2000, currency: 'USD', balanceMinor: 13000 },
    ];
    const r = validateBankStatement(lines, 'mt940', 10000);
    expect(r.result.isBalanced).toBe(true);
    expect(r.result.totalCreditsMinor).toBe(5000);
    expect(r.result.totalDebitsMinor).toBe(2000);
    expect(r.result.closingBalanceMinor).toBe(13000);
  });

  it('detects unbalanced statement', () => {
    const lines = [{ date: '2026-01-01', reference: 'X', description: 'X', amountMinor: 1000, currency: 'USD', balanceMinor: 9999 }];
    const r = validateBankStatement(lines, 'csv', 10000);
    expect(r.result.isBalanced).toBe(false);
  });

  it('throws on empty lines', () => {
    expect(() => validateBankStatement([], 'ofx', 0)).toThrow('at least one');
  });
});
