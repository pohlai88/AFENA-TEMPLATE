# Afena Logging & Observability — Architecture Reference

> **Auto-generated** by `afena readme gen` at 2026-02-14T09:51:23Z. Do not edit — regenerate instead.
> **Package:** `afena-logger` (`packages/logger`)
> **Purpose:** Pino-based structured logging with AsyncLocalStorage context propagation.

---

## 1. Architecture Overview

Singleton Pino logger with environment-aware configuration (JSON in prod, pretty in dev, silent in test).
AsyncLocalStorage (ALS) propagates request context (request_id, org_id, actor_id) through the
entire call chain without manual threading.

Edge Runtime safe: ALS uses lazy `require('node:async_hooks')` with try/catch fallback.

---

## 2. Key Design Decisions

- **ALS scope**: Established at handler level (`withAuth`), not middleware level
- **Graceful degradation**: `getRequestId() ?? crypto.randomUUID()` — always works without ALS
- **Redaction**: Passwords, tokens, secrets, authorization headers auto-redacted
- **Audit channel**: Dedicated child logger with stable schema (`channel: 'audit'`)
- **Component loggers**: `createComponentLogger(parent, 'crud')` for scoped logging
- **No console.***: CI invariant E2 enforces Pino-only logging in runtime paths

---

## 3. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 6 |
| **Test files** | 0 |
| **Source directories** | (flat) |

---

## 4. Public API (barrel exports)

### Value Exports

| Export | Source |
| ------ | ------ |
| `pino` | `pino` |

### Type Exports

| Type | Source |
| ---- | ------ |
| `Logger` | `pino` |

---

## 5. Dependencies

### Internal (workspace)

- `afena-eslint-config`
- `afena-typescript-config`

### External

| Package | Version |
| ------- | ------- |
| `pino` | `catalog:` |
| `pino-abstract-transport` | `catalog:` |

---

## Design Patterns Detected

- **Factory**
- **Singleton**

---

## Cross-References

- [`route.architecture.md`](./route.architecture.md)
- [`crud.architecture.md`](./crud.architecture.md)
