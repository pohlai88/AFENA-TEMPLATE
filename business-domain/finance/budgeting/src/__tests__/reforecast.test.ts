import { describe, expect, it } from 'vitest';
import { reforecast } from '../calculators/reforecast';

describe('reforecast', () => {
  it('run-rate projection', () => {
    const r = reforecast(60_000, 120_000, 6, 12, 'run_rate').result;
    expect(r.projectedAnnualMinor).toBe(120_000);
  });

  it('trend method uses budget for remaining', () => {
    const r = reforecast(50_000, 120_000, 6, 12, 'trend').result;
    expect(r.projectedAnnualMinor).toBe(110_000);
  });

  it('high confidence when close to budget', () => {
    const r = reforecast(60_000, 120_000, 6, 12, 'run_rate').result;
    expect(r.confidence).toBe('high');
  });

  it('low confidence when far from budget', () => {
    const r = reforecast(100_000, 120_000, 6, 12, 'run_rate').result;
    expect(r.confidence).toBe('low');
  });

  it('throws on zero elapsed periods', () => {
    expect(() => reforecast(0, 100_000, 0, 12, 'run_rate')).toThrow('elapsedPeriods');
  });
});
