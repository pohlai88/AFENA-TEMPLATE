/**
 * IFRS 2.10 — Black-Scholes Option Valuation
 *
 * Computes the fair value of share options at grant date using
 * a simplified Black-Scholes model for IFRS 2 expense recognition.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type BlackScholesInput = {
  spotPriceMinor: number;
  strikePriceMinor: number;
  timeToExpiryYears: number;
  riskFreeRate: number;
  volatility: number;
  dividendYield: number;
};

export type BlackScholesResult = {
  optionValueMinor: number;
  d1: number;
  d2: number;
  intrinsicValueMinor: number;
  timeValueMinor: number;
  explanation: string;
};

function normalCdf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2);
  return 0.5 * (1.0 + sign * y);
}

export function computeBlackScholesValuation(
  inputs: BlackScholesInput,
): CalculatorResult<BlackScholesResult> {
  const { spotPriceMinor, strikePriceMinor, timeToExpiryYears, riskFreeRate, volatility, dividendYield } = inputs;

  if (spotPriceMinor <= 0) throw new DomainError('VALIDATION_FAILED', 'Spot price must be positive');
  if (strikePriceMinor <= 0) throw new DomainError('VALIDATION_FAILED', 'Strike price must be positive');
  if (timeToExpiryYears <= 0) throw new DomainError('VALIDATION_FAILED', 'Time to expiry must be positive');
  if (volatility <= 0) throw new DomainError('VALIDATION_FAILED', 'Volatility must be positive');

  const sqrtT = Math.sqrt(timeToExpiryYears);
  const d1 = (Math.log(spotPriceMinor / strikePriceMinor) +
    (riskFreeRate - dividendYield + 0.5 * volatility * volatility) * timeToExpiryYears) /
    (volatility * sqrtT);
  const d2 = d1 - volatility * sqrtT;

  const optionValue =
    spotPriceMinor * Math.exp(-dividendYield * timeToExpiryYears) * normalCdf(d1) -
    strikePriceMinor * Math.exp(-riskFreeRate * timeToExpiryYears) * normalCdf(d2);

  const optionValueMinor = Math.round(optionValue);
  const intrinsicValueMinor = Math.max(0, spotPriceMinor - strikePriceMinor);
  const timeValueMinor = optionValueMinor - intrinsicValueMinor;

  const explanation =
    `Black-Scholes (IFRS 2.10): option value ${optionValueMinor} ` +
    `(intrinsic ${intrinsicValueMinor} + time ${timeValueMinor}), ` +
    `vol ${(volatility * 100).toFixed(1)}%, T=${timeToExpiryYears}y`;

  return {
    result: { optionValueMinor, d1, d2, intrinsicValueMinor, timeValueMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
