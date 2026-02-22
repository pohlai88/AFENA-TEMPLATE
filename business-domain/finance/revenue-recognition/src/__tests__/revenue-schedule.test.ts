import { describe, expect, it } from 'vitest';
import { buildRevenueSchedule } from '../calculators/revenue-schedule';

describe('buildRevenueSchedule', () => {
  it('straight-line: 3-month split with remainder in last period', () => {
    const entries = buildRevenueSchedule(100_000, '2025-01-01', '2025-04-01', 'straight_line').result;
    expect(entries).toHaveLength(3);
    expect(entries[0].recognizedMinor).toBe(33_333);
    expect(entries[1].recognizedMinor).toBe(33_333);
    expect(entries[2].recognizedMinor).toBe(33_334);
    expect(entries[2].cumulativeMinor).toBe(100_000);
    expect(entries[2].deferredMinor).toBe(0);
  });

  it('straight-line: populates periodStartIso and periodEndIso', () => {
    const entries = buildRevenueSchedule(60_000, '2025-01-01', '2025-03-01', 'straight_line').result;
    expect(entries).toHaveLength(2);
    expect(entries[0].periodStartIso).toBe('2025-01-01');
    expect(entries[0].periodEndIso).toBe('2025-02-01');
    expect(entries[1].periodStartIso).toBe('2025-02-01');
    expect(entries[1].periodEndIso).toBe('2025-03-01');
  });

  it('straight-line: single period', () => {
    const entries = buildRevenueSchedule(50_000, '2025-01-01', '2025-02-01', 'straight_line').result;
    expect(entries).toHaveLength(1);
    expect(entries[0].recognizedMinor).toBe(50_000);
  });

  it('milestone: all recognized in last period', () => {
    const entries = buildRevenueSchedule(100_000, '2025-01-01', '2025-05-01', 'milestone').result;
    expect(entries).toHaveLength(4);
    expect(entries[0].recognizedMinor).toBe(0);
    expect(entries[3].recognizedMinor).toBe(100_000);
  });

  it('throws on zero total', () => {
    expect(() => buildRevenueSchedule(0, '2025-01-01', '2025-04-01', 'straight_line')).toThrow('totalMinor');
  });

  it('throws when start >= end', () => {
    expect(() => buildRevenueSchedule(100_000, '2025-04-01', '2025-01-01', 'straight_line')).toThrow('before');
  });
});
