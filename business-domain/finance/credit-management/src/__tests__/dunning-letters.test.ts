import { describe, expect, it } from 'vitest';

import { generateDunningActions } from '../calculators/dunning-letters';

describe('CM-06 — Dunning: escalating letters (1st, 2nd, 3rd notice)', () => {
  it('assigns friendly_reminder for first notice', () => {
    const r = generateDunningActions([
      { customerId: 'C-1', overdueMinor: 10_000, daysOverdue: 15, priorNoticeCount: 0 },
    ]);
    expect(r.result.actions[0]!.action).toBe('friendly_reminder');
    expect(r.result.actions[0]!.noticeLevel).toBe(1);
  });

  it('escalates to formal_demand on second notice', () => {
    const r = generateDunningActions([
      { customerId: 'C-1', overdueMinor: 20_000, daysOverdue: 45, priorNoticeCount: 1 },
    ]);
    expect(r.result.actions[0]!.action).toBe('formal_demand');
    expect(r.result.actions[0]!.noticeLevel).toBe(2);
  });

  it('escalates to legal_notice on third notice', () => {
    const r = generateDunningActions([
      { customerId: 'C-1', overdueMinor: 50_000, daysOverdue: 90, priorNoticeCount: 2 },
    ]);
    expect(r.result.actions[0]!.action).toBe('legal_notice');
    expect(r.result.actions[0]!.noticeLevel).toBe(3);
  });

  it('caps at level 3 for high prior notice count', () => {
    const r = generateDunningActions([
      { customerId: 'C-1', overdueMinor: 50_000, daysOverdue: 120, priorNoticeCount: 5 },
    ]);
    expect(r.result.actions[0]!.noticeLevel).toBe(3);
  });

  it('computes totals and legal count', () => {
    const r = generateDunningActions([
      { customerId: 'C-1', overdueMinor: 10_000, daysOverdue: 15, priorNoticeCount: 0 },
      { customerId: 'C-2', overdueMinor: 30_000, daysOverdue: 90, priorNoticeCount: 2 },
    ]);
    expect(r.result.totalOverdueMinor).toBe(40_000);
    expect(r.result.legalCount).toBe(1);
  });

  it('throws on empty customers', () => {
    expect(() => generateDunningActions([])).toThrow('No customers');
  });

  it('escalates by amount alone when overdue amount exceeds threshold (G-02)', () => {
    const r = generateDunningActions([
      { customerId: 'C-1', overdueMinor: 600_000, daysOverdue: 5, priorNoticeCount: 0 },
    ]);
    expect(r.result.actions[0]!.noticeLevel).toBe(3);
    expect(r.result.actions[0]!.action).toBe('legal_notice');
  });

  it('escalates by days alone when days exceed threshold (G-02)', () => {
    const r = generateDunningActions([
      { customerId: 'C-1', overdueMinor: 1_000, daysOverdue: 91, priorNoticeCount: 0 },
    ]);
    expect(r.result.actions[0]!.noticeLevel).toBe(3);
    expect(r.result.actions[0]!.action).toBe('legal_notice');
  });

  it('respects custom policy thresholds (G-02)', () => {
    const strictPolicy = {
      daysThresholds: [7, 14] as [number, number],
      amountThresholds: [10_000, 50_000] as [number, number],
      countThresholds: [1, 2] as [number, number],
    };
    const r = generateDunningActions(
      [{ customerId: 'C-1', overdueMinor: 5_000, daysOverdue: 10, priorNoticeCount: 0 }],
      strictPolicy,
    );
    expect(r.result.actions[0]!.noticeLevel).toBe(2);
    expect(r.result.actions[0]!.action).toBe('formal_demand');
  });

  it('takes max of count, days, and amount levels (G-02)', () => {
    const r = generateDunningActions([
      { customerId: 'C-1', overdueMinor: 200_000, daysOverdue: 10, priorNoticeCount: 0 },
    ]);
    expect(r.result.actions[0]!.noticeLevel).toBe(2);
  });
});
