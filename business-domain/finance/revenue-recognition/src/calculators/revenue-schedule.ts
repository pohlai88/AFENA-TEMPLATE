import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type RevenueMethod =
  | 'straight_line'
  | 'milestone'
  | 'percentage_of_completion'
  | 'delivered_units';

export type RevenueScheduleEntry = {
  periodStartIso: string;
  periodEndIso: string;
  recognizedMinor: number;
  deferredMinor: number;
  cumulativeMinor: number;
};

export function buildRevenueSchedule(
  totalMinor: number,
  startDateIso: string,
  endDateIso: string,
  method: RevenueMethod,
): CalculatorResult<RevenueScheduleEntry[]> {
  if (!Number.isInteger(totalMinor) || totalMinor <= 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `totalMinor must be a positive integer, got ${totalMinor}`,
    );
  }

  const startParts = parseIsoDate(startDateIso);
  const endParts = parseIsoDate(endDateIso);
  if (!startParts || !endParts) {
    throw new DomainError(
      'VALIDATION_FAILED',
      'startDateIso and endDateIso must be valid ISO date strings (YYYY-MM-DD)',
    );
  }

  const totalPeriods = (endParts.year - startParts.year) * 12 + (endParts.month - startParts.month);

  if (totalPeriods <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'startDateIso must be before endDateIso');
  }

  const entries: RevenueScheduleEntry[] = [];

  if (method === 'straight_line') {
    const perPeriod = Math.floor(totalMinor / totalPeriods);
    const remainder = totalMinor - perPeriod * totalPeriods;
    let cumulative = 0;

    for (let i = 0; i < totalPeriods; i++) {
      const recognized = perPeriod + (i === totalPeriods - 1 ? remainder : 0);
      cumulative += recognized;
      entries.push({
        periodStartIso: addMonthsIso(startParts, i),
        periodEndIso: addMonthsIso(startParts, i + 1),
        recognizedMinor: recognized,
        deferredMinor: totalMinor - cumulative,
        cumulativeMinor: cumulative,
      });
    }
  } else {
    let cumulative = 0;
    for (let i = 0; i < totalPeriods; i++) {
      const recognized = i === totalPeriods - 1 ? totalMinor - cumulative : 0;
      cumulative += recognized;
      entries.push({
        periodStartIso: addMonthsIso(startParts, i),
        periodEndIso: addMonthsIso(startParts, i + 1),
        recognizedMinor: recognized,
        deferredMinor: totalMinor - cumulative,
        cumulativeMinor: cumulative,
      });
    }
  }

  return {
    result: entries,
    inputs: { totalMinor, startDateIso, endDateIso, method },
    explanation: `Revenue schedule (${method}): ${entries.length} periods, total=${totalMinor}`,
  };
}

type YearMonth = { year: number; month: number; day: number };

function parseIsoDate(iso: string): YearMonth | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return { year: parseInt(m[1]!, 10), month: parseInt(m[2]!, 10), day: parseInt(m[3]!, 10) };
}

function addMonthsIso(base: YearMonth, months: number): string {
  const totalMonths = base.year * 12 + (base.month - 1) + months;
  const year = Math.floor(totalMonths / 12);
  const month = (totalMonths % 12) + 1;
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(base.day).padStart(2, '0')}`;
}
