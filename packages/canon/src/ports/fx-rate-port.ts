import type { OrgId } from '../types/ids';

/**
 * FxRatePort — cross-cutting read interface for foreign exchange rates.
 *
 * Implemented by: fx-management adapter
 * Consumed by: accounting, consolidation, fixed-assets, treasury, payables, receivables
 *
 * Rule: Returns domain DTOs, never Drizzle row types.
 */

export type FxRateType = 'spot' | 'average' | 'closing' | 'budget';

export interface FxRateInfo {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: string;
  rateType: FxRateType;
  source?: string;
}

export interface FxRatePort {
  /** Get the exchange rate for a currency pair on a given date. */
  getRate(
    orgId: OrgId,
    fromCurrency: string,
    toCurrency: string,
    effectiveDate: string,
    rateType: FxRateType,
  ): Promise<FxRateInfo | null>;

  /** Get the closing rate for period-end revaluation. */
  getClosingRate(
    orgId: OrgId,
    fromCurrency: string,
    toCurrency: string,
    periodEndDate: string,
  ): Promise<FxRateInfo | null>;

  /** Get the average rate for a period (e.g., for P&L translation). */
  getAverageRate(
    orgId: OrgId,
    fromCurrency: string,
    toCurrency: string,
    periodStartDate: string,
    periodEndDate: string,
  ): Promise<FxRateInfo | null>;
}
