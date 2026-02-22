import { describe, expect, it } from 'vitest';

import type { InvesteeData } from '../calculators/equity-method';
import {
  classifyConsolidationMethod,
  computeEquityMethodConsolidation,
} from '../calculators/equity-method';

describe('G-09 — Equity method consolidation (IAS 28 / IFRS 11)', () => {
  describe('classifyConsolidationMethod', () => {
    it('returns full for >50%', () => {
      expect(classifyConsolidationMethod(51)).toBe('full');
      expect(classifyConsolidationMethod(100)).toBe('full');
    });

    it('returns equity for 20-50%', () => {
      expect(classifyConsolidationMethod(20)).toBe('equity');
      expect(classifyConsolidationMethod(50)).toBe('equity');
      expect(classifyConsolidationMethod(35)).toBe('equity');
    });

    it('returns fair_value for <20%', () => {
      expect(classifyConsolidationMethod(19)).toBe('fair_value');
      expect(classifyConsolidationMethod(5)).toBe('fair_value');
      expect(classifyConsolidationMethod(0)).toBe('fair_value');
    });

    it('forces equity for joint ventures regardless of %', () => {
      expect(classifyConsolidationMethod(10, true)).toBe('equity');
      expect(classifyConsolidationMethod(50, true)).toBe('equity');
    });
  });

  describe('computeEquityMethodConsolidation', () => {
    const equityInvestee: InvesteeData = {
      investeeId: 'INV-1',
      name: 'Associate Alpha',
      ownershipPct: 30,
      investmentCostMinor: 300_000,
      netAssetsMinor: 800_000,
      profitLossMinor: 100_000,
      dividendsReceivedMinor: 10_000,
      ociMinor: 20_000,
    };

    const fairValueInvestee: InvesteeData = {
      investeeId: 'INV-2',
      name: 'Minor Holding Beta',
      ownershipPct: 10,
      investmentCostMinor: 50_000,
      netAssetsMinor: 500_000,
      profitLossMinor: 80_000,
      dividendsReceivedMinor: 5_000,
      fairValueMinor: 55_000,
    };

    it('computes equity method carrying amount correctly', () => {
      const { result } = computeEquityMethodConsolidation([equityInvestee]);
      const inv = result.investments[0]!;
      expect(inv.method).toBe('equity');
      // carrying = cost + shareOfPL + shareOfOCI - dividends
      // = 300_000 + 30_000 + 6_000 - 10_000 = 326_000
      expect(inv.carryingAmountMinor).toBe(326_000);
    });

    it('computes share of profit/loss for equity method', () => {
      const { result } = computeEquityMethodConsolidation([equityInvestee]);
      const inv = result.investments[0]!;
      expect(inv.shareOfProfitLossMinor).toBe(30_000); // 100_000 * 30%
    });

    it('computes share of OCI for equity method', () => {
      const { result } = computeEquityMethodConsolidation([equityInvestee]);
      const inv = result.investments[0]!;
      expect(inv.shareOfOciMinor).toBe(6_000); // 20_000 * 30%
    });

    it('computes implicit goodwill for equity method', () => {
      const { result } = computeEquityMethodConsolidation([equityInvestee]);
      const inv = result.investments[0]!;
      // goodwill = max(0, cost - shareOfNetAssets) = max(0, 300_000 - 240_000) = 60_000
      expect(inv.implicitGoodwillMinor).toBe(60_000);
    });

    it('uses fair value for <20% holdings', () => {
      const { result } = computeEquityMethodConsolidation([fairValueInvestee]);
      const inv = result.investments[0]!;
      expect(inv.method).toBe('fair_value');
      expect(inv.carryingAmountMinor).toBe(55_000);
      expect(inv.shareOfProfitLossMinor).toBe(0);
      expect(inv.dividendIncomeMinor).toBe(5_000);
    });

    it('falls back to cost when no fair value for <20%', () => {
      const noFv: InvesteeData = { ...fairValueInvestee, fairValueMinor: undefined };
      const { result } = computeEquityMethodConsolidation([noFv]);
      expect(result.investments[0]!.carryingAmountMinor).toBe(50_000);
    });

    it('handles joint venture as equity method', () => {
      const jv: InvesteeData = {
        investeeId: 'JV-1', name: 'Joint Venture Gamma', ownershipPct: 15,
        investmentCostMinor: 100_000, netAssetsMinor: 600_000,
        profitLossMinor: 50_000, dividendsReceivedMinor: 0, isJointVenture: true,
      };
      const { result } = computeEquityMethodConsolidation([jv]);
      expect(result.investments[0]!.method).toBe('equity');
      expect(result.investments[0]!.shareOfProfitLossMinor).toBe(7_500); // 50_000 * 15%
    });

    it('rejects >50% ownership (must use full consolidation)', () => {
      const full: InvesteeData = {
        investeeId: 'SUB-1', name: 'Subsidiary', ownershipPct: 60,
        investmentCostMinor: 500_000, netAssetsMinor: 800_000,
        profitLossMinor: 100_000, dividendsReceivedMinor: 0,
      };
      expect(() => computeEquityMethodConsolidation([full])).toThrow('full consolidation');
    });

    it('computes portfolio totals across mixed methods', () => {
      const { result } = computeEquityMethodConsolidation([equityInvestee, fairValueInvestee]);
      expect(result.investments).toHaveLength(2);
      expect(result.totalCarryingAmountMinor).toBe(326_000 + 55_000);
      expect(result.totalShareOfProfitLossMinor).toBe(30_000);
      expect(result.totalDividendIncomeMinor).toBe(5_000);
    });

    it('throws on empty investees', () => {
      expect(() => computeEquityMethodConsolidation([])).toThrow('No investees');
    });

    it('throws on invalid ownership percentage', () => {
      const bad: InvesteeData = {
        investeeId: 'X', name: 'Bad', ownershipPct: -5,
        investmentCostMinor: 0, netAssetsMinor: 0,
        profitLossMinor: 0, dividendsReceivedMinor: 0,
      };
      expect(() => computeEquityMethodConsolidation([bad])).toThrow('Invalid ownership');
    });
  });
});
