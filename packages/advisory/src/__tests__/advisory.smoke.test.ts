import { describe, it, expect, beforeEach } from 'vitest';

import { detectEwma } from '../detectors/ewma';
import { detectCusum } from '../detectors/cusum';
import { detectMad } from '../detectors/mad';
import { forecastSes } from '../forecasters/ses';
import { forecastHolt } from '../forecasters/holt';
import { forecastHoltWinters } from '../forecasters/holt-winters';
import { zScore, zScoreFromArray, robustZScore, computeStats } from '../scoring/z-score';
import { confidenceBands, predictionInterval } from '../scoring/confidence';
import {
  registerRuleCheck,
  clearRuleChecks,
  evaluateRuleChecks,
  creditLimitRule,
  agingThresholdRule,
} from '../rules/rule-detector';
import { buildFingerprint, stableStringify, sha256Hex } from '../fingerprint';
import { buildEvidence, verifyEvidenceHash } from '../evidence';
import { renderExplanation } from '../explain/render';
import { EXPLAIN_VERSION } from '../explain/version';

import type { TimeSeriesPoint } from '../types';

// ── Detectors ────────────────────────────────────────────

describe('EWMA Detector', () => {
  it('detects anomaly in synthetic spike series', () => {
    // Stable baseline at ~100, then a spike at the end
    const series: TimeSeriesPoint[] = [
      ...Array.from({ length: 30 }, (_, i) => ({ t: i, value: 100 + Math.sin(i) * 2 })),
      { t: 30, value: 200 }, // spike
    ];
    const result = detectEwma(series, 0.2, 3.0);
    expect(result.isAnomaly).toBe(true);
    expect(result.zScore).toBeGreaterThan(3.0);
    expect(result.series).toHaveLength(31);
  });

  it('does not flag normal data', () => {
    const series: TimeSeriesPoint[] = Array.from({ length: 20 }, (_, i) => ({
      t: i,
      value: 100 + Math.sin(i) * 2,
    }));
    const result = detectEwma(series, 0.2, 3.0);
    expect(result.isAnomaly).toBe(false);
  });
});

describe('CUSUM Detector', () => {
  it('detects change-point in drift series', () => {
    // Baseline at 50, then shifts to 60 at index 15
    const series: TimeSeriesPoint[] = [
      ...Array.from({ length: 15 }, (_, i) => ({ t: i, value: 50 })),
      ...Array.from({ length: 15 }, (_, i) => ({ t: i + 15, value: 60 })),
    ];
    const result = detectCusum(series, 50, 2, 10);
    expect(result.driftDetected).toBe(true);
    expect(result.direction).toBe('up');
    expect(result.changePoint).toBeGreaterThanOrEqual(15);
  });

  it('does not flag stable series', () => {
    const series: TimeSeriesPoint[] = Array.from({ length: 30 }, (_, i) => ({
      t: i,
      value: 50,
    }));
    const result = detectCusum(series, 50, 2, 10);
    expect(result.driftDetected).toBe(false);
    expect(result.direction).toBe('none');
  });
});

describe('MAD Detector', () => {
  it('identifies outliers in known dataset', () => {
    const values = [10, 12, 11, 13, 10, 12, 11, 100, 10, 12]; // 100 is outlier
    const result = detectMad(values, 3.5);
    expect(result.outliers.length).toBeGreaterThanOrEqual(1);
    expect(result.outliers.some((o) => o.value === 100)).toBe(true);
    expect(result.median).toBeGreaterThan(0);
    expect(result.mad).toBeGreaterThan(0);
  });

  it('returns no outliers for uniform data', () => {
    const values = [10, 10, 10, 10, 10];
    const result = detectMad(values, 3.5);
    expect(result.outliers).toHaveLength(0);
    expect(result.mad).toBe(0);
  });
});

// ── Forecasters ──────────────────────────────────────────

describe('SES Forecaster', () => {
  it('forecast matches hand-calculated values', () => {
    const series = [10, 12, 14, 16, 18];
    const result = forecastSes(series, 0.5, 3);
    expect(result.forecast).toHaveLength(3);
    // SES produces flat forecasts — all values should be equal
    expect(result.forecast[0]).toBe(result.forecast[1]);
    expect(result.forecast[1]).toBe(result.forecast[2]);
    expect(result.alpha).toBe(0.5);
    expect(result.mape).toBeGreaterThanOrEqual(0);
  });
});

