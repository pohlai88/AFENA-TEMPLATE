import { describe, expect, it } from 'vitest';
import { findMatches } from '../calculators/match-engine';

import type { BankLine, LedgerEntry } from '../calculators/match-engine';

describe('findMatches', () => {
  const bankLines: BankLine[] = [
    { lineId: 'b1', amountMinor: 10000, dateIso: '2025-03-15', reference: 'INV-001' },
    { lineId: 'b2', amountMinor: 5000, dateIso: '2025-03-16', reference: '' },
    { lineId: 'b3', amountMinor: 7500, dateIso: '2025-03-20', reference: 'INV-003' },
  ];

  const ledgerEntries: LedgerEntry[] = [
    { entryId: 'l1', amountMinor: 10000, dateIso: '2025-03-15', reference: 'INV-001' },
    { entryId: 'l2', amountMinor: 5000, dateIso: '2025-03-17', reference: '' },
    { entryId: 'l3', amountMinor: 9999, dateIso: '2025-03-15', reference: 'INV-001' },
  ];

  it('matches by exact amount and same date', () => {
    const matches = findMatches(bankLines, ledgerEntries, 3).result;
    const m = matches.find((m) => m.bankLineId === 'b1' && m.ledgerEntryId === 'l1');
    expect(m).toBeDefined();
    expect(m!.confidence).toBe(1.0);
  });

  it('does not match different amounts', () => {
    const matches = findMatches(bankLines, ledgerEntries, 3).result;
    const m = matches.find((m) => m.bankLineId === 'b1' && m.ledgerEntryId === 'l3');
    expect(m).toBeUndefined();
  });

  it('matches within tolerance days', () => {
    const matches = findMatches(bankLines, ledgerEntries, 3).result;
    const m = matches.find((m) => m.bankLineId === 'b2' && m.ledgerEntryId === 'l2');
    expect(m).toBeDefined();
    expect(m!.confidence).toBeGreaterThan(0.5);
  });

  it('does not match outside tolerance days', () => {
    const matches = findMatches(bankLines, ledgerEntries, 0).result;
    const m = matches.find((m) => m.bankLineId === 'b2' && m.ledgerEntryId === 'l2');
    expect(m).toBeUndefined();
  });

  it('boosts confidence for matching references', () => {
    const matches = findMatches(bankLines, ledgerEntries, 3).result;
    const withRef = matches.find((m) => m.bankLineId === 'b1' && m.ledgerEntryId === 'l1');
    expect(withRef!.confidence).toBe(1.0);
  });

  it('returns matches sorted by confidence descending', () => {
    const matches = findMatches(bankLines, ledgerEntries, 3).result;
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i]!.confidence).toBeLessThanOrEqual(matches[i - 1]!.confidence);
    }
  });

  it('returns empty for no bank lines', () => {
    expect(findMatches([], ledgerEntries, 3).result).toHaveLength(0);
  });

  it('returns empty for no ledger entries', () => {
    expect(findMatches(bankLines, [], 3).result).toHaveLength(0);
  });

  it('throws on negative toleranceDays', () => {
    expect(() => findMatches(bankLines, ledgerEntries, -1)).toThrow('non-negative integer');
  });

  it('throws on non-integer toleranceDays', () => {
    expect(() => findMatches(bankLines, ledgerEntries, 1.5)).toThrow('non-negative integer');
  });
});
