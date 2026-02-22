import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import Decimal from 'decimal.js';

import { FX_RATE_SCALE, ROUNDING_MODE } from '../constants';

/**
 * FX-09 — Triangulation: Cross-Rate via USD (A/USD × USD/B)
 *
 * Computes a cross-rate between two currencies using a vehicle currency (typically USD).
 * Supports bid/ask spread propagation.
 * Pure function — no I/O.
 */

export type TriangulationInput = {
  sourceCurrency: string;
  targetCurrency: string;
  vehicleCurrency: string;
  sourceToVehicleBid: number;
  sourceToVehicleAsk: number;
  vehicleToTargetBid: number;
  vehicleToTargetAsk: number;
};

export type TriangulationResult = {
  sourceCurrency: string;
  targetCurrency: string;
  crossRateBid: number;
  crossRateAsk: number;
  crossRateMid: number;
  spreadPct: number;
};

export function computeTriangulation(input: TriangulationInput): CalculatorResult<TriangulationResult> {
  const { sourceCurrency, targetCurrency, vehicleCurrency, sourceToVehicleBid, sourceToVehicleAsk, vehicleToTargetBid, vehicleToTargetAsk } = input;

  if (!sourceCurrency || !targetCurrency || !vehicleCurrency) {
    throw new DomainError('VALIDATION_FAILED', 'All currency codes are required');
  }
  if (sourceCurrency === targetCurrency) {
    throw new DomainError('VALIDATION_FAILED', 'Source and target currencies must differ');
  }
  if (sourceToVehicleBid <= 0 || sourceToVehicleAsk <= 0 || vehicleToTargetBid <= 0 || vehicleToTargetAsk <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'All rates must be positive');
  }
  if (sourceToVehicleBid > sourceToVehicleAsk) {
    throw new DomainError('VALIDATION_FAILED', 'Bid must not exceed ask for source/vehicle pair');
  }

  // Cross-rate: source/target = source/vehicle × vehicle/target (Decimal.js)
  const crossBid = new Decimal(sourceToVehicleBid).mul(vehicleToTargetBid);
  const crossAsk = new Decimal(sourceToVehicleAsk).mul(vehicleToTargetAsk);
  const crossMid = crossBid.plus(crossAsk).div(2);
  const spread = crossMid.gt(0)
    ? crossAsk.minus(crossBid).div(crossMid).mul(100)
    : new Decimal(0);

  return {
    result: {
      sourceCurrency,
      targetCurrency,
      crossRateBid: crossBid.toDecimalPlaces(FX_RATE_SCALE, ROUNDING_MODE).toNumber(),
      crossRateAsk: crossAsk.toDecimalPlaces(FX_RATE_SCALE, ROUNDING_MODE).toNumber(),
      crossRateMid: crossMid.toDecimalPlaces(FX_RATE_SCALE, ROUNDING_MODE).toNumber(),
      spreadPct: spread.toDecimalPlaces(2, ROUNDING_MODE).toNumber(),
    },
    inputs: { sourceCurrency, targetCurrency, vehicleCurrency },
    explanation: `Triangulation ${sourceCurrency}/${targetCurrency} via ${vehicleCurrency}: mid=${crossMid.toFixed(6)}, spread=${spread.toFixed(2)}%`,
  };
}