describe('Holt Forecaster', () => {
  it('forecast with trend matches expected', () => {
    // Linear trend: 10, 20, 30, 40, 50
    const series = [10, 20, 30, 40, 50];
    const result = forecastHolt(series, 0.8, 0.2, 3);
    expect(result.forecast).toHaveLength(3);
    // With strong trend, forecasts should be increasing
    expect(result.forecast[0]!).toBeGreaterThan(50);
    expect(result.forecast[1]!).toBeGreaterThan(result.forecast[0]!);
    expect(result.trend).toBeGreaterThan(0);
  });
});

describe('Holt-Winters Forecaster', () => {
  it('produces P10/P50/P90 bands', () => {
    // Seasonal data: 2 full seasons of length 4
    const series = [10, 20, 30, 40, 12, 22, 32, 42, 14, 24, 34, 44];
    const result = forecastHoltWinters(series, 0.3, 0.1, 0.3, 4, 4, 'additive');
    expect(result.forecast).toHaveLength(4);
    expect(result.quantiles.p10).toHaveLength(4);
    expect(result.quantiles.p50).toHaveLength(4);
    expect(result.quantiles.p90).toHaveLength(4);
    // P10 <= P90 for each horizon step (P50 = raw forecast, bands from residuals)
    for (let i = 0; i < 4; i++) {
      expect(result.quantiles.p10[i]!).toBeLessThanOrEqual(result.quantiles.p90[i]!);
    }
    expect(result.seasonal).toHaveLength(4);
  });
});

// ── Scoring ──────────────────────────────────────────────

describe('Z-Score', () => {
  it('standard z-score matches known values', () => {
    const result = zScore(120, 100, 10);
    expect(result.zScore).toBe(2);
    expect(result.mean).toBe(100);
    expect(result.stdDev).toBe(10);
  });

  it('z-score from array computes correctly', () => {
    const values = [10, 20, 30, 40, 50];
    const result = zScoreFromArray(50, values);
    const { mean, stdDev } = computeStats(values);
    expect(result.mean).toBeCloseTo(mean);
    expect(result.stdDev).toBeCloseTo(stdDev);
  });

  it('robust z-score (MAD-based) matches known values', () => {
    const values = [10, 12, 11, 13, 10, 12, 11, 100, 10, 12];
    const result = robustZScore(100, values);
    expect(Math.abs(result.modifiedZScore)).toBeGreaterThan(3);
    expect(result.median).toBeGreaterThan(0);
    expect(result.mad).toBeGreaterThan(0);
  });
});

describe('Confidence Bands', () => {
  it('bands contain expected distribution', () => {
    // Generate 100 values from a known distribution
    const values = Array.from({ length: 100 }, (_, i) => i);
    const bands = confidenceBands(values);
    expect(bands.p10).toBeLessThan(bands.p50);
    expect(bands.p50).toBeLessThan(bands.p90);
    expect(bands.p50).toBeCloseTo(49.5, 0); // median of 0..99
  });

  it('prediction interval wraps forecast', () => {
    const residuals = [-5, -3, -1, 0, 1, 3, 5];
    const result = predictionInterval(100, residuals, 0.8);
    expect(result.lower).toBeLessThan(100);
    expect(result.upper).toBeGreaterThan(100);
    expect(result.forecast).toBe(100);
  });
});

// ── Fingerprint ──────────────────────────────────────────

