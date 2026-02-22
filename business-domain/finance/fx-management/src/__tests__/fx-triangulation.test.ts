import { describe, expect, it } from 'vitest';
import { computeTriangulation } from '../calculators/fx-triangulation';

describe('FX-09 — Triangulation', () => {
  it('computes cross-rate via USD', () => {
    const { result } = computeTriangulation({
      sourceCurrency: 'EUR',
      targetCurrency: 'JPY',
      vehicleCurrency: 'USD',
      sourceToVehicleBid: 1.0800,
      sourceToVehicleAsk: 1.0810,
      vehicleToTargetBid: 149.50,
      vehicleToTargetAsk: 149.60,
    });
    expect(result.crossRateBid).toBeCloseTo(1.0800 * 149.50, 2);
    expect(result.crossRateAsk).toBeCloseTo(1.0810 * 149.60, 2);
    expect(result.crossRateMid).toBeGreaterThan(0);
    expect(result.spreadPct).toBeGreaterThan(0);
  });

  it('returns CalculatorResult shape', () => {
    const res = computeTriangulation({
      sourceCurrency: 'GBP', targetCurrency: 'CHF', vehicleCurrency: 'USD',
      sourceToVehicleBid: 1.25, sourceToVehicleAsk: 1.26,
      vehicleToTargetBid: 0.88, vehicleToTargetAsk: 0.89,
    });
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws when source equals target', () => {
    expect(() => computeTriangulation({
      sourceCurrency: 'USD', targetCurrency: 'USD', vehicleCurrency: 'EUR',
      sourceToVehicleBid: 1, sourceToVehicleAsk: 1, vehicleToTargetBid: 1, vehicleToTargetAsk: 1,
    })).toThrow('must differ');
  });

  it('throws on negative rates', () => {
    expect(() => computeTriangulation({
      sourceCurrency: 'EUR', targetCurrency: 'JPY', vehicleCurrency: 'USD',
      sourceToVehicleBid: -1, sourceToVehicleAsk: 1, vehicleToTargetBid: 1, vehicleToTargetAsk: 1,
    })).toThrow('positive');
  });

  it('throws when bid exceeds ask', () => {
    expect(() => computeTriangulation({
      sourceCurrency: 'EUR', targetCurrency: 'JPY', vehicleCurrency: 'USD',
      sourceToVehicleBid: 1.10, sourceToVehicleAsk: 1.05,
      vehicleToTargetBid: 149, vehicleToTargetAsk: 150,
    })).toThrow('Bid must not exceed ask');
  });
});
