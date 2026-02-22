import { describe, expect, it } from 'vitest';
import { validateBatchPosting } from '../calculators/batch-posting';

describe('DE-08 — Batch Posting', () => {
  const validEntry = {
    entryId: 'E1', debitAccountId: '1000', creditAccountId: '2000',
    amountMinor: 50_000, currency: 'USD', description: 'Test',
  };

  it('accepts a valid batch', () => {
    const { result } = validateBatchPosting('B-1', [validEntry, { ...validEntry, entryId: 'E2' }]);
    expect(result.accepted).toBe(true);
    expect(result.validEntries).toBe(2);
    expect(result.failedEntries).toBe(0);
    expect(result.totalDebitMinor).toBe(100_000);
  });

  it('rejects entire batch on any failure (rollback)', () => {
    const badEntry = { ...validEntry, entryId: 'E-BAD', debitAccountId: '1000', creditAccountId: '1000' };
    const { result } = validateBatchPosting('B-2', [validEntry, badEntry]);
    expect(result.accepted).toBe(false);
    expect(result.failedEntries).toBe(1);
    expect(result.entryResults[1].error).toContain('must differ');
  });

  it('validates missing fields', () => {
    const { result } = validateBatchPosting('B-3', [
      { entryId: 'E1', debitAccountId: '', creditAccountId: '2000', amountMinor: 100, currency: 'USD', description: '' },
    ]);
    expect(result.accepted).toBe(false);
    expect(result.entryResults[0].error).toContain('debitAccountId');
  });

  it('validates positive integer amounts', () => {
    const { result } = validateBatchPosting('B-4', [
      { ...validEntry, amountMinor: -100 },
    ]);
    expect(result.accepted).toBe(false);
  });

  it('returns CalculatorResult shape', () => {
    const res = validateBatchPosting('B-5', [validEntry]);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on empty batch', () => {
    expect(() => validateBatchPosting('B-6', [])).toThrow('at least one entry');
  });
});
