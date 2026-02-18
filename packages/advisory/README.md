# afenda-advisory

**Layer 2: Domain Services** • **Role:** Analytics & Forecasting Engine

Deterministic anomaly detection, time-series forecasting, and advisory generation.

---

## 📐 Architecture Role

**Layer 2** in the 4-layer architecture:

```
Layer 3: Application (crud, observability)
Layer 2: Domain Services (workflow, advisory ← YOU ARE HERE, 116 business-domain packages)
Layer 1: Foundation (canon, database, logger, ui)
Layer 0: Configuration (eslint-config, typescript-config)
```

**Purpose:**
- Detects anomalies using statistical methods (EWMA, CUSUM, MAD)
- Forecasts trends using time-series models (SES, Holt, Holt-Winters)
- Generates advisories with evidence and explanations

**Business Logic:** This package implements analytics algorithms.

---

## ✅ What This Package Does

### 1. Anomaly Detection

```typescript
import { detectEwma, detectCusum, detectMad } from 'afenda-advisory';

// Exponentially Weighted Moving Average (drift detection)
const ewma = detectEwma(timeSeries, { span: 20, threshold: 2.5 });
if (ewma.isAnomaly) {
  console.log('Drift detected:', ewma.score);
}

// Cumulative Sum (change-point detection)
const cusum = detectCusum(timeSeries, { target: 1000, drift: 50 });

// Median Absolute Deviation (outlier detection)
const mad = detectMad(values, { threshold: 3.0 });
```

### 2. Time-Series Forecasting

```typescript
import { forecastSes, forecastHolt, forecastHoltWinters } from 'afenda-advisory';

// Simple Exponential Smoothing
const ses = forecastSes(timeSeries, 12, { alpha: 0.3 });

// Holt's Linear Trend
const holt = forecastHolt(timeSeries, 12, { alpha: 0.3, beta: 0.1 });

// Holt-Winters Seasonal (with P10/P50/P90 quantiles)
const hw = forecastHoltWinters(timeSeries, 12, 7, { alpha: 0.3, beta: 0.1, gamma: 0.2 });
console.log('Forecast:', hw.p50); // Median forecast
console.log('Uncertainty:', hw.p10, hw.p90); // 80% confidence interval
```

### 3. Advisory Generation

```typescript
import { writeAdvisory, buildFingerprint, renderExplanation } from 'afenda-advisory';

const fingerprint = buildFingerprint({
  type: 'anomaly.revenue.monthly',
  orgId: 'org-1',
  method: 'EWMA',
});

const explanation = renderExplanation('EWMA', { span: 20, threshold: 2.5 }, 3.2);

await writeAdvisory({
  fingerprint,
  orgId: 'org-1',
  type: 'anomaly.revenue.monthly',
  severity: 'high',
  message: 'Revenue spike detected',
  explanation,
  evidence: { method: 'EWMA', score: 3.2 },
});
```

---

## ❌ What This Package NEVER Does

| ❌ Never Do This | ✅ Do This Instead |
|-----------------|-------------------|
| Import from business-domain packages | Business domains can import advisory |
| Import from crud | CRUD can call advisory for analytics |
| Import from workflow | Workflow is same layer (isolated) |
| Write to domain tables | Only writes to `advisories` + `advisory_evidence` |
| Modify existing advisories | Append-only evidence, deduplicate by fingerprint |

---

## 📦 What This Package Exports

### Detectors

- `detectEwma(series, opts)` — Exponentially Weighted Moving Average
- `detectCusum(series, opts)` — Cumulative Sum change-point detection
- `detectMad(values, opts)` — Median Absolute Deviation outlier detection

### Forecasters

- `forecastSes(series, horizon, opts)` — Simple Exponential Smoothing
- `forecastHolt(series, horizon, opts)` — Holt's linear trend
- `forecastHoltWinters(series, horizon, season, opts)` — Holt-Winters seasonal

### Scoring

