import { describe, expect, it } from 'vitest';
import { computeEliminations } from '../calculators/elimination';

import type { IntercompanyBalance } from '../calculators/elimination';

describe('computeEliminations', () => {
  it('returns empty for no balances', () => {
    expect(computeEliminations([]).result).toHaveLength(0);
  });

  it('creates balanced debit/credit pair for each IC balance', () => {
    const balances: IntercompanyBalance[] = [
      { fromCompanyId: 'c1', toCompanyId: 'c2', accountId: 'a1', amountMinor: 10000, currency: 'MYR' },
    ];
    const entries = computeEliminations(balances).result;
    expect(entries).toHaveLength(2);
    expect(entries[0]?.side).toBe('debit');
    expect(entries[0]?.amountMinor).toBe(10000);
    expect(entries[1]?.side).toBe('credit');
    expect(entries[1]?.amountMinor).toBe(10000);
  });

  it('creates entries for multiple balances', () => {
    const balances: IntercompanyBalance[] = [
      { fromCompanyId: 'c1', toCompanyId: 'c2', accountId: 'a1', amountMinor: 5000, currency: 'MYR' },
      { fromCompanyId: 'c2', toCompanyId: 'c3', accountId: 'a2', amountMinor: 3000, currency: 'USD' },
    ];
    const entries = computeEliminations(balances).result;
    expect(entries).toHaveLength(4);
  });

  it('includes IC memo with company IDs', () => {
    const balances: IntercompanyBalance[] = [
      { fromCompanyId: 'c1', toCompanyId: 'c2', accountId: 'a1', amountMinor: 1000, currency: 'MYR' },
    ];
    const entries = computeEliminations(balances).result;
    expect(entries[0]?.memo).toContain('c1');
    expect(entries[0]?.memo).toContain('c2');
  });

  it('throws on non-integer amountMinor', () => {
    const balances: IntercompanyBalance[] = [
      { fromCompanyId: 'c1', toCompanyId: 'c2', accountId: 'a1', amountMinor: 100.5, currency: 'MYR' },
    ];
    expect(() => computeEliminations(balances)).toThrow('non-negative integer');
  });

  it('throws on negative amountMinor', () => {
    const balances: IntercompanyBalance[] = [
      { fromCompanyId: 'c1', toCompanyId: 'c2', accountId: 'a1', amountMinor: -100, currency: 'MYR' },
    ];
    expect(() => computeEliminations(balances)).toThrow('non-negative integer');
  });

  it('throws when fromCompanyId equals toCompanyId', () => {
    const balances: IntercompanyBalance[] = [
      { fromCompanyId: 'c1', toCompanyId: 'c1', accountId: 'a1', amountMinor: 1000, currency: 'MYR' },
    ];
    expect(() => computeEliminations(balances)).toThrow('same company');
  });
});
