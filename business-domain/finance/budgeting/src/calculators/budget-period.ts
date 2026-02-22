import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see BU-07 — Budget period: monthly / quarterly / annual
 */
export type BudgetPeriodConfig = {
  fiscalYearStart: string;
  granularity: 'monthly' | 'quarterly' | 'annual';
  companyId: string;
};

export type BudgetPeriod = {
  periodId: string;
  label: string;
  startDate: string;
  endDate: string;
};

export type BudgetPeriodResult = {
  periods: BudgetPeriod[];
  periodCount: number;
  granularity: string;
};

export function generateBudgetPeriods(
  config: BudgetPeriodConfig,
): CalculatorResult<BudgetPeriodResult> {
  const start = new Date(config.fiscalYearStart);
  if (isNaN(start.getTime())) {
    throw new DomainError('VALIDATION_FAILED', 'Invalid fiscal year start date');
  }

  const fmt = (d: Date): string => {
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  };
  const fmtMonth = (d: Date): string => {
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${yy}-${mm}`;
  };

  const periods: BudgetPeriod[] = [];
  const year = start.getFullYear();

  if (config.granularity === 'monthly') {
    for (let m = 0; m < 12; m++) {
      const s = new Date(year, start.getMonth() + m, 1);
      const e = new Date(year, start.getMonth() + m + 1, 0);
      const label = fmtMonth(s);
      periods.push({ periodId: `${config.companyId}-${label}`, label, startDate: fmt(s), endDate: fmt(e) });
    }
  } else if (config.granularity === 'quarterly') {
    for (let q = 0; q < 4; q++) {
      const s = new Date(year, start.getMonth() + q * 3, 1);
      const e = new Date(year, start.getMonth() + (q + 1) * 3, 0);
      periods.push({ periodId: `${config.companyId}-Q${q + 1}-${year}`, label: `Q${q + 1} ${year}`, startDate: fmt(s), endDate: fmt(e) });
    }
  } else {
    const e = new Date(year + 1, start.getMonth(), 0);
    periods.push({ periodId: `${config.companyId}-FY${year}`, label: `FY${year}`, startDate: config.fiscalYearStart, endDate: fmt(e) });
  }

  return {
    result: { periods, periodCount: periods.length, granularity: config.granularity },
    inputs: { fiscalYearStart: config.fiscalYearStart, granularity: config.granularity },
    explanation: `Generated ${periods.length} ${config.granularity} budget periods for FY starting ${config.fiscalYearStart}.`,
  };
}
