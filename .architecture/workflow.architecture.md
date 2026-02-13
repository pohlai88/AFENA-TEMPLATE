# Afena Workflow Engine — Architecture Reference

> **Auto-generated** by `afena readme gen` at 2026-02-13T07:32:16Z. Do not edit — regenerate instead.
> **Package:** `afena-workflow` (`packages/workflow`)
> **Purpose:** Rule engine for before/after mutation hooks — conditional logic, input enrichment, and side effects.

---

## 1. Architecture Overview

Rules are registered in an in-memory registry (sorted by priority) and evaluated by the engine
during `mutate()`. Before-rules can block or enrich mutations. After-rules execute fire-and-forget
side effects. All rule executions are logged to `workflow_executions` (append-only).

Rules can be defined in code (startup registration) or loaded from DB per-org with TTL caching (60s).
JSON rule definitions are interpreted into ConditionFn/ActionFn via the interpreter module.

---

## 2. Data Flow

```
mutate() pipeline
    │
    ├── evaluateRules('before', spec, entity, ctx)
    │   ├── Filter: enabled + timing + entityType + verb
    │   ├── For each rule (by priority):
    │   │   ├── condition(spec, entity, ctx) → match?
    │   │   └── action(spec, entity, ctx) → ok/block/enrich
    │   └── Fire-and-forget: log to workflow_executions
    │
    ├── ... transaction ...
    │
    └── evaluateRules('after', spec, entity, ctx)
        └── Same flow, but errors never block
```

---

## 3. Key Design Decisions

- **Before-rules**: Can block (`ok: false`) or enrich (`enrichedInput`). Errors = block (fail-safe).
- **After-rules**: Fire-and-forget. Errors logged but never block the mutation.
- **Priority ordering**: Lower number = runs first (default 100)
- **DB loader**: TTL-cached (60s), rule IDs prefixed with `db:{orgId}:` for collision avoidance
- **Execution logging**: Fire-and-forget `db.insert(workflowExecutions)` — never fails the mutation
- **Error truncation**: `String(error).slice(0, 2000)` to prevent log bloat

---

## 4. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 7 |
| **Test files** | 3 |
| **Source directories** | (flat) |

---

## 5. Public API (barrel exports)

### Value Exports

| Export | Source |
| ------ | ------ |
| `evaluateRules` | `./engine` |
| `registerRule` | `./registry` |
| `unregisterRule` | `./registry` |
| `getRegisteredRules` | `./registry` |
| `clearRules` | `./registry` |
| `unregisterByPrefix` | `./registry` |
| `always` | `./conditions` |
| `never` | `./conditions` |
| `fieldEquals` | `./conditions` |
| `fieldChanged` | `./conditions` |
| `actorHasRole` | `./conditions` |
| `allOf` | `./conditions` |
| `anyOf` | `./conditions` |
| `interpretCondition` | `./interpreter` |
| `interpretAction` | `./interpreter` |
| `loadAndRegisterOrgRules` | `./db-loader` |

### Type Exports

| Type | Source |
| ---- | ------ |
| `RuleTiming` | `./types` |
| `ConditionResult` | `./types` |
| `ConditionFn` | `./types` |
| `ActionResult` | `./types` |
| `ActionFn` | `./types` |
| `WorkflowRule` | `./types` |
| `RuleContext` | `./types` |
| `RuleEvaluationResult` | `./types` |
| `RuleExecutionLog` | `./types` |

---

## 6. Dependencies

### Internal (workspace)

- `afena-canon`
- `afena-database`
- `afena-eslint-config`
- `afena-typescript-config`

---

## Design Patterns Detected

- **Observer**
- **Registry**

---

## Cross-References

- [`crud.architecture.md`](./crud.architecture.md)
- [`business.logic.architecture.md`](./business.logic.architecture.md)
