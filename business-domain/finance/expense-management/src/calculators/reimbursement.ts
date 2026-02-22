import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see EM-09 — Reimbursement payment via AP run
 */
export type ApprovedClaim = { claimId: string; amountMinor: number; currency: string };
export type FxRate = { from: string; to: string; rate: number };
export type ReimbursementLine = {
  claimId: string;
  originalMinor: number;
  convertedMinor: number;
  currency: string;
};

export type ReimbursementResult = {
  totalMinor: number;
  currency: string;
  lineItems: ReimbursementLine[];
};

export function computeReimbursement(
  claims: ApprovedClaim[],
  homeCurrency: string,
  fxRates: FxRate[],
): CalculatorResult<ReimbursementResult> {
  const rateMap = new Map<string, number>();
  for (const r of fxRates) {
    rateMap.set(`${r.from}->${r.to}`, r.rate);
  }

  let totalMinor = 0;
  const lineItems: ReimbursementLine[] = [];

  for (const claim of claims) {
    let convertedMinor: number;
    if (claim.currency === homeCurrency) {
      convertedMinor = claim.amountMinor;
    } else {
      const rate = rateMap.get(`${claim.currency}->${homeCurrency}`);
      if (rate === undefined) {
        throw new DomainError(
          'FX_RATE_NOT_FOUND',
          `No FX rate for ${claim.currency} -> ${homeCurrency}`,
        );
      }
      convertedMinor = Math.round(claim.amountMinor * rate);
    }
    totalMinor += convertedMinor;
    lineItems.push({
      claimId: claim.claimId,
      originalMinor: claim.amountMinor,
      convertedMinor,
      currency: claim.currency,
    });
  }

  return {
    result: { totalMinor, currency: homeCurrency, lineItems },
    inputs: { claims, homeCurrency, fxRates },
    explanation: `Reimbursement: ${totalMinor} ${homeCurrency} across ${lineItems.length} claims`,
  };
}
