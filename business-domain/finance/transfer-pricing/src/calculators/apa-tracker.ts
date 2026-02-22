import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see TX-10 — Tax audit trail and documentation
 * @see TP-02 — Arm’s length principle validation (OECD Guidelines)
 * @see TP-03 — Comparable uncontrolled price (CUP) method
 * @see TP-04 — Transactional net margin method (TNMM)
 * @see TP-06 — Advance Pricing Agreement (APA) Tracking
 *
 * Models APA lifecycle (application → negotiation → agreement → monitoring → renewal),
 * tracks covered transactions, validates compliance with agreed methodology.
 * Pure function — no I/O.
 */

export type ApaStatus = 'application' | 'negotiation' | 'agreement' | 'monitoring' | 'renewal' | 'expired';

export type CoveredTransaction = {
  transactionId: string;
  description: string;
  agreedMethod: string;
  agreedMarginPct: number;
  actualMarginPct: number;
};

export type ApaInput = {
  apaId: string;
  status: ApaStatus;
  startDate: string;
  endDate: string;
  jurisdictions: string[];
  coveredTransactions: CoveredTransaction[];
  tolerancePct: number;
};

export type ApaComplianceResult = {
  transactionId: string;
  agreedMarginPct: number;
  actualMarginPct: number;
  deviationPct: number;
  compliant: boolean;
};

export type ApaResult = {
  apaId: string;
  status: ApaStatus;
  jurisdictionCount: number;
  transactionCount: number;
  complianceResults: ApaComplianceResult[];
  overallCompliant: boolean;
  nonCompliantCount: number;
};

export function evaluateApaCompliance(input: ApaInput): CalculatorResult<ApaResult> {
  const { apaId, status, jurisdictions, coveredTransactions, tolerancePct } = input;

  if (!apaId) throw new DomainError('VALIDATION_FAILED', 'apaId is required');
  if (jurisdictions.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one jurisdiction required');
  if (tolerancePct < 0) throw new DomainError('VALIDATION_FAILED', 'tolerancePct must be non-negative');

  const complianceResults: ApaComplianceResult[] = coveredTransactions.map((t) => {
    const deviation = Math.abs(t.actualMarginPct - t.agreedMarginPct);
    return {
      transactionId: t.transactionId,
      agreedMarginPct: t.agreedMarginPct,
      actualMarginPct: t.actualMarginPct,
      deviationPct: Math.round(deviation * 100) / 100,
      compliant: deviation <= tolerancePct,
    };
  });

  const nonCompliantCount = complianceResults.filter((r) => !r.compliant).length;

  return {
    result: {
      apaId,
      status,
      jurisdictionCount: jurisdictions.length,
      transactionCount: coveredTransactions.length,
      complianceResults,
      overallCompliant: nonCompliantCount === 0,
      nonCompliantCount,
    },
    inputs: { apaId, status, tolerancePct },
    explanation: nonCompliantCount === 0
      ? `APA ${apaId}: all ${coveredTransactions.length} transactions compliant within ${tolerancePct}% tolerance`
      : `APA ${apaId}: ${nonCompliantCount}/${coveredTransactions.length} transactions non-compliant (tolerance=${tolerancePct}%)`,
  };
}
