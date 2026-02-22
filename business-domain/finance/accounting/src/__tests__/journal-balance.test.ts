import { DomainError } from 'afenda-canon';
import { describe, expect, it } from 'vitest';
import { validateJournalBalance } from '../calculators/journal-balance';

describe('validateJournalBalance', () => {
  it('passes for a balanced two-line entry', () => {
    expect(() =>
      validateJournalBalance([
        { side: 'debit', amountMinor: 10000 },
        { side: 'credit', amountMinor: 10000 },
      ]),
    ).not.toThrow();
  });

  it('passes for multi-line balanced entry', () => {
    expect(() =>
      validateJournalBalance([
        { side: 'debit', amountMinor: 6000 },
        { side: 'debit', amountMinor: 4000 },
        { side: 'credit', amountMinor: 10000 },
      ]),
    ).not.toThrow();
  });

  it('throws VALIDATION_FAILED for empty lines', () => {
    expect(() => validateJournalBalance([])).toThrow(DomainError);
    try {
      validateJournalBalance([]);
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      expect((e as DomainError).code).toBe('VALIDATION_FAILED');
    }
  });

  it('throws VALIDATION_FAILED for imbalanced entry', () => {
    try {
      validateJournalBalance([
        { side: 'debit', amountMinor: 10000 },
        { side: 'credit', amountMinor: 9000 },
      ]);
      expect.fail('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      expect((e as DomainError).code).toBe('VALIDATION_FAILED');
      expect((e as DomainError).meta).toMatchObject({ debitMinor: 10000, creditMinor: 9000 });
    }
  });

  it('throws VALIDATION_FAILED for non-integer amountMinor', () => {
    try {
      validateJournalBalance([
        { side: 'debit', amountMinor: 100.5 },
        { side: 'credit', amountMinor: 100.5 },
      ]);
      expect.fail('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      expect((e as DomainError).code).toBe('VALIDATION_FAILED');
    }
  });

  it('throws VALIDATION_FAILED for negative amountMinor', () => {
    try {
      validateJournalBalance([
        { side: 'debit', amountMinor: -100 },
        { side: 'credit', amountMinor: -100 },
      ]);
      expect.fail('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      expect((e as DomainError).code).toBe('VALIDATION_FAILED');
    }
  });

  it('passes for zero-amount balanced entry', () => {
    expect(() =>
      validateJournalBalance([
        { side: 'debit', amountMinor: 0 },
        { side: 'credit', amountMinor: 0 },
      ]),
    ).not.toThrow();
  });
});
