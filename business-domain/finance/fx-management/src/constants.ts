/**
 * FX Management Constants — Rounding Contract
 *
 * Defines the canonical scale and rounding mode for all FX calculations.
 * All FX calculators MUST use these constants to prevent cross-calculator drift.
 *
 * @see oss-finance-ext.md M-02, AD-06
 */
import Decimal from 'decimal.js';

/** Decimal places for exchange rates (matches fxRate() helper: numeric(20,10)) */
export const FX_RATE_SCALE = 10;

/** Decimal places for amounts (minor units are integers — no fractional cents) */
export const AMOUNT_SCALE = 0;

/** Standard accounting rounding mode */
export const ROUNDING_MODE = Decimal.ROUND_HALF_UP;
