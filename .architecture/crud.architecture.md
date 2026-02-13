# Afena Interaction Kernel (CRUD-SAP) — Architecture Reference

> **Auto-generated** by `afena readme gen` at 2026-02-13T07:32:16Z. Do not edit — regenerate instead.
> **Package:** `afena-crud` (`packages/crud`)
> **Purpose:** Single mutation entry point for all domain data — the Afena Interaction Kernel (AIK).

---

## 1. Architecture Overview

Every domain mutation flows through `mutate()` — no exceptions. ESLint INVARIANT-01 enforces
that no package outside `packages/crud` may call `db.insert()`, `db.update()`, or `db.delete()`
on domain tables.

The kernel pipeline: Validation → Lifecycle Guard → Policy Gate → Governor → Workflow Before →
Transaction (handler + audit + version) → Workflow After → Metering.

---

## 2. Data Flow

```
Server Action / API Route
    │
    ▼
mutate(spec, ctx)
    ├── Zod validation
    ├── Lifecycle guard (state machine)
    ├── Policy gate (RBAC)
    ├── Governor (SET LOCAL timeouts)
    ├── evaluateRules('before') — can block/enrich
    ├── Transaction
    │   ├── Entity handler (create/update/delete/restore)
    │   ├── audit_logs INSERT
    │   └── entity_versions INSERT
    ├── evaluateRules('after') — fire-and-forget
    └── Metering (fire-and-forget)
```

---

## 3. Key Design Decisions

- **K-01**: `mutate()` is the only way to write domain data
- **K-02**: Single DB transaction per mutation
- **K-03**: Every mutation writes audit_logs + entity_versions
- **K-04**: `expectedVersion` required on update/delete/restore (optimistic locking)
- **K-05**: Package exports ONLY `mutate`, `readEntity`, `listEntities`
- **K-06**: Namespaced actions `{entity}.{verb}`, verb = last segment
- **K-11**: Allowlist input (handler pick) + kernel denylist backstop (strips system cols)
- **K-13**: Diff normalizes snapshots first, no post-filter

---

## 4. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 20 |
| **Test files** | 9 |
| **Source directories** | handlers, services |

```
packages/crud/src/
├── handlers/
├── services/
```

---

## 5. Public API (barrel exports)

### Value Exports

| Export | Source |
| ------ | ------ |
| `mutate` | `./mutate` |
| `readEntity` | `./read` |
| `listEntities` | `./read` |
| `buildSystemContext` | `./context` |
| `checkRateLimit` | `./rate-limiter` |
| `getRateLimitConfig` | `./rate-limiter` |
| `_resetRateLimitStore` | `./rate-limiter` |
| `acquireJobSlot` | `./job-quota` |
| `releaseJob` | `./job-quota` |
| `getJobQuotaState` | `./job-quota` |
| `getJobQuotaConfig` | `./job-quota` |
| `_resetJobQuotaStore` | `./job-quota` |
| `meterApiRequest` | `./metering` |
| `meterJobRun` | `./metering` |
| `meterDbTimeout` | `./metering` |
| `meterStorageBytes` | `./metering` |
| `loadFieldDefs` | `./services/custom-field-validation` |
| `validateCustomData` | `./services/custom-field-validation` |
| `getValueColumn` | `./services/custom-field-validation` |
| `computeSchemaHash` | `./services/custom-field-validation` |
| `syncCustomFieldValues` | `./services/custom-field-sync` |
| `processSyncQueue` | `./services/custom-field-sync` |

### Type Exports

| Type | Source |
| ---- | ------ |
| `MutationContext` | `./context` |
| `RateLimitConfig` | `./rate-limiter` |
| `RateLimitResult` | `./rate-limiter` |
| `JobQuotaConfig` | `./job-quota` |
| `JobQuotaResult` | `./job-quota` |
| `JobQuotaDenyReason` | `./job-quota` |
| `CustomFieldDef` | `./services/custom-field-validation` |
| `ValidationError` | `./services/custom-field-validation` |

---

## 6. Dependencies

### Internal (workspace)

- `afena-canon`
- `afena-database`
- `afena-eslint-config`
- `afena-logger`
- `afena-typescript-config`
- `afena-workflow`

### External

| Package | Version |
| ------- | ------- |
| `drizzle-orm` | `^0.44.0` |
| `fast-json-patch` | `catalog:` |

---

## 7. Invariants

- `INVARIANT-07`
- `INVARIANT-GOVERNORS`
- `INVARIANT-LIFECYCLE`
- `INVARIANT-POLICY`
- `INVARIANT-RL`
- `K-01`
- `K-02`
- `K-03`
- `K-04`
- `K-05`
- `K-10`
- `K-11`
- `K-12`
- `K-13`
- `K-15`

---

## Design Patterns Detected

- **Factory**
- **Observer**
- **Registry**

---

## Cross-References

- [`business.logic.architecture.md`](./business.logic.architecture.md)
- [`database.architecture.md`](./database.architecture.md)
