import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * G-04 / TR-09 — Intercompany Loan Management (IAS 24)
 *
 * Manages IC loan positions, computes interest accruals at arm's length rates,
 * and tracks outstanding balances for related-party disclosure (IAS 24).
 *
 * Pure function — no I/O.
 */

export type IcLoan = {
  loanId: string;
  lenderCompanyId: string;
  borrowerCompanyId: string;
  principalMinor: number;
  annualRateBps: number;
  startDate: string;
  maturityDate: string;
  currency: string;
};

export type IcLoanAccrual = {
  loanId: string;
  lenderCompanyId: string;
  borrowerCompanyId: string;
  principalMinor: number;
  accruedInterestMinor: number;
  dailyRateMinor: number;
  daysAccrued: number;
  totalOutstandingMinor: number;
  isOverdue: boolean;
};

export type IcLoanPortfolioResult = {
  accruals: IcLoanAccrual[];
  totalPrincipalMinor: number;
  totalAccruedInterestMinor: number;
  totalOutstandingMinor: number;
  overdueCount: number;
};

/**
 * Compute IC loan accruals as of a given date.
 *
 * Interest = principal × (annualRateBps / 10000) × (daysAccrued / 365)
 */
export function computeIcLoanAccruals(
  loans: IcLoan[],
  asOfDate: string,
): CalculatorResult<IcLoanPortfolioResult> {
  if (loans.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one IC loan required');
  }

  const asOf = new Date(asOfDate).getTime();
  const accruals: IcLoanAccrual[] = [];

  for (const loan of loans) {
    if (loan.lenderCompanyId === loan.borrowerCompanyId) {
      throw new DomainError('VALIDATION_FAILED', `IC loan ${loan.loanId}: lender and borrower must differ`);
    }
    if (loan.principalMinor <= 0) {
      throw new DomainError('VALIDATION_FAILED', `IC loan ${loan.loanId}: principal must be positive`);
    }

    const startMs = new Date(loan.startDate).getTime();
    const maturityMs = new Date(loan.maturityDate).getTime();
    const daysAccrued = Math.max(0, Math.floor((asOf - startMs) / 86_400_000));
    const annualRate = loan.annualRateBps / 10000;
    const accruedInterestMinor = Math.round(loan.principalMinor * annualRate * (daysAccrued / 365));
    const dailyRateMinor = Math.round(loan.principalMinor * annualRate / 365);
    const isOverdue = asOf > maturityMs;

    accruals.push({
      loanId: loan.loanId,
      lenderCompanyId: loan.lenderCompanyId,
      borrowerCompanyId: loan.borrowerCompanyId,
      principalMinor: loan.principalMinor,
      accruedInterestMinor,
      dailyRateMinor,
      daysAccrued,
      totalOutstandingMinor: loan.principalMinor + accruedInterestMinor,
      isOverdue,
    });
  }

  return {
    result: {
      accruals,
      totalPrincipalMinor: accruals.reduce((s, a) => s + a.principalMinor, 0),
      totalAccruedInterestMinor: accruals.reduce((s, a) => s + a.accruedInterestMinor, 0),
      totalOutstandingMinor: accruals.reduce((s, a) => s + a.totalOutstandingMinor, 0),
      overdueCount: accruals.filter((a) => a.isOverdue).length,
    },
    inputs: { loanCount: loans.length, asOfDate },
    explanation: `IC loans: ${loans.length} loans, total outstanding ${accruals.reduce((s, a) => s + a.totalOutstandingMinor, 0)}, ${accruals.filter((a) => a.isOverdue).length} overdue`,
  };
}
