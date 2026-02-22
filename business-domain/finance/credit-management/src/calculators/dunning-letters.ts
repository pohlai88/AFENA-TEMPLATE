import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * CM-06 — Dunning: Escalating Letters (1st, 2nd, 3rd Notice)
 * Pure function — no I/O.
 *
 * G-02: Policy-driven escalation. Level = max(countLevel, daysLevel, amountLevel)
 * with configurable thresholds per customer segment.
 */

export type DunningCustomer = { customerId: string; overdueMinor: number; daysOverdue: number; priorNoticeCount: number };

export type DunningAction = { customerId: string; noticeLevel: 1 | 2 | 3; overdueMinor: number; daysOverdue: number; action: 'friendly_reminder' | 'formal_demand' | 'legal_notice' };

export type DunningResult = { actions: DunningAction[]; totalOverdueMinor: number; legalCount: number };

export type DunningPolicy = {
  /** Days overdue thresholds: [level2, level3]. Default: [30, 90] */
  daysThresholds: [number, number];
  /** Amount overdue thresholds (minor units): [level2, level3]. Default: [100_000, 500_000] */
  amountThresholds: [number, number];
  /** Prior notice count thresholds: [level2, level3]. Default: [1, 2] */
  countThresholds: [number, number];
};

export const DEFAULT_DUNNING_POLICY: DunningPolicy = {
  daysThresholds: [30, 90],
  amountThresholds: [100_000, 500_000],
  countThresholds: [1, 2],
};

function computeLevel(value: number, thresholds: [number, number]): 1 | 2 | 3 {
  if (value >= thresholds[1]) return 3;
  if (value >= thresholds[0]) return 2;
  return 1;
}

const LEVEL_ACTION: Record<1 | 2 | 3, DunningAction['action']> = {
  1: 'friendly_reminder',
  2: 'formal_demand',
  3: 'legal_notice',
};

export function generateDunningActions(
  customers: DunningCustomer[],
  policy?: DunningPolicy,
): CalculatorResult<DunningResult> {
  if (customers.length === 0) throw new DomainError('VALIDATION_FAILED', 'No customers');
  const p = policy ?? DEFAULT_DUNNING_POLICY;

  const actions: DunningAction[] = customers.map((c) => {
    const countLevel = computeLevel(c.priorNoticeCount, p.countThresholds);
    const daysLevel = computeLevel(c.daysOverdue, p.daysThresholds);
    const amountLevel = computeLevel(c.overdueMinor, p.amountThresholds);
    const level = Math.max(countLevel, daysLevel, amountLevel) as 1 | 2 | 3;
    return { customerId: c.customerId, noticeLevel: level, overdueMinor: c.overdueMinor, daysOverdue: c.daysOverdue, action: LEVEL_ACTION[level] };
  });

  const totalOverdueMinor = actions.reduce((s, a) => s + a.overdueMinor, 0);
  const legalCount = actions.filter((a) => a.action === 'legal_notice').length;
  return {
    result: { actions, totalOverdueMinor, legalCount },
    inputs: { count: customers.length },
    explanation: `Dunning: ${actions.length} actions, ${legalCount} legal`,
  };
}
