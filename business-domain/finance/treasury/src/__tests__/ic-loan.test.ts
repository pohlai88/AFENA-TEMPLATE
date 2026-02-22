import { describe, expect, it } from 'vitest';
import { computeIcLoanAccruals } from '../calculators/ic-loan';
import type { IcLoan } from '../calculators/ic-loan';

const loans: IcLoan[] = [
  { loanId: 'icl-1', lenderCompanyId: 'co-hq', borrowerCompanyId: 'co-sg', principalMinor: 10000000, annualRateBps: 500, startDate: '2025-01-01', maturityDate: '2026-12-31', currency: 'USD' },
  { loanId: 'icl-2', lenderCompanyId: 'co-hq', borrowerCompanyId: 'co-us', principalMinor: 5000000, annualRateBps: 350, startDate: '2025-06-01', maturityDate: '2025-12-31', currency: 'USD' },
];

describe('computeIcLoanAccruals', () => {
  it('computes interest accrual based on days', () => {
    const { result } = computeIcLoanAccruals(loans, '2026-01-15');
    const loan1 = result.accruals.find((a) => a.loanId === 'icl-1')!;
    expect(loan1.accruedInterestMinor).toBeGreaterThan(0);
    expect(loan1.daysAccrued).toBeGreaterThan(365);
  });

  it('detects overdue loans', () => {
    const { result } = computeIcLoanAccruals(loans, '2026-01-15');
    const loan2 = result.accruals.find((a) => a.loanId === 'icl-2')!;
    expect(loan2.isOverdue).toBe(true);
  });

  it('computes total outstanding', () => {
    const { result } = computeIcLoanAccruals(loans, '2026-01-15');
    expect(result.totalPrincipalMinor).toBe(15000000);
    expect(result.totalOutstandingMinor).toBeGreaterThan(15000000);
  });

  it('counts overdue loans', () => {
    const { result } = computeIcLoanAccruals(loans, '2026-01-15');
    expect(result.overdueCount).toBe(1);
  });

  it('throws for same lender/borrower', () => {
    const bad: IcLoan[] = [{ loanId: 'bad', lenderCompanyId: 'a', borrowerCompanyId: 'a', principalMinor: 100, annualRateBps: 100, startDate: '2025-01-01', maturityDate: '2026-01-01', currency: 'USD' }];
    expect(() => computeIcLoanAccruals(bad, '2025-06-01')).toThrow('lender and borrower must differ');
  });

  it('throws for empty loans', () => {
    expect(() => computeIcLoanAccruals([], '2025-06-01')).toThrow('At least one');
  });
});
