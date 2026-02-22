import { describe, expect, it } from 'vitest';
import { generateBudgetPeriods } from '../calculators/budget-period';

describe('generateBudgetPeriods', () => {
  it('generates 12 monthly periods', () => {
    const r = generateBudgetPeriods({ fiscalYearStart: '2026-01-01', granularity: 'monthly', companyId: 'C1' });
    expect(r.result.periodCount).toBe(12);
    expect(r.result.periods[0]!.label).toBe('2026-01');
  });

  it('generates 4 quarterly periods', () => {
    const r = generateBudgetPeriods({ fiscalYearStart: '2026-04-01', granularity: 'quarterly', companyId: 'C2' });
    expect(r.result.periodCount).toBe(4);
    expect(r.result.periods[0]!.label).toContain('Q1');
  });

  it('generates 1 annual period', () => {
    const r = generateBudgetPeriods({ fiscalYearStart: '2026-01-01', granularity: 'annual', companyId: 'C3' });
    expect(r.result.periodCount).toBe(1);
  });

  it('throws on invalid date', () => {
    expect(() => generateBudgetPeriods({ fiscalYearStart: 'bad', granularity: 'monthly', companyId: 'X' })).toThrow('Invalid');
  });
});