- `zScore(value, mean, stdDev)` — Standard z-score
- `robustZScore(value, median, mad)` — Robust z-score (MAD-based)
- `confidenceBands(forecast, residuals)` — P10/P50/P90 quantile bands
- `predictionInterval(forecast, residuals, alpha)` — Prediction intervals

### Advisory Management

- `writeAdvisory(input)` — Write advisory with fingerprint deduplication
- `buildFingerprint(params)` — Generate SHA-256 fingerprint
- `renderExplanation(method, params, score)` — Plain-English explanations
- `buildEvidence(input)` — Create hashed evidence record

### Rule Checks

- `registerRuleCheck(check)` — Register business invariant check
- `evaluateRuleChecks(context)` — Evaluate all checks
- Built-in: `creditLimitRule`, `agingThresholdRule`

---

## 📖 Usage Examples

### Detect Revenue Anomaly

```typescript
import { db, dbRo } from 'afenda-database';
import { detectEwma, writeAdvisory } from 'afenda-advisory';

// Fetch time series
const revenue = await dbRo.select()
  .from(revenueMetrics)
  .where(eq(revenueMetrics.orgId, orgId))
  .orderBy(revenueMetrics.date);

const series = revenue.map(r => r.totalMinor);

// Detect anomaly
const result = detectEwma(series, { span: 20, threshold: 2.5 });

if (result.isAnomaly) {
  await writeAdvisory({
    fingerprint: buildFingerprint({ type: 'anomaly.revenue', orgId, method: 'EWMA' }),
    orgId,
    type: 'anomaly.revenue.monthly',
    severity: 'high',
    message: `Revenue spike detected (z-score: ${result.score.toFixed(2)})`,
    explanation: renderExplanation('EWMA', { span: 20, threshold: 2.5 }, result.score),
    evidence: { method: 'EWMA', score: result.score, series: series.slice(-20) },
  });
}
```

### Forecast Cash Flow

```typescript
import { forecastHoltWinters } from 'afenda-advisory';

const cashFlow = await dbRo.select()
  .from(cashFlowMetrics)
  .where(eq(cashFlowMetrics.orgId, orgId));

const series = cashFlow.map(c => c.netCashMinor);

const forecast = forecastHoltWinters(series, 12, 7, {
  alpha: 0.3,
  beta: 0.1,
  gamma: 0.2,
});

console.log('Next 12 months forecast (P50):', forecast.p50);
console.log('80% confidence interval:', forecast.p10, forecast.p90);
```

---

## 🔗 Dependencies

### Workspace Dependencies

- ✅ `afenda-canon` (Layer 1) — imports types
- ✅ `afenda-database` (Layer 1) — queries time-series data, writes advisories

### External Dependencies

- `drizzle-orm` — Database queries

### Who Depends on This Package

- ✅ `afenda-crud` (Layer 3) — calls advisory for analytics
- ✅ Business-domain packages (Layer 2) — MAY import for analytics (same layer)

---

## 🚦 Dependency Rules

```
✅ ALLOWED:
  - afenda-canon (Layer 1)
  - afenda-database (Layer 1)
  - External npm (drizzle-orm)
  - Node.js built-ins

❌ FORBIDDEN:
  - business-domain/* (Layer 2, same layer - avoid coupling)
  - afenda-workflow (Layer 2, same layer - different domain)
  - afenda-crud (Layer 3, upper layer)
  - afenda-observability (Layer 3, upper layer)
```

**Rule:** Layer 2 packages can depend on Layers 0 and 1, but NOT on other Layer 2 or Layer 3 packages.

---

## 📜 Scripts

```bash
pnpm build       # Build package
pnpm dev         # Watch mode
pnpm type-check  # TypeScript check
pnpm lint        # ESLint
pnpm lint:fix    # ESLint with auto-fix
pnpm test        # Run tests
```

---

## ⚠️ PREVENT DRIFT - Critical Architecture Rules

### 🔒 Rule 1: NEVER Import from Business Domains

**❌ WRONG:**

```typescript
import { calculateTax } from 'afenda-accounting'; // FORBIDDEN!
```

