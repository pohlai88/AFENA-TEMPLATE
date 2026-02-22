import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * TR-06 — Debt Covenant Monitoring (IFRS 7)
 *
 * Evaluates debt covenants and flags breaches or near-breaches.
 * Pure function — no I/O.
 */

export type Covenant = {
  covenantId: string;
  name: string;
  metric: 'debt_to_equity' | 'interest_coverage' | 'current_ratio' | 'leverage' | 'custom';
  threshold: number;
  operator: 'gte' | 'lte';
  actualValue: number;
  warningBufferPct: number;
};

export type CovenantCheckResult = {
  covenantId: string;
  name: string;
  status: 'compliant' | 'warning' | 'breach';
  actualValue: number;
  threshold: number;
  headroomPct: number;
};

export type CovenantMonitorResult = { checks: CovenantCheckResult[]; breachCount: number; warningCount: number; allCompliant: boolean };

export function evaluateCovenants(covenants: Covenant[]): CalculatorResult<CovenantMonitorResult> {
  if (covenants.length === 0) throw new DomainError('VALIDATION_FAILED', 'No covenants provided');

  const checks: CovenantCheckResult[] = covenants.map((c) => {
    const isBreach = c.operator === 'gte' ? c.actualValue < c.threshold : c.actualValue > c.threshold;
    const headroomPct = c.threshold !== 0 ? Math.round(((c.actualValue - c.threshold) / Math.abs(c.threshold)) * 100) : 0;
    const absHeadroom = Math.abs(headroomPct);
    const isWarning = !isBreach && absHeadroom <= c.warningBufferPct;
    return { covenantId: c.covenantId, name: c.name, status: isBreach ? 'breach' : isWarning ? 'warning' : 'compliant', actualValue: c.actualValue, threshold: c.threshold, headroomPct };
  });

  return {
    result: { checks, breachCount: checks.filter((c) => c.status === 'breach').length, warningCount: checks.filter((c) => c.status === 'warning').length, allCompliant: checks.every((c) => c.status === 'compliant') },
    inputs: { count: covenants.length },
    explanation: `Covenant check: ${checks.filter((c) => c.status === 'breach').length} breaches, ${checks.filter((c) => c.status === 'warning').length} warnings`,
  };
}
