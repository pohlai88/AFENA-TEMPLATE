import { describe, expect, it } from 'vitest';
import { forecastCashFlow } from '../calculators/cash-forecast';

describe('forecastCashFlow', () => {
  it('projects daily positions over horizon', () => {
    const result = forecastCashFlow(100_000, [], [], 5, '2024-01-01').result;
    expect(result.dailyPositions).toHaveLength(5);
    expect(result.lowestPointMinor).toBe(100_000);
    expect(result.daysUntilNegative).toBeNull();
  });

  it('throws on invalid horizonDays', () => {
    expect(() => forecastCashFlow(100_000, [], [], 0, '2024-01-01')).toThrow('horizonDays must be a positive integer');
    expect(() => forecastCashFlow(100_000, [], [], -1, '2024-01-01')).toThrow('horizonDays must be a positive integer');
  });

  it('throws on non-integer starting balance', () => {
    expect(() => forecastCashFlow(1.5, [], [], 5, '2024-01-01')).toThrow('startingBalanceMinor must be an integer');
  });
});
