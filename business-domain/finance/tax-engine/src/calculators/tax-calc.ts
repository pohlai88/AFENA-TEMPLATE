import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import Decimal from 'decimal.js';

export type RoundingMethod = 'half_up' | 'half_down' | 'ceil' | 'floor' | 'banker';

export function calculateLineTax(
  baseMinor: number,
  rate: Decimal,
  roundingMethod: RoundingMethod,
): CalculatorResult<number> {
  if (!Number.isInteger(baseMinor)) {
    throw new DomainError('VALIDATION_FAILED', 'baseMinor must be integer minor units', {
      value: baseMinor,
    });
  }
  if (baseMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'baseMinor must be non-negative', {
      value: baseMinor,
    });
  }
  if (!rate.isFinite() || rate.lt(0)) {
    throw new DomainError('VALIDATION_FAILED', 'rate must be finite and >= 0', {
      rate: rate.toString(),
    });
  }

  const raw = new Decimal(baseMinor).mul(rate);
  let taxMinor: number;

  switch (roundingMethod) {
    case 'half_up':
      taxMinor = raw.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
      break;
    case 'half_down':
      taxMinor = raw.toDecimalPlaces(0, Decimal.ROUND_HALF_DOWN).toNumber();
      break;
    case 'ceil':
      taxMinor = raw.toDecimalPlaces(0, Decimal.ROUND_CEIL).toNumber();
      break;
    case 'floor':
      taxMinor = raw.toDecimalPlaces(0, Decimal.ROUND_FLOOR).toNumber();
      break;
    case 'banker':
      taxMinor = raw.toDecimalPlaces(0, Decimal.ROUND_HALF_EVEN).toNumber();
      break;
    default: {
      const _exhaustive: never = roundingMethod;
      throw new DomainError('VALIDATION_FAILED', 'Unknown rounding method', {
        roundingMethod: _exhaustive,
      });
    }
  }

  return {
    result: taxMinor,
    inputs: { baseMinor, rate: rate.toString(), roundingMethod },
    explanation: `Tax on ${baseMinor} at rate ${rate.toString()} (${roundingMethod}) = ${taxMinor}`,
  };
}

// ── Tax Cascade / Compound Tax ────────────────────────────────────────────────

/**
 * Determines how the tax base is computed for each row in a multi-row tax table.
 *
 * - `actual`                  — fixed amount, no percentage calculation
 * - `on_net_total`            — percentage of the document net total
 * - `on_previous_row_amount`  — percentage of the immediately preceding row's tax
 * - `on_previous_row_total`   — percentage of net total + all taxes through the previous row
 */
export type TaxChargeType =
  | 'actual'
  | 'on_net_total'
  | 'on_previous_row_amount'
  | 'on_previous_row_total';

/**
 * A single row in a tax table.
 */
export interface TaxRow {
  chargeType: TaxChargeType;
  /** Tax rate as a decimal fraction (e.g. 0.18 for 18 %).  Ignored when chargeType is 'actual'. */
  rate: Decimal;
  roundingMethod: RoundingMethod;
  /** Fixed tax in minor units — only used when chargeType is 'actual'. */
  actualAmountMinor?: number;
}

/**
 * Calculate taxes for a document with potentially cascading / compound rows.
 *
 * @example India GST + CESS
 * ```ts
 * calculateDocumentTaxes(1000000, [
 *   { chargeType: 'on_net_total', rate: new Decimal('0.18'), roundingMethod: 'half_up' },    // GST 18 %
 *   { chargeType: 'on_previous_row_amount', rate: new Decimal('0.01'), roundingMethod: 'half_up' }, // CESS 1 % of GST
 * ]);
 * // → { rowTaxes: [180000, 1800], totalTaxMinor: 181800 }
 * ```
 */
export function calculateDocumentTaxes(
  netTotalMinor: number,
  taxRows: TaxRow[],
): CalculatorResult<{ rowTaxes: number[]; totalTaxMinor: number }> {
  if (!Number.isInteger(netTotalMinor)) {
    throw new DomainError('VALIDATION_FAILED', 'netTotalMinor must be integer minor units', {
      value: netTotalMinor,
    });
  }
  if (netTotalMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'netTotalMinor must be non-negative', {
      value: netTotalMinor,
    });
  }

  const rowTaxes: number[] = [];
  let cumulativeTax = 0;

  for (let i = 0; i < taxRows.length; i++) {
    const row = taxRows[i]!;
    let taxMinor: number;

    switch (row.chargeType) {
      case 'actual': {
        const amt = row.actualAmountMinor ?? 0;
        if (!Number.isInteger(amt) || amt < 0) {
          throw new DomainError(
            'VALIDATION_FAILED',
            `Row ${i}: actualAmountMinor must be a non-negative integer`,
            {
              row: i,
              value: amt,
            },
          );
        }
        taxMinor = amt;
        break;
      }

      case 'on_net_total': {
        const calc = calculateLineTax(netTotalMinor, row.rate, row.roundingMethod);
        taxMinor = calc.result;
        break;
      }

      case 'on_previous_row_amount': {
        if (i === 0) {
          throw new DomainError(
            'VALIDATION_FAILED',
            'Row 0 cannot use on_previous_row_amount (no preceding row)',
            {
              row: i,
            },
          );
        }
        const prevTax = rowTaxes[i - 1]!;
        const calc = calculateLineTax(prevTax, row.rate, row.roundingMethod);
        taxMinor = calc.result;
        break;
      }

      case 'on_previous_row_total': {
        if (i === 0) {
          throw new DomainError(
            'VALIDATION_FAILED',
            'Row 0 cannot use on_previous_row_total (no preceding row)',
            {
              row: i,
            },
          );
        }
        const base = netTotalMinor + cumulativeTax;
        const calc = calculateLineTax(base, row.rate, row.roundingMethod);
        taxMinor = calc.result;
        break;
      }

      default: {
        const _exhaustive: never = row.chargeType;
        throw new DomainError('VALIDATION_FAILED', 'Unknown tax charge type', {
          chargeType: _exhaustive,
        });
      }
    }

    rowTaxes.push(taxMinor);
    cumulativeTax += taxMinor;
  }

  return {
    result: { rowTaxes, totalTaxMinor: cumulativeTax },
    inputs: { netTotalMinor, taxRows: taxRows.length },
    explanation: `Document tax: net=${netTotalMinor}, rows=${taxRows.length}, total_tax=${cumulativeTax}`,
  };
}
