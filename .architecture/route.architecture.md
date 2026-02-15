# Afena Web Application (Next.js) — Architecture Reference

> **Auto-generated** by `afena readme gen` at 2026-02-14T09:51:23Z. Do not edit — regenerate instead.
> **Package:** `web` (`apps/web`)
> **Purpose:** BFF pattern — Server Actions for domain CRUD, API routes for cross-cutting concerns.

---

## 1. Architecture Overview

Next.js 16 App Router with RSC-first architecture. Server actions are the primary interface
for all domain mutations and reads. API routes exist for search, metadata, storage, and
future external integrations.

Auth: Neon Auth with middleware-level session validation. Org context resolved from path
(`/org/[slug]/...`). AsyncLocalStorage established at handler level for request tracing.

---

## 2. Key Design Decisions

- **Server actions**: Primary BFF — domain CRUD via `generateEntityActions(entityType)` factory
- **API routes**: `withAuth()` factory — auth guard + org resolution + standard envelope
- **No client DB access**: Every data path flows through server actions or API routes
- **RSC-first**: Pages/layouts are Server Components; client interactivity in `*_client.tsx` only
- **Entity generator**: Zero manual wiring for new entities (Gate G2)
- **CI invariants**: E1 (no 'use client' in page/layout), E2 (no console.*), E3 (no hardcoded colors), E4 (no ad-hoc verbs)

---

## 3. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 24 |
| **Test files** | 0 |
| **Source directories** | lib |

```
apps/web/src/
├── lib/
```

---

## 4. Dependencies

### Internal (workspace)

- `afena-canon`
- `afena-crud`
- `afena-database`
- `afena-eslint-config`
- `afena-logger`
- `afena-search`
- `afena-typescript-config`
- `afena-ui`
- `afena-workflow`

### External

| Package | Version |
| ------- | ------- |
| `@aws-sdk/client-s3` | `^3.987.0` |
| `@aws-sdk/s3-request-presigner` | `^3.987.0` |
| `@hookform/resolvers` | `^5.2.2` |
| `@neondatabase/api-client` | `^2.6.0` |
| `@neondatabase/auth` | `0.2.0-beta.1` |
| `@neondatabase/neon-js` | `0.2.0-beta.1` |
| `@tanstack/react-query` | `catalog:` |
| `@xyflow/react` | `^12.10.0` |
| `lucide-react` | `^0.563.0` |
| `next` | `catalog:` |
| `next-themes` | `^0.4.6` |
| `react` | `catalog:` |
| `react-dom` | `catalog:` |
| `react-hook-form` | `^7.71.1` |
| `tw-animate-css` | `^1.4.0` |
| `zod` | `^4.3.6` |

---

## 5. Invariants

- `INVARIANT-11`
- `INVARIANT-RL`
- `K-04`

---

## Design Patterns Detected

- **Factory**
- **Observer**
- **Registry**

---

## Cross-References

- [`ui.architecture.md`](./ui.architecture.md)
- [`multitenancy.architecture.md`](./multitenancy.architecture.md)
