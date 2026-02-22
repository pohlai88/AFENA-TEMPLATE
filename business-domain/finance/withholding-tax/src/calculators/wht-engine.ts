/**
 * @see AP-07 — Withholding tax deduction at payment (WHT)
 * @see TX-06 — Withholding tax (WHT): rate per payee type + treaty override
 * WHT Computation Engine
 *
 * Computes withholding tax amounts based on WHT codes, rates, and
 * payment details. Handles domestic, treaty, and exempt rate types.
 */
import type { CalculatorResult } from 'afenda-canon';

export interface WhtRateConfig {
  rateType: 'domestic' | 'treaty' | 'exempt';
  treatyCountry: string | null;
  /** Rate as a decimal fraction (e.g. 0.10 for 10%) */
  rate: number;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface WhtComputationInput {
  grossAmountMinor: number;
  currencyCode: string;
  paymentDate: string;
  /** Payee's country for treaty rate lookup */
  payeeCountry?: string;
  /** Available rates for selected WHT code */
  rates: WhtRateConfig[];
}

export interface WhtComputationResult {
  grossAmountMinor: number;
  whtAmountMinor: number;
  netAmountMinor: number;
  appliedRate: number;
  rateType: 'domestic' | 'treaty' | 'exempt';
  currencyCode: string;
}

/**
 * Compute WHT for a payment. Selects the applicable rate by:
 * 1. Treaty rate if payee country matches a treaty rate
 * 2. Domestic rate as fallback
 * 3. Exempt rate if available and no other match
 *
 * Only rates effective on the payment date are considered.
 */
export function computeWht(input: WhtComputationInput): CalculatorResult<WhtComputationResult> {
  const { grossAmountMinor, currencyCode, paymentDate, payeeCountry, rates } = input;

  // Filter to rates effective on payment date
  const effectiveRates = rates.filter((r) => {
    if (paymentDate < r.effectiveFrom) return false;
    if (r.effectiveTo && paymentDate > r.effectiveTo) return false;
    return true;
  });

  // Select rate: treaty → domestic → exempt
  let selected: WhtRateConfig | undefined;

  if (payeeCountry) {
    selected = effectiveRates.find(
      (r) => r.rateType === 'treaty' && r.treatyCountry === payeeCountry,
    );
  }

  if (!selected) {
    selected = effectiveRates.find((r) => r.rateType === 'domestic');
  }

  if (!selected) {
    selected = effectiveRates.find((r) => r.rateType === 'exempt');
  }

  if (!selected) {
    throw new Error(`No applicable WHT rate found for payment date ${paymentDate}`);
  }

  const appliedRate = selected.rate;
  const whtAmountMinor = Math.round(grossAmountMinor * appliedRate);
  const netAmountMinor = grossAmountMinor - whtAmountMinor;

  return {
    result: {
      grossAmountMinor,
      whtAmountMinor,
      netAmountMinor,
      appliedRate,
      rateType: selected.rateType,
      currencyCode,
    },
    inputs: { grossAmountMinor, currencyCode, paymentDate, payeeCountry: payeeCountry ?? null },
    explanation: `WHT: ${selected.rateType} rate ${(appliedRate * 100).toFixed(1)}% on ${grossAmountMinor} = ${whtAmountMinor} withheld, net ${netAmountMinor}`,
  };
}

/**
 * Validate that WHT amounts are consistent.
 */
export function validateWhtAmounts(
  gross: number,
  wht: number,
  net: number,
): CalculatorResult<{ valid: boolean; message: string }> {
  if (gross - wht !== net) {
    return {
      result: {
        valid: false,
        message: `Amount mismatch: gross(${gross}) - wht(${wht}) = ${gross - wht}, expected net(${net})`,
      },
      inputs: { gross, wht, net },
      explanation: `Validation failed: ${gross} - ${wht} ≠ ${net}`,
    };
  }
  if (wht < 0) {
    return {
      result: { valid: false, message: 'WHT amount cannot be negative' },
      inputs: { gross, wht, net },
      explanation: 'Validation failed: negative WHT',
    };
  }
  if (wht > gross) {
    return {
      result: { valid: false, message: 'WHT amount exceeds gross amount' },
      inputs: { gross, wht, net },
      explanation: 'Validation failed: WHT exceeds gross',
    };
  }
  return {
    result: { valid: true, message: 'OK' },
    inputs: { gross, wht, net },
    explanation: `WHT amounts valid: ${gross} - ${wht} = ${net}`,
  };
}
