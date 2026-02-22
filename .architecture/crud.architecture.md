# afenda Interaction Kernel (CRUD-SAP) — Architecture Reference

> **Auto-generated** by `afenda readme gen` at 2026-02-22T06:11:18Z. Do not edit — regenerate instead.
> **Package:** `afenda-crud` (`packages/crud`)
> **Purpose:** Single mutation entry point for all domain data — the afenda Interaction Kernel (AIK).

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
| **Source files** | 51 |
| **Test files** | 0 |
| **Source directories** | commit, deliver, handlers, outbox, plan, registries, services, util |

```
packages/crud/src/
├── commit/
├── deliver/
├── handlers/
├── outbox/
├── plan/
├── registries/
├── services/
├── util/
```

---

## 5. Public API (barrel exports)

### Value Exports

| Export | Source |
| ------ | ------ |
| `mutate` | `./mutate` |
| `listEntities` | `./read` |
| `readEntity` | `./read` |
| `buildSystemContext` | `./context` |
| `buildUserContext` | `./context` |
| `setObservabilityHooks` | `./observability-hooks` |
| `KERNEL_ERROR_CODES` | `./errors` |

### Type Exports

| Type | Source |
| ---- | ------ |
| `MutationContext` | `./context` |
| `ObservabilityHooks` | `./observability-hooks` |
| `ApiResponse` | `afenda-canon` |
| `MutationReceipt` | `afenda-canon` |
| `MutationSpec` | `afenda-canon` |
| `KernelErrorCode` | `./errors` |

---

## 6. Dependencies

### Internal (workspace)

- `afenda-canon`
- `afenda-database`
- `afenda-eslint-config`
- `afenda-logger`
- `afenda-typescript-config`
- `afenda-workflow`

### External

| Package | Version |
| ------- | ------- |
| `drizzle-orm` | `catalog:` |
| `fast-json-patch` | `catalog:` |
| `ioredis` | `catalog:` |

---

## 7. Invariants

- `INVARIANT-07`
- `INVARIANT-GOVERNORS`
- `INVARIANT-HANDLER`
- `INVARIANT-LIFECYCLE`
- `INVARIANT-POLICY`
- `INVARIANT-RL`
- `K-01`
- `K-02`
- `K-03`
- `K-04`
- `K-05`
- `K-09`
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
