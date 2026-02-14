/**
 * Phase A+B Finance Tests — PRD advance.db.md
 *
 * Covers:
 * - resolveFiscalYear() — fiscal year boundary logic
 * - GovernorConfig lockTimeoutMs — present on all presets
 * - Doc number formatting contract
 * - calculateLineTax() — deterministic tax rounding (PRD G0.7)
 */

import { describe, expect, it, vi } from 'vitest';

// Mock afena-database to avoid DATABASE_URL requirement at module load.
// governor.ts imports sql from afena-database; this mock prevents the throw.
vi.mock('afena-database', () => ({
  db: {},
  dbRo: {},
  sql: {},
  and: (...args: unknown[]) => args,
  eq: () => true,
  desc: () => true,
  numberSequences: {},
  fxRates: {},
  taxRates: {},
  fiscalPeriods: {},
}));

import { buildGovernorConfig } from '../governor';
import { resolveFiscalYear } from '../services/fiscal-year';
import { calculateLineTax } from '../services/tax-calc';

// ── resolveFiscalYear ───────────────────────────────────

describe('resolveFiscalYear', () => {
  it('returns current year when fiscal year starts in January', () => {
    const fy = resolveFiscalYear(1, new Date('2026-06-15'));
    expect(fy).toBe(2026);
  });

  it('returns current year when month >= fiscal start', () => {
    // Fiscal year starts April, date is June → FY 2026
    const fy = resolveFiscalYear(4, new Date('2026-06-15'));
    expect(fy).toBe(2026);
  });

  it('returns previous year when month < fiscal start', () => {
    // Fiscal year starts April, date is February → FY 2025
    const fy = resolveFiscalYear(4, new Date('2026-02-15'));
    expect(fy).toBe(2025);
  });

  it('returns current year on exact fiscal start month', () => {
    // Fiscal year starts April, date is April 1 → FY 2026
    const fy = resolveFiscalYear(4, new Date('2026-04-01'));
    expect(fy).toBe(2026);
  });

  it('handles December fiscal year start', () => {
    // Fiscal year starts December, date is November → FY 2025
    const fy = resolveFiscalYear(12, new Date('2026-11-30'));
    expect(fy).toBe(2025);
    // Date is December → FY 2026
    const fy2 = resolveFiscalYear(12, new Date('2026-12-01'));
    expect(fy2).toBe(2026);
  });

  it('handles fiscal year start = 1 (calendar year)', () => {
    const fy = resolveFiscalYear(1, new Date('2026-01-01'));
    expect(fy).toBe(2026);
    const fy2 = resolveFiscalYear(1, new Date('2026-12-31'));
    expect(fy2).toBe(2026);
  });

  it('defaults to current date when no date provided', () => {
    const fy = resolveFiscalYear(1);
    expect(typeof fy).toBe('number');
    expect(fy).toBeGreaterThanOrEqual(2020);
  });
});

// ── GovernorConfig lockTimeoutMs ────────────────────────

describe('GovernorConfig lockTimeoutMs', () => {
  it('interactive preset has 3s lock timeout', () => {
    const config = buildGovernorConfig('interactive', 'org_1', 'web_ui');
    expect(config.lockTimeoutMs).toBe(3_000);
  });

  it('background preset has 5s lock timeout', () => {
    const config = buildGovernorConfig('background', 'org_1', 'background_job');
    expect(config.lockTimeoutMs).toBe(5_000);
  });

  it('reporting preset has 5s lock timeout', () => {
    const config = buildGovernorConfig('reporting', 'org_1', 'api');
    expect(config.lockTimeoutMs).toBe(5_000);
  });

  it('lockTimeoutMs is always a positive number', () => {
    for (const preset of ['interactive', 'background', 'reporting'] as const) {
      const config = buildGovernorConfig(preset, 'org_1');
      expect(config.lockTimeoutMs).toBeGreaterThan(0);
      expect(Number.isInteger(config.lockTimeoutMs)).toBe(true);
    }
  });
});

// NOTE: allocateDocNumber, lookupFxRate, and fxRates schema export tests
// require DATABASE_URL (afena-database throws at module load without it).
// Export correctness is verified by tsc --noEmit which passes clean.

// ── Doc number formatting ──────────────────────────────

describe('Doc number formatting contract', () => {
  it('padStart produces correct format for typical sequences', () => {
    // Simulates the formatting logic in allocateDocNumber
    const prefix = 'INV-';
    const suffix = '';
    const padLength = 5;

    const format = (value: number) =>
      `${prefix}${String(value).padStart(padLength, '0')}${suffix}`;

    expect(format(1)).toBe('INV-00001');
    expect(format(42)).toBe('INV-00042');
    expect(format(99999)).toBe('INV-99999');
    expect(format(100000)).toBe('INV-100000'); // exceeds pad — no truncation
  });

  it('handles custom prefix/suffix', () => {
    const prefix = 'PO-';
    const suffix = '/2026';
    const padLength = 4;

    const format = (value: number) =>
      `${prefix}${String(value).padStart(padLength, '0')}${suffix}`;

    expect(format(1)).toBe('PO-0001/2026');
    expect(format(999)).toBe('PO-0999/2026');
  });
});

// ── calculateLineTax — deterministic rounding ─────────

describe('calculateLineTax', () => {
  it('calculates 6% GST on $100.00 (10000 minor units)', () => {
    // 10000 * 6/100 = 600
    expect(calculateLineTax(10000, '6.000000')).toBe(600);
  });

  it('calculates 10% service tax on $55.50 (5550 minor units)', () => {
    // 5550 * 10/100 = 555
    expect(calculateLineTax(5550, '10.000000')).toBe(555);
  });

  it('rounds half_up by default', () => {
    // 1050 * 6/100 = 63.0 (exact)
    expect(calculateLineTax(1050, '6.000000', 'half_up')).toBe(63);
    // 1055 * 6/100 = 63.3 → rounds to 63
    expect(calculateLineTax(1055, '6.000000', 'half_up')).toBe(63);
  });

  it('rounds ceil (always up)', () => {
    // 1001 * 6/100 = 60.06 → ceil = 61
    expect(calculateLineTax(1001, '6.000000', 'ceil')).toBe(61);
  });

  it('rounds floor (always down)', () => {
    // 1099 * 6/100 = 65.94 → floor = 65
    expect(calculateLineTax(1099, '6.000000', 'floor')).toBe(65);
  });

  it('returns 0 for zero-rated tax', () => {
    expect(calculateLineTax(10000, '0.000000')).toBe(0);
  });

  it('returns 0 for zero amount', () => {
    expect(calculateLineTax(0, '6.000000')).toBe(0);
  });

  it('is deterministic — same input always produces same output', () => {
    const results = Array.from({ length: 100 }, () =>
      calculateLineTax(9999, '6.000000', 'half_up'),
    );
    expect(new Set(results).size).toBe(1);
    expect(results[0]).toBe(600); // 9999 * 0.06 = 599.94 → 600
  });
});
