import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see CM-01 — Credit limit assignment and review
 * @see CM-03 — Credit scoring model (internal rating)
 * @see CM-04 — Credit hold / release workflow
 * @see CM-07 — Bad debt write-off approval workflow
 */

export type BadDebtCandidate = {
  invoiceId: string;
  customerId: string;
  outstandingMinor: number;
  daysPastDue: number;
  eclStage: 1 | 2 | 3;
  collateralMinor: number;
};

export type BadDebtWriteOffResult = {
  candidates: Array<{ invoiceId: string; writeOffMinor: number; netExposureMinor: number; recommendation: 'write_off' | 'partial_write_off' | 'hold' }>;
  totalWriteOffMinor: number;
  totalHeldMinor: number;
  candidateCount: number;
};

export function evaluateBadDebtWriteOffs(
  candidates: BadDebtCandidate[],
  minDaysPastDue: number = 180,
): CalculatorResult<BadDebtWriteOffResult> {
  if (candidates.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Must provide at least one candidate');
  }

  const results = candidates.map((c) => {
    const netExposure = Math.max(0, c.outstandingMinor - c.collateralMinor);
    let recommendation: 'write_off' | 'partial_write_off' | 'hold';
    let writeOff: number;

    if (c.eclStage === 3 && c.daysPastDue >= minDaysPastDue) {
      if (c.collateralMinor > 0 && c.collateralMinor < c.outstandingMinor) {
        recommendation = 'partial_write_off';
        writeOff = netExposure;
      } else {
        recommendation = 'write_off';
        writeOff = netExposure;
      }
    } else {
      recommendation = 'hold';
      writeOff = 0;
    }

    return { invoiceId: c.invoiceId, writeOffMinor: writeOff, netExposureMinor: netExposure, recommendation };
  });

  const totalWriteOff = results.reduce((s, r) => s + r.writeOffMinor, 0);
  const totalHeld = results.filter((r) => r.recommendation === 'hold').reduce((s, r) => s + r.netExposureMinor, 0);

  return {
    result: { candidates: results, totalWriteOffMinor: totalWriteOff, totalHeldMinor: totalHeld, candidateCount: candidates.length },
    inputs: { candidateCount: candidates.length, minDaysPastDue },
    explanation: `Bad debt review: ${results.filter((r) => r.recommendation !== 'hold').length} of ${candidates.length} recommended for write-off. Total: ${totalWriteOff}. Held: ${totalHeld}.`,
  };
}
