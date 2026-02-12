# afena-advisory

Deterministic forecast & detection engine — math-first, auditable, advisory-only.

## Public API

### Detectors

- `detectEwma(series, opts)` — Exponentially Weighted Moving Average (drift/spike)
- `detectCusum(series, opts)` — Cumulative Sum (change-point detection)
- `detectMad(values, opts)` — Median Absolute Deviation (robust outlier detection)

### Forecasters

- `forecastSes(series, horizon, opts)` — Simple Exponential Smoothing
- `forecastHolt(series, horizon, opts)` — Holt's linear trend
- `forecastHoltWinters(series, horizon, season, opts)` — Holt-Winters seasonal (P10/P50/P90)

### Scoring

- `zScore(value, mean, stdDev)` / `robustZScore(value, median, mad)` — z-score calculations
- `confidenceBands(forecast, residuals)` — quantile bands (P10/P50/P90)
- `predictionInterval(forecast, residuals, alpha)` — prediction intervals

### Rules

- `registerRuleCheck(check)` / `evaluateRuleChecks(context)` — business invariant checks
- `creditLimitRule` / `agingThresholdRule` — built-in rule examples

### Evidence & Explanation

- `buildEvidence(input)` — SHA-256 hashed evidence records
- `renderExplanation(method, params, score)` — deterministic plain-English explanations
- `writeAdvisory(input)` — write advisory + evidence to DB (fingerprint dedupe)

## Usage

```typescript
import { detectEwma, buildFingerprint, writeAdvisory } from 'afena-advisory';

const result = detectEwma(series, { span: 20, threshold: 2.5 });
if (result.isAnomaly) {
  const fingerprint = buildFingerprint({ type: 'anomaly.revenue.monthly', orgId, method: 'EWMA' });
  await writeAdvisory({ fingerprint, type: 'anomaly.revenue.monthly', ... });
}
```

## Invariants

- **INVARIANT-P01**: Only writes to `advisories` + `advisory_evidence`. Never domain tables.
- **INVARIANT-P02**: `advisory_evidence` is append-only (no UPDATE, no DELETE).
- **INVARIANT-P03**: Open/ack advisories deduplicated by `(org_id, fingerprint)`.

## Dependencies

`afena-canon`, `afena-database`, `drizzle-orm`