**Why:** Advisory is Layer 2, same layer as business domains. No cross-domain dependencies.

---

### 🔒 Rule 2: ONLY Write to Advisory Tables

**❌ WRONG:**

```typescript
// Writing to domain tables
await db.update(invoices).set({ flagged: true }).where(...);
```

**Why:** Advisory is read-only for domain tables. It only writes to `advisories` and `advisory_evidence`.

**✅ CORRECT:**

```typescript
// Read from domain tables
const invoices = await dbRo.select().from(invoices);

// Write advisories
await db.insert(advisories).values({ ... });
await db.insert(advisoryEvidence).values({ ... });
```

---

### 🔒 Rule 3: Advisory Evidence Is Append-Only

**❌ WRONG:**

```typescript
// Updating or deleting evidence
await db.update(advisoryEvidence).set({ ... }).where(...);
await db.delete(advisoryEvidence).where(...);
```

**Why:** Evidence is immutable for auditability.

**✅ CORRECT:**

```typescript
// Only insert
await db.insert(advisoryEvidence).values({
  advisoryId: 'adv-123',
  evidenceHash: sha256(evidence),
  evidenceJson: JSON.stringify(evidence),
});
```

---

### 🔒 Rule 4: Deduplicate Advisories by Fingerprint

**❌ WRONG:**

```typescript
// Creating duplicate advisories
await db.insert(advisories).values({ type: 'anomaly.revenue', orgId, ... });
await db.insert(advisories).values({ type: 'anomaly.revenue', orgId, ... }); // DUPLICATE!
```

**Why:** Same anomaly should not generate multiple active advisories.

**✅ CORRECT:**

```typescript
import { buildFingerprint, writeAdvisory } from 'afenda-advisory';

const fingerprint = buildFingerprint({ type: 'anomaly.revenue', orgId, method: 'EWMA' });

// writeAdvisory deduplicates by (orgId, fingerprint)
await writeAdvisory({
  fingerprint,
  orgId,
  type: 'anomaly.revenue',
  // ... only creates if no open advisory with same fingerprint
});
```

---

### 🔒 Rule 5: Algorithms Are Deterministic

**❌ WRONG:**

```typescript
// Non-deterministic random behavior
export function detectAnomaly(series: number[]): boolean {
  const randomThreshold = Math.random() * 3; // ❌ Random!
  return series[series.length - 1] > randomThreshold;
}
```

**Why:** Analytics must be reproducible for auditability.

**✅ CORRECT:**

```typescript
// Deterministic threshold
export function detectAnomaly(series: number[], threshold: number): boolean {
  const zscore = calculateZScore(series[series.length - 1], mean(series), stdDev(series));
  return Math.abs(zscore) > threshold;
}
```

---

### 🚨 Validation Commands

```bash
# Check for circular dependencies
pnpm run validate:deps

# Check for layer violations
pnpm lint:ci

# Type-check
pnpm type-check

# Run tests (verify deterministic behavior)
pnpm test
```

---

## 🔍 Quick Reference

| Question | Answer |
|----------|--------|
| **What layer?** | Layer 2 (Domain Services) |
| **What does it export?** | Detectors, forecasters, advisory management |
| **What does it import?** | canon (types), database (queries) |
| **Who imports it?** | crud (Layer 3), optionally business domains |
| **Can it import from domains?** | ❌ NO (same layer) |
| **Can it import from crud?** | ❌ NO (upper layer) |
| **Can it write to domain tables?** | ❌ NO (only advisories + evidence) |
| **Is evidence mutable?** | ❌ NO (append-only) |
| **Are algorithms deterministic?** | ✅ YES (required) |

---

## 📚 Related Documentation

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Complete 4-layer architecture
- [packages/canon/README.md](../canon/README.md) - Type definitions
- [packages/workflow/README.md](../workflow/README.md) - Rules engine
- [packages/crud/README.md](../crud/README.md) - Application orchestration

---

**Last Updated:** February 18, 2026  
**Architecture Version:** 2.0 (Clean State)
