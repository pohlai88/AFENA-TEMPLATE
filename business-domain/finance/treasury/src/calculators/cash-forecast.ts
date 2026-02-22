import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see TR-02 — Cash flow forecast: actual + committed + projected
 * @see TR-03 — Actual vs forecast variance analysis
 */
export type CashFlowEntry = {
  dateIso: string;
  amountMinor: number;
  category: string;
  probability: number;
};

export type DailyPosition = {
  dateIso: string;
  positionMinor: number;
};

export type CashForecastResult = {
  dailyPositions: DailyPosition[];
  lowestPointMinor: number;
  lowestPointDate: string | null;
  daysUntilNegative: number | null;
};

export function forecastCashFlow(
  startingBalanceMinor: number,
  inflows: CashFlowEntry[],
  outflows: CashFlowEntry[],
  horizonDays: number,
  startDateIso: string,
): CalculatorResult<CashForecastResult> {
  if (!Number.isInteger(horizonDays) || horizonDays <= 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `horizonDays must be a positive integer, got ${horizonDays}`,
    );
  }
  if (!Number.isInteger(startingBalanceMinor)) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `startingBalanceMinor must be an integer, got ${startingBalanceMinor}`,
    );
  }

  const netByDate = new Map<string, number>();

  for (const entry of inflows) {
    const weighted = Math.round(entry.amountMinor * entry.probability);
    netByDate.set(entry.dateIso, (netByDate.get(entry.dateIso) ?? 0) + weighted);
  }
  for (const entry of outflows) {
    const weighted = Math.round(entry.amountMinor * entry.probability);
    netByDate.set(entry.dateIso, (netByDate.get(entry.dateIso) ?? 0) - weighted);
  }

  const dailyPositions: DailyPosition[] = [];
  let runningBalance = startingBalanceMinor;
  let lowestPointMinor = startingBalanceMinor;
  let lowestPointDate: string | null = null;
  let daysUntilNegative: number | null = null;

  const parts = startDateIso.split('-').map(Number);
  const y = parts[0] ?? 2000;
  const m = parts[1] ?? 1;
  const startDay = parts[2] ?? 1;

  for (let d = 0; d < horizonDays; d++) {
    const dayNum = startDay + d;
    const dateIso = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    runningBalance += netByDate.get(dateIso) ?? 0;

    dailyPositions.push({ dateIso, positionMinor: runningBalance });

    if (runningBalance < lowestPointMinor) {
      lowestPointMinor = runningBalance;
      lowestPointDate = dateIso;
    }
    if (runningBalance < 0 && daysUntilNegative === null) {
      daysUntilNegative = d;
    }
  }

  return {
    result: { dailyPositions, lowestPointMinor, lowestPointDate, daysUntilNegative },
    inputs: { startingBalanceMinor, inflows, outflows, horizonDays, startDateIso },
    explanation: `Cash forecast: ${horizonDays} days from ${startDateIso}, lowest=${lowestPointMinor}${daysUntilNegative !== null ? `, negative at day ${daysUntilNegative}` : ''}`,
  };
}
