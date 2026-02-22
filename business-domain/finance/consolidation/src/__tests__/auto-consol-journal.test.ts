import { describe, expect, it } from 'vitest';
import { generateConsolJournal } from '../calculators/auto-consol-journal';
import type { IcMatchedPair } from '../calculators/auto-consol-journal';

const matches: IcMatchedPair[] = [
  {
    matchId: 'ic-m-1',
    fromCompanyId: 'co-hq',
    toCompanyId: 'co-sg',
    amountMinor: 100000,
    currency: 'USD',
    icAccountFrom: 'ic-receivable-hq',
    icAccountTo: 'ic-payable-sg',
    description: 'IC service fee Q1',
  },
  {
    matchId: 'ic-m-2',
    fromCompanyId: 'co-hq',
    toCompanyId: 'co-us',
    amountMinor: 250000,
    currency: 'USD',
    icAccountFrom: 'ic-receivable-hq',
    icAccountTo: 'ic-payable-us',
    description: 'IC management fee',
  },
];

describe('generateConsolJournal', () => {
  it('generates debit/credit pairs for each IC match', () => {
    const { result } = generateConsolJournal(matches);

    expect(result.lines).toHaveLength(4);
    expect(result.matchCount).toBe(2);
  });

  it('debits IC payable and credits IC receivable', () => {
    const { result } = generateConsolJournal([matches[0]!]);

    const debit = result.lines.find((l) => l.side === 'debit')!;
    const credit = result.lines.find((l) => l.side === 'credit')!;

    expect(debit.accountId).toBe('ic-payable-sg');
    expect(debit.companyId).toBe('co-sg');
    expect(credit.accountId).toBe('ic-receivable-hq');
    expect(credit.companyId).toBe('co-hq');
  });

  it('produces balanced journal', () => {
    const { result } = generateConsolJournal(matches);
    expect(result.isBalanced).toBe(true);
  });

  it('computes total eliminated amount', () => {
    const { result } = generateConsolJournal(matches);
    expect(result.totalEliminatedMinor).toBe(350000);
  });

  it('throws for empty matches', () => {
    expect(() => generateConsolJournal([])).toThrow('At least one IC matched pair');
  });

  it('throws for zero amount', () => {
    const bad: IcMatchedPair[] = [{
      matchId: 'bad', fromCompanyId: 'a', toCompanyId: 'b', amountMinor: 0,
      currency: 'USD', icAccountFrom: 'x', icAccountTo: 'y', description: 'test',
    }];
    expect(() => generateConsolJournal(bad)).toThrow('amount must be positive');
  });

  it('throws for same from/to company', () => {
    const bad: IcMatchedPair[] = [{
      matchId: 'bad', fromCompanyId: 'a', toCompanyId: 'a', amountMinor: 100,
      currency: 'USD', icAccountFrom: 'x', icAccountTo: 'y', description: 'test',
    }];
    expect(() => generateConsolJournal(bad)).toThrow('from and to company must differ');
  });

  it('includes match ID in memo', () => {
    const { result } = generateConsolJournal([matches[0]!]);
    expect(result.lines[0]!.memo).toContain('ic-m-1');
  });
});