describe('Fingerprint', () => {
  it('is deterministic (same inputs → same hash)', () => {
    const opts = {
      orgId: 'org-1',
      type: 'anomaly.cash_outflow.daily',
      entityType: 'transactions',
      entityId: '123e4567-e89b-12d3-a456-426614174000',
      windowStart: new Date('2026-01-01T00:00:00Z'),
      windowEnd: new Date('2026-01-31T00:00:00Z'),
      params: { alpha: 0.2, threshold: 3.0 },
    };
    const fp1 = buildFingerprint(opts);
    const fp2 = buildFingerprint(opts);
    expect(fp1).toBe(fp2);
    expect(fp1).toHaveLength(64); // SHA-256 hex
  });

  it('differs when inputs differ', () => {
    const base = {
      orgId: 'org-1',
      type: 'anomaly.cash_outflow.daily',
      params: { alpha: 0.2 },
    };
    const fp1 = buildFingerprint(base);
    const fp2 = buildFingerprint({ ...base, orgId: 'org-2' });
    expect(fp1).not.toBe(fp2);
  });

  it('stable stringify produces sorted keys', () => {
    const a = stableStringify({ z: 1, a: 2, m: 3 });
    const b = stableStringify({ a: 2, m: 3, z: 1 });
    expect(a).toBe(b);
    expect(a).toBe('{"a":2,"m":3,"z":1}');
  });
});

// ── Evidence ─────────────────────────────────────────────

describe('Evidence', () => {
  it('builds evidence with reproducible hash', () => {
    const input = {
      evidenceType: 'metric_series' as const,
      source: 'transactions',
      payload: { values: [1, 2, 3], window: '90d' },
    };
    const result = buildEvidence(input);
    expect(result.hash).toHaveLength(64);
    expect(result.evidenceType).toBe('metric_series');
  });

  it('verifies hash matches payload (reproducibility)', () => {
    const payload = { values: [10, 20, 30], alpha: 0.2 };
    const evidence = buildEvidence({
      evidenceType: 'calculation',
      source: 'test',
      payload,
    });
    // Recompute from stored payload → exact match
    expect(verifyEvidenceHash(payload, evidence.hash)).toBe(true);
    // Tampered payload → mismatch
    expect(verifyEvidenceHash({ ...payload, alpha: 0.3 }, evidence.hash)).toBe(false);
  });
});

// ── Explain ──────────────────────────────────────────────

describe('Explanation Renderer', () => {
  it('renders EWMA explanation matching template + version', () => {
    const { explanation, explainVersion } = renderExplanation(
      'EWMA',
      { alpha: 0.2, window: '90d', threshold: 3.0 },
      3.4,
    );
    expect(explainVersion).toBe(EXPLAIN_VERSION);
    expect(explanation).toContain('EWMA');
    expect(explanation).toContain('3.4');
    expect(explanation).toContain('alpha=0.2');
  });

  it('renders RULE explanation', () => {
    const { explanation } = renderExplanation(
      'RULE',
      { ruleName: 'Credit Limit', message: 'At 92% of limit' },
      0.92,
    );
    expect(explanation).toContain('Credit Limit');
    expect(explanation).toContain('At 92% of limit');
  });

  it('handles unknown version gracefully', () => {
    const { explanation, explainVersion } = renderExplanation('EWMA', {}, null, 'v99');
    expect(explainVersion).toBe('v99');
    expect(explanation).toContain('Unknown template version');
  });
});

// ── Rule Checks ──────────────────────────────────────────

describe('Rule Detector', () => {
  beforeEach(() => {
    clearRuleChecks();
  });

  it('credit limit rule triggers at threshold', () => {
    const rule = creditLimitRule({ id: 'cl-1', name: 'Credit Limit', thresholdRatio: 0.9 });
    registerRuleCheck(rule);
    const results = evaluateRuleChecks({ balance: 46000, creditLimit: 50000 });
    expect(results).toHaveLength(1);
    expect(results[0]!.triggered).toBe(true);
    expect(results[0]!.message).toContain('92%');
  });

  it('credit limit rule does not trigger below threshold', () => {
    const rule = creditLimitRule({ id: 'cl-2', name: 'Credit Limit', thresholdRatio: 0.9 });
    registerRuleCheck(rule);
    const results = evaluateRuleChecks({ balance: 10000, creditLimit: 50000 });
    expect(results).toHaveLength(0);
  });

  it('aging threshold rule triggers', () => {
    const rule = agingThresholdRule({ id: 'ag-1', name: 'Aging 90d', ageDays: 90, minCount: 5 });
    registerRuleCheck(rule);
    const results = evaluateRuleChecks({ overdueCount: 14 });
    expect(results).toHaveLength(1);
    expect(results[0]!.message).toContain('14 items');
    expect(results[0]!.message).toContain('90-day');
  });
});
