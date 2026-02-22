import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * FX-08 — Rate Source Audit Trail (IFRS 13 Fair Value Hierarchy)
 *
 * Validates FX rate sources and classifies per IFRS 13 fair value hierarchy.
 * Pure function — no I/O.
 */

export type FxRateEntry = {
  rateId: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  source: 'ecb' | 'bloomberg' | 'reuters' | 'central_bank' | 'manual';
  dateIso: string;
  enteredBy: string | null;
};

export type RateAuditResult = {
  rateId: string;
  fairValueLevel: 1 | 2 | 3;
  isManual: boolean;
  requiresApproval: boolean;
};

export type RateAuditSummary = { entries: RateAuditResult[]; manualCount: number; requiresApprovalCount: number; level3Count: number };

export function auditRateSources(rates: FxRateEntry[]): CalculatorResult<RateAuditSummary> {
  if (rates.length === 0) throw new DomainError('VALIDATION_FAILED', 'No rates provided');

  const entries: RateAuditResult[] = rates.map((r) => {
    const isManual = r.source === 'manual';
    const fairValueLevel: 1 | 2 | 3 = r.source === 'ecb' || r.source === 'bloomberg' || r.source === 'reuters' ? 1 : r.source === 'central_bank' ? 2 : 3;
    return { rateId: r.rateId, fairValueLevel, isManual, requiresApproval: isManual };
  });

  return {
    result: { entries, manualCount: entries.filter((e) => e.isManual).length, requiresApprovalCount: entries.filter((e) => e.requiresApproval).length, level3Count: entries.filter((e) => e.fairValueLevel === 3).length },
    inputs: { count: rates.length },
    explanation: `Rate audit: ${entries.filter((e) => e.isManual).length} manual, ${entries.filter((e) => e.fairValueLevel === 3).length} Level 3`,
  };
}
