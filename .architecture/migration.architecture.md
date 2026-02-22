# afenda Migration Engine — Architecture Reference

> **Auto-generated** by `afenda readme gen` at 2026-02-22T06:11:18Z. Do not edit — regenerate instead.
> **Package:** `afenda-migration` (`packages/migration`)
> **Purpose:** Legacy data migration pipeline with atomicity guarantees, conflict detection, and signed audit reports.

---

## 1. Architecture Overview

Template Method pipeline: Extract → Transform → Plan → Load. Each batch is processed through
a configurable chain of transforms, conflict detectors, and gates. Lineage tracking ensures
every legacy record maps to exactly one afenda entity (reservation-first pattern).

Operational hardening: retry/quarantine wrapper (`withTerminalOutcome`), periodic checkpoints,
performance tracking (p50/p95), and configurable conflict thresholds for score-based merge routing.

---

## 2. Data Flow

```
Legacy Source (SQL/CSV/API)
    │
    ▼
extractBatch(cursor) → LegacyRecord[]
    │
    ▼
transformBatch() → TransformedRecord[]
    │  (TrimWhitespace → NormalizeWhitespace → PhoneNormalize → EmailNormalize → TypeCoercion)
    │
    ▼
planUpserts() → UpsertPlan
    │  (Bulk lineage prefetch → Conflict detection → Score-based routing)
    │
    ▼
loadPlan() → LoadResult
    │  (withTerminalOutcome wrapper → Reservation-first creates → Checkpoints)
    │
    ▼
buildSignedReport() → SignedReport
```

---

## 3. Key Design Decisions

- **D0.1**: Reservation reclaim is single-statement atomic (`UPDATE ... RETURNING`)
- **D0.2**: Delete reservation only by owned `lineageId` (never composite key)
- **TERM-01**: Every record reaches exactly one terminal state (loaded/quarantined/manual_review/skipped)
- **Error classification**: Transient (40001, 40P01, 57014, 08006) → retry; permanent → quarantine
- **Conflict thresholds**: `autoMerge: 60`, `manualReview: 30` (configurable)
- **Signed reports**: SHA-256 fingerprints for source schema, mappings, transforms, strategy
- **Parallel creates**: `p-limit` with configurable concurrency (default 10)

---

## 4. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 43 |
| **Test files** | 1 |
| **Source directories** | adapters, audit, gates, pipeline, queries, strategies, transforms, types, worker |

```
packages/migration/src/
├── adapters/
├── audit/
├── gates/
├── pipeline/
├── queries/
├── strategies/
├── transforms/
├── types/
├── worker/
```

---

## 5. Dependencies

### Internal (workspace)

- `afenda-canon`
- `afenda-database`
- `afenda-eslint-config`
- `afenda-logger`
- `afenda-typescript-config`

### External

| Package | Version |
| ------- | ------- |
| `@neondatabase/serverless` | `catalog:` |
| `drizzle-orm` | `catalog:` |
| `fuse.js` | `catalog:` |
| `libphonenumber-js` | `catalog:` |
| `p-limit` | `catalog:` |
| `papaparse` | `catalog:` |

---

## 6. Invariants

- `ACC-03`
- `ACC-04`
- `ACC-05`
- `GOV-01`
- `OPS-01`
- `OPS-02`
- `OPS-03`
- `OPS-04`
- `OPS-05`
- `SPD-01`
- `SPD-02`
- `SPD-04`
- `SPD-05`
- `SPD-06`
- `TERM-01`

---

## Design Patterns Detected

- **Builder**
- **Chain of Responsibility**
- **Factory**
- **Registry**
- **Strategy**
- **Template Method**

---

## Cross-References

- [`database.architecture.md`](./database.architecture.md)
- [`crud.architecture.md`](./crud.architecture.md)
