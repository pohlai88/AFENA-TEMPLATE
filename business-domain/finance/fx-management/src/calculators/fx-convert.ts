import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import Decimal from 'decimal.js';

export type FxConversionResult = {
  fromMinor: number;
  toMinor: number;
  rate: string;
  fromCurrency: string;
  toCurrency: string;
};

export function convertAmount(
  amountMinor: number,
  rate: string,
  fromCurrency: string,
  toCurrency: string,
): CalculatorResult<FxConversionResult> {
  if (!Number.isInteger(amountMinor)) {
    throw new DomainError('VALIDATION_FAILED', 'amountMinor must be integer minor units', {
      value: amountMinor,
    });
  }
  if (amountMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'amountMinor must be non-negative', {
      value: amountMinor,
    });
  }

  const decRate = new Decimal(rate);
  if (!decRate.isFinite() || decRate.lte(0)) {
    throw new DomainError('VALIDATION_FAILED', 'rate must be finite and > 0', {
      rate,
    });
  }

  if (fromCurrency === toCurrency) {
    return {
      result: { fromMinor: amountMinor, toMinor: amountMinor, rate: '1', fromCurrency, toCurrency },
      inputs: { amountMinor, rate, fromCurrency, toCurrency },
      explanation: `Same currency (${fromCurrency}), no conversion needed`,
    };
  }

  const converted = new Decimal(amountMinor)
    .mul(decRate)
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .toNumber();

  return {
    result: {
      fromMinor: amountMinor,
      toMinor: converted,
      rate,
      fromCurrency,
      toCurrency,
    },
    inputs: { amountMinor, rate, fromCurrency, toCurrency },
    explanation: `Converted ${amountMinor} ${fromCurrency} → ${converted} ${toCurrency} at rate ${rate}`,
  };
}

export function computeGainLoss(
  originalMinor: number,
  revaluedMinor: number,
): CalculatorResult<{ gainLossMinor: number; isGain: boolean }> {
  const diff = revaluedMinor - originalMinor;
  return {
    result: { gainLossMinor: Math.abs(diff), isGain: diff >= 0 },
    inputs: { originalMinor, revaluedMinor },
    explanation: `FX ${diff >= 0 ? 'gain' : 'loss'}: ${Math.abs(diff)} minor units`,
  };
}
