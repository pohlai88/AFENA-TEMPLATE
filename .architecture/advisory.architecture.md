# Afena Advisory Engine (Deterministic Intelligence) — Architecture Reference

> **Auto-generated** by `afena readme gen` at 2026-02-16T12:44:12Z. Do not edit — regenerate instead.
> **Package:** `afena-advisory` (`packages/advisory`)
> **Purpose:** Math-first anomaly detection, forecasting, and business rule evaluation — NO LLMs.

---

## 1. Architecture Overview

The advisory engine produces deterministic, reproducible advisories using statistics and
business rules. Every advisory has a SHA-256 fingerprint for deduplication and append-only
evidence for auditability.

Three pillars: **Detectors** (anomaly detection), **Forecasters** (time series prediction),
and **Rules** (hard business invariants). All produce structured results that the **Writer**
persists with evidence and human-readable explanations.

---

## 2. Key Design Decisions

- **INVARIANT-P01**: Only writes to `advisories` + `advisory_evidence` (never domain tables)
- **INVARIANT-P02**: `advisory_evidence` is append-only (no UPDATE/DELETE)
- **INVARIANT-P03**: Open/ack advisories deduplicated by `(org_id, fingerprint)`
- **Type taxonomy**: `{category}.{metric}.{scope}` — enforced by DB CHECK constraint
- **Score**: DOUBLE PRECISION (not NUMERIC) for statistical precision
- **Evidence hash**: SHA-256 of canonical JSON (sorted keys, no whitespace)
- **Explain**: Versioned templates (v1) — deterministic plain-English rendering

---

## 3. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 17 |
| **Test files** | 0 |
| **Source directories** | detectors, explain, forecasters, rules, scoring |

```
packages/advisory/src/
├── detectors/
├── explain/
├── forecasters/
├── rules/
├── scoring/
```

---

## 4. Public API (barrel exports)

### Value Exports

| Export | Source |
| ------ | ------ |
| `buildFingerprint` | `./fingerprint` |
| `sha256Hex` | `./fingerprint` |
| `stableStringify` | `./fingerprint` |
| `detectEwma` | `./detectors/ewma` |
| `detectCusum` | `./detectors/cusum` |
| `detectMad` | `./detectors/mad` |
| `forecastSes` | `./forecasters/ses` |
| `forecastHolt` | `./forecasters/holt` |
| `forecastHoltWinters` | `./forecasters/holt-winters` |
| `zScore` | `./scoring/z-score` |
| `zScoreFromArray` | `./scoring/z-score` |
| `robustZScore` | `./scoring/z-score` |
| `computeStats` | `./scoring/z-score` |
| `confidenceBands` | `./scoring/confidence` |
| `predictionInterval` | `./scoring/confidence` |
| `registerRuleCheck` | `./rules/rule-detector` |
| `unregisterRuleCheck` | `./rules/rule-detector` |
| `getRegisteredRuleChecks` | `./rules/rule-detector` |
| `clearRuleChecks` | `./rules/rule-detector` |
| `evaluateRuleChecks` | `./rules/rule-detector` |
| `creditLimitRule` | `./rules/rule-detector` |
| `agingThresholdRule` | `./rules/rule-detector` |
| `buildEvidence` | `./evidence` |
| `verifyEvidenceHash` | `./evidence` |
| `renderExplanation` | `./explain/render` |
| `EXPLAIN_VERSION` | `./explain/version` |
| `TEMPLATES` | `./explain/templates` |
| `writeAdvisory` | `./writer` |

### Type Exports

| Type | Source |
| ---- | ------ |
| `AdvisoryCategory` | `./types` |
| `AdvisoryInput` | `./types` |
| `AdvisoryMethod` | `./types` |
| `AdvisoryStatus` | `./types` |
| `ConfidenceBand` | `./types` |
| `CusumResult` | `./types` |
| `EvidenceInput` | `./types` |
| `EvidenceType` | `./types` |
| `EwmaResult` | `./types` |
| `HoltResult` | `./types` |
| `HoltWintersResult` | `./types` |
| `MadOutlier` | `./types` |
| `MadResult` | `./types` |
| `RobustZScoreResult` | `./types` |
| `RuleCheck` | `./types` |
| `RuleCheckResult` | `./types` |
| `SesResult` | `./types` |
| `Severity` | `./types` |
| `TimeSeriesPoint` | `./types` |
| `ZScoreResult` | `./types` |
| `WriteAdvisoryResult` | `./writer` |

---

## 5. Dependencies

### Internal (workspace)

- `afena-canon`
- `afena-database`
- `afena-eslint-config`
- `afena-typescript-config`

### External

| Package | Version |
| ------- | ------- |
| `drizzle-orm` | `^0.44.0` |

---

## 6. Invariants

- `INVARIANT-P01`
- `INVARIANT-P02`
- `INVARIANT-P03`

---

## Design Patterns Detected

- **Factory**
- **Registry**

---

## Cross-References

- [`database.architecture.md`](./database.architecture.md)
- [`business.logic.architecture.md`](./business.logic.architecture.md)
