# Afena Capability Truth Ledger — Visibility Guarantee Architecture (v3-final)

Ratified zero-drift architecture for `afena meta`: a dual-ledger metadata system with domain/namespace taxonomy, canon key parser, precomputed verb→kind map, 5 CI-enforceable invariants (VIS-00 through VIS-04), structured scoped exceptions with stable IDs, hybrid scanning, safe autofix with fix reports, and composable RBAC derivation — designed to scale from contacts-only to 50+ ERP domains without annotation fatigue.

> **Implementation Status (2026-02-13):** All 5 phases (steps 1–41) complete + post-audit hardening. All 5 VIS invariants enforced at error severity. VIS_POLICY.phase = 3. RBAC derivation auto-populates `rbacTier` + `rbacScope` on all 26 capabilities. Runtime API (`GET /api/meta/capabilities` with auth guard), feature flag toggle API, AI context emitter, navigation generation, and permission pre-check all implemented. All checks PASS.
>
> **Post-audit improvements:** VIS-02 UI check no longer double-fires (warn-only for missing UI surface), L2 AST scanner wired with `--deep` flag, `--json` output for CI, shared write boundary patterns module, `CapabilityKey` type union exported, `cli_command` surface kind added, expired exceptions shown as errors in `gen`, PRD verb sets synced with implementation.

---

## 0. Codebase Audit Findings

### What exists (strong foundation)

| Layer             | Existing artifact                                                                                                            | Coverage                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| **Canon**         | `ENTITY_TYPES` (`['contacts']`), `ACTION_TYPES` (4 mutation keys), `ACTION_VERBS` (16 verbs), `ACTION_FAMILIES` (6 families) | Mutation capabilities only  |
| **Kernel**        | `HANDLER_REGISTRY` in `mutate.ts`, `TABLE_REGISTRY` in `read.ts`                                                             | 1:1 with ACTION_TYPES       |
| **App surfaces**  | `generateEntityActions()` factory → 8 actions/entity, `withAuth()` API factory, 6 API routes, 1 server action file           | No annotations              |
| **UI surfaces**   | 13 pages (contacts CRUD, auth, dashboard, files)                                                                             | Zero capability annotations |
| **Cross-cutting** | Workflow engine, Advisory engine, Search, Custom Fields, Aliases, Views                                                      | Not in ACTION_TYPES         |

### The gap

`ACTION_TYPES` only covers entity mutations. ~20+ capabilities have no canonical key:

- **Reads:** `contacts.read`, `contacts.list`, `contacts.versions`, `contacts.audit`
- **Search:** `contacts.search`, `search.global`
- **Admin:** `admin.custom_fields.define`, `admin.custom_fields.sync`, `admin.aliases.resolve`, `admin.views.manage`
- **System:** `system.workflows.evaluate`, `system.workflows.manage`, `system.advisory.detect`, `system.advisory.forecast`, `system.advisory.explain`
- **Auth:** `auth.sign_in`, `auth.sign_out`
- **Storage:** `storage.files.upload`, `storage.files.metadata`

**Capabilities ⊃ ActionTypes.** Every ActionType is a capability, but not every capability is an ActionType.

---

## 1. Dual Ledger Model

Two first-class ledgers, not one:

### Ledger 1 — Capability Catalog (`CAPABILITY_CATALOG` in canon)

The **declared truth** — what the system is designed to do. Human-authored, lives in code. This is the SSOT; `CAPABILITY_KEYS` is **derived** from it (never manually maintained).

```typescript
// CAPABILITY_CATALOG is the single authored artifact
export const CAPABILITY_CATALOG = { ... } as const satisfies Record<string, CapabilityDescriptor>;

// CAPABILITY_KEYS is derived — never hand-edited
export const CAPABILITY_KEYS = Object.keys(CAPABILITY_CATALOG) as CapabilityKey[];
export type CapabilityKey = keyof typeof CAPABILITY_CATALOG;
```

### Ledger 2 — Capability Evidence Ledger (`.afena/capability.ledger.json`)

The **observed truth** — machine-produced mapping that becomes the CI source of truth.

Per capability key, tracks:

| Field        | Source                                                             |
| ------------ | ------------------------------------------------------------------ |
| `declared`   | Found in `CAPABILITY_CATALOG` (canon)                              |
| `observed`   | Scanner found matching annotations in surfaces                     |
| `kernel`     | Has matching ACTION_TYPE + HANDLER_REGISTRY entry (mutations only) |
| `surfaces`   | List of files declaring this capability                            |
| `uiSurfaces` | List of UI pages exposing this capability                          |
| `status`     | Deterministic (see §9)                                             |

### Outputs

| File                                | Content                                  | Git-tracked         |
| ----------------------------------- | ---------------------------------------- | ------------------- |
| `.afena/capability.ledger.json`     | Machine-produced evidence per capability | No (generated)      |
| `.afena/capability.matrix.md`       | Human-readable coverage table            | No (generated)      |
| `.afena/codebase.manifest.json`     | Structural + schema + stats (Phase 3)    | No (generated)      |
| `.afena/capability-exceptions.json` | Governed exception allowlist             | **Yes** (committed) |

---

## 2. Capability Key Design

### Domain vs Namespace taxonomy (prevents collision drift)

Two canon enums, not one. This prevents nonsense like `metadata.metadata` or `admin.admin.manage`:

```typescript
// Business/feature domains — things that have entities, data, or user-facing features
export const CAPABILITY_DOMAINS = [
  'contacts',
  'companies',
  'sites',
  'invoices',
  'payments',
  'inventory',
  'sales',
  'purchases',
  'ledger',
  'custom_fields',
  'workflows',
  'advisory',
  'search',
  'aliases',
  'views',
  'files',
] as const;

// Cross-cutting namespaces — umbrellas for non-entity capabilities
export const CAPABILITY_NAMESPACES = [
  'admin', // admin.custom_fields.define, admin.views.manage
  'system', // system.workflows.evaluate, system.advisory.detect
  'auth', // auth.sign_in, auth.sign_out (2-part: namespace IS the domain)
  'storage', // storage.files.upload
] as const;
```

### Key format: structured 2-part or 3-part

| Shape  | Format                        | When                                                                     |
| ------ | ----------------------------- | ------------------------------------------------------------------------ |
| 2-part | `{domain}.{verb}`             | Entity/feature capabilities: `contacts.create`, `invoices.submit`        |
| 2-part | `{namespace}.{verb}`          | Namespace-only (no sub-domain): `auth.sign_in`, `auth.refresh`           |
| 3-part | `{namespace}.{domain}.{verb}` | Cross-cutting: `admin.custom_fields.define`, `system.workflows.evaluate` |

**Rules:**

- 2-part keys: first segment must be in `CAPABILITY_DOMAINS` OR `CAPABILITY_NAMESPACES`
- 3-part keys: first segment must be in `CAPABILITY_NAMESPACES`, second in `CAPABILITY_DOMAINS`
- No 1-part or 4+-part keys

### Canon key parser (single truth for all consumers)

Three shapes, not two — prevents subtle bugs in validation, RBAC derivation, and grouping:

```typescript
type Domain = (typeof CAPABILITY_DOMAINS)[number];
type Namespace = (typeof CAPABILITY_NAMESPACES)[number];
type Verb = string; // validated separately via VERB_TO_KIND

type ParsedCapabilityKey =
  | { shape: 'domain'; ns: null; domain: Domain; verb: Verb }
  | { shape: 'namespace'; ns: Namespace; domain: null; verb: Verb }
  | { shape: 'namespaced-domain'; ns: Namespace; domain: Domain; verb: Verb };
```

Examples:

- `contacts.create` → `{ shape: 'domain', ns: null, domain: 'contacts', verb: 'create' }`
- `auth.sign_in` → `{ shape: 'namespace', ns: 'auth', domain: null, verb: 'sign_in' }`
- `admin.custom_fields.define` → `{ shape: 'namespaced-domain', ns: 'admin', domain: 'custom_fields', verb: 'define' }`

```typescript
export function parseCapabilityKey(key: string): ParsedCapabilityKey {
  const parts = key.split('.');
  if (parts.length === 2) {
    const [seg, verb] = parts as [string, string];
    if (CAPABILITY_NAMESPACES.includes(seg as Namespace))
      return { shape: 'namespace', ns: seg as Namespace, domain: null, verb };
    return { shape: 'domain', ns: null, domain: seg as Domain, verb };
  }
  if (parts.length === 3) {
    const [ns, domain, verb] = parts as [string, string, string];
    return {
      shape: 'namespaced-domain',
      ns: ns as Namespace,
      domain: domain as Domain,
      verb,
    };
  }
  throw new Error(`Invalid capability key: "${key}" (must be 2 or 3 parts)`);
}
```

### Canon key validator (developer-friendly errors)

`parseCapabilityKey()` gives shape; `validateCapabilityKey()` gives shape + full validation in one call:

```typescript
export function validateCapabilityKey(key: string): ParsedCapabilityKey {
  const parsed = parseCapabilityKey(key);
  // Validate verb is known
  if (!VERB_TO_KIND[parsed.verb]) throw new Error(`Unknown verb "${parsed.verb}" in key "${key}"`);
  // Validate domain (if present)
  if (parsed.domain !== null && !CAPABILITY_DOMAINS.includes(parsed.domain))
    throw new Error(`Unknown domain "${parsed.domain}" in key "${key}"`);
  // Validate namespace (if present)
  if (parsed.ns !== null && !CAPABILITY_NAMESPACES.includes(parsed.ns))
    throw new Error(`Unknown namespace "${parsed.ns}" in key "${key}"`);
  return parsed;
}
```

Scanner errors use `validateCapabilityKey()` — gives file + key + _why_ it's invalid.

### Relationship to existing types

```
ACTION_TYPES ⊂ CAPABILITY_KEYS
```

- `ACTION_TYPES` stays as-is — governs what `mutate()` accepts (always 2-part: `{entity}.{verb}`)
- `CAPABILITY_KEYS` is the superset — governs what the system _can do_
- Every `ACTION_TYPE` is auto-included in `CAPABILITY_KEYS`
- `ENTITY_TYPES` are a subset of `CAPABILITY_DOMAINS`

### Where to define: `packages/canon/src/types/capability.ts`

Canon is the SSOT — alongside entity types, action types, and error codes.

---

## 3. Governed Verb Sets + Precomputed Verb→Kind Map

### Verb sets per kind (prevents verb sprawl)

```typescript
export const CAPABILITY_VERBS = {
  mutation: [
    'create',
    'update',
    'delete',
    'restore',
    'submit',
    'cancel',
    'amend',
    'post',
    'close',
    'reopen',
    'merge',
    'archive',
    'duplicate',
    'approve',
    'reject',
    'lock',
    'unlock',
    'reassign',
    'transfer',
    'comment',
    'attach',
    'import',
  ],
  read: ['read', 'list', 'versions', 'audit'],
  search: ['search', 'global'],
  admin: ['define', 'manage', 'configure', 'seed', 'sync', 'resolve'],
  system: ['evaluate', 'run', 'explain', 'detect', 'forecast'],
  auth: ['sign_in', 'sign_out', 'refresh'],
  storage: ['upload', 'download', 'metadata', 'save'],
} as const;
```

### Precomputed verb→kind map (O(1) lookup, strict)

```typescript
// Built once at module init — O(1) lookup instead of O(n) loop
export const VERB_TO_KIND = Object.freeze(
  Object.fromEntries(
    Object.entries(CAPABILITY_VERBS).flatMap(([kind, verbs]) => verbs.map((v) => [v, kind])),
  ),
) as Readonly<Record<string, CapabilityKind>>;

// Module-init safety: throw if any verb appears in two kinds
(() => {
  const seen = new Map<string, string>();
  for (const [kind, verbs] of Object.entries(CAPABILITY_VERBS)) {
    for (const v of verbs) {
      if (seen.has(v)) throw new Error(`Verb "${v}" in both "${seen.get(v)}" and "${kind}"`);
      seen.set(v, kind);
    }
  }
})();

export function inferKindFromVerb(verb: string): CapabilityKind {
  const kind = VERB_TO_KIND[verb];
  if (!kind) throw new Error(`Unknown verb: "${verb}"`);
  return kind;
}
```

**Rules:**

- If `kind` is omitted in the descriptor, it's inferred from the verb via `VERB_TO_KIND`
- If `kind` is explicitly set, scanner **warns** if it disagrees with the inferred kind
- No verb may appear in two kind sets (enforced at module init — throws on load)

---

## 4. Capability Descriptor Schema

```typescript
type CapabilityKind = 'mutation' | 'read' | 'search' | 'admin' | 'system' | 'auth' | 'storage';

interface CapabilityDescriptor {
  key: string; // e.g. 'contacts.create' or 'admin.custom_fields.define'
  intent: string; // "Create a new contact"
  kind?: CapabilityKind; // optional — inferred from verb if omitted
  scope: 'org' | 'company' | 'site' | 'global';
  status: 'planned' | 'active' | 'deprecated';
  entities?: string[]; // related ENTITY_TYPES
  tags?: string[]; // e.g. ['crm', 'finance']
  headlessOnly?: boolean; // true = no UI surface required

  // Composable fields:
  requires?: string[]; // capability dependencies (invoices.submit requires invoices.read)
  produces?: string[]; // events emitted (e.g. 'contact.created')
  risks?: ('financial' | 'pii' | 'audit' | 'irreversible')[];

  // RBAC (derived, optional override):
  rbacTier?: 'public' | 'viewer' | 'editor' | 'manager' | 'admin' | 'system';
  rbacScope?: 'read' | 'write' | 'admin' | 'system';
}
```

**Key rules:**

- `kind: 'mutation'` capabilities MUST have a matching `ACTION_TYPE`
- `requires` enables UI to pre-check permissions
- `produces` links to audit + workflow triggers
- `risks` is a future safety gate ("financial mutations require audit receipt")
- `rbacTier` + `rbacScope` are derived if omitted (see §10)

---

## 5. Annotation Convention (Surface Boundaries Only)

### What gets annotated (exhaustive list)

| Pattern                                         | Annotate?                   |
| ----------------------------------------------- | --------------------------- |
| `apps/web/app/api/**/route.ts`                  | **Yes**                     |
| `apps/web/app/actions/**/*.ts`                  | **Yes**                     |
| `packages/*/src/**/handlers/*`                  | **Yes** (kernel handlers)   |
| `apps/web/app/**/page.tsx`                      | **Yes** (UI entry)          |
| `packages/workflow/src/engine.ts`               | **Yes** (engine entrypoint) |
| Internal helpers, deep components, shared utils | **No**                      |

**Rule:** Capabilities are about _what the system exposes_, not every function.

### Server actions / API routes

```typescript
export const CAPABILITIES = ['contacts.create', 'contacts.update'] as const;
```

Or per-function JSDoc:

```typescript
/** @capability contacts.create */
export async function createContact(...) { ... }
```

### UI pages (surface declaration with stable ID)

> **Implementation note:** SURFACE declarations live in co-located `surface.ts` files (not `page.tsx`) due to Next.js restriction on arbitrary exports from page files.

```typescript
// apps/web/app/(app)/org/[slug]/contacts/surface.ts
export const SURFACE = {
  surfaceId: 'web.contacts.list.page', // stable ID — survives route renames
  page: '/org/[slug]/contacts',
  exposes: ['contacts.list', 'contacts.create', 'contacts.delete'],
  intents: {
    // optional — helps reviews + AI context
    'contacts.delete': 'Bulk delete from table row action',
  },
} as const;
```

### Hybrid scanning strategy

| Level              | Method                                                                | Speed  | When                                                 |
| ------------------ | --------------------------------------------------------------------- | ------ | ---------------------------------------------------- |
| **Level 1** (fast) | Regex scan for `export const CAPABILITIES` and `export const SURFACE` | ~100ms | Always (default)                                     |
| **Level 2** (AST)  | ts-morph for `/** @capability */` JSDoc tags                          | ~2-5s  | Fallback if no const exports found, or `--deep` flag |

---

## 6. Five "Nothing Hidden" Invariants

### INVARIANT-VIS-00 — Canon Completeness for Mutations

> No state mutation exists without a capability key.

**Scope:** Only enforced inside surface boundary folders (§5 allowlist). Never fires on internal helpers.

**Scanner targets (write boundary detection):**

- `mutate(` calls
- `db.insert(`, `db.update(`, `db.delete(` (Drizzle query builder)
- `db.transaction(` / `tx.` patterns
- `.execute(` on SQL template tags
- `withAuth()` wrapping POST/PUT/PATCH/DELETE routes

**VIS-00 coverage rule (what counts as "covered"):**

- If a surface file contains any write boundary, it must have **one** of:
  - File-level `export const CAPABILITIES = [...]` covering the file
  - OR at least one `/** @capability */` JSDoc **on the write-performing function** (see below)
- If a write happens inside a helper called by the surface file, the **surface file** still needs `CAPABILITIES` (visibility is about surfaces, not call chains)
- Tagging "some other function" in the file does NOT count — the tag must be on the write-performing export or the file-level const must exist

**Write-performing function definition (deterministic per file type):**

| File pattern                   | Write-performing function                                                     |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `app/api/**/route.ts`          | Exported HTTP handler: `export async function POST`, `PUT`, `PATCH`, `DELETE` |
| `app/actions/**/*.ts`          | Any exported `async function` (or named export arrow)                         |
| `packages/*/src/**/handlers/*` | The default or named export                                                   |
| `packages/*/src/engine.ts`     | The entrypoint export (e.g. `evaluateRules`)                                  |

This makes the AST check deterministic — no heuristics about "which function does the write."

**FAIL** if any write boundary appears in a surface file with no matching coverage.

**Inline pointer (not authority):** `/** @capability:ignore VIS-00 exceptionId="EXC-0007" reason="..." */` is permitted, but ONLY if a matching entry exists in `.afena/capability-exceptions.json` with that `id`. Pointer without matching authority = error.

**Severity:** `error` — the #1 way hidden features happen.

### INVARIANT-VIS-01 — Kernel Coverage

> Every mutation capability must map to ACTION_TYPE + HANDLER_REGISTRY.

**Scanner logic:**

1. Collect capabilities where `kind === 'mutation'`
2. Verify matching `ACTION_TYPES` entry (canon)
3. Verify matching `HANDLER_REGISTRY` entry (crud)

**Severity:** `error`.

### INVARIANT-VIS-02 — Surface Coverage (kind-aware, phase-aware)

> Every active capability must be reachable from appropriate surfaces.

**Phase policy is encoded in canon** (not vibes):

```typescript
export const VIS_POLICY = {
  phase: 1, // bump to 2, 3 as enforcement tightens
  rules: {
    mutation: { kernelRequired: true, appRequired: true, uiSeverity: 'error' },
    read: { kernelRequired: false, appRequired: true, uiSeverity: 'warn' },
    search: { kernelRequired: false, appRequired: true, uiSeverity: 'warn' },
    admin: { kernelRequired: false, appRequired: true, uiSeverity: 'warn' },
    system: { kernelRequired: false, appRequired: true, uiSeverity: 'warn' },
    auth: { kernelRequired: false, appRequired: true, uiSeverity: 'error' },
    storage: { kernelRequired: false, appRequired: true, uiSeverity: 'warn' },
  },
} as const;
```

Bump `phase` + update `uiSeverity` when ready. "Why did CI start failing?" is always answerable by code.

### INVARIANT-VIS-03 — UI Rendering Truth

> UI surfaces must not expose undeclared capabilities.

**Scanner logic:**

1. Collect all `SURFACE.exposes` arrays from UI files
2. Verify every key exists in `CAPABILITY_KEYS`

**Severity:** `error` — prevents phantom features.

### INVARIANT-VIS-04 — No Dead Active Capabilities (deferred to Phase 3)

> If `status: 'active'`, the capability must be observed in at least one app surface.

**Scanner logic:**

1. Collect capabilities where `status === 'active'`
2. Verify at least one app surface (route/action/engine/CLI) declares it
3. `headlessOnly` + kind rules apply (system/storage may be engine-only)

**Severity:** `warn` initially, promotes to `error` in Phase 4. Keeps the catalog clean — prevents "declared active but nobody uses it" rot.

---

## 7. Governed Exceptions

Exceptions are explicit, ID'd, scoped, time-bounded, review-cycled, and committed to git.

**`.afena/capability-exceptions.json`**

```json
{
  "exceptions": [
    {
      "id": "EXC-0001",
      "key": "contacts.audit",
      "rule": "VIS-02",
      "scope": { "kind": "repo" },
      "reason": "UI audit page exists but SURFACE annotation not yet added.",
      "owner": "jackwee",
      "createdAt": "2026-02-12",
      "lastReviewedOn": "2026-02-12",
      "reviewEveryDays": 14,
      "expiresOn": "2026-03-15"
    }
  ]
}
```

### Exception scope (structured, not a loose string)

```typescript
type ExceptionScope =
  | { kind: 'repo' }
  | { kind: 'package'; package: string }
  | { kind: 'file'; file: string };
```

### Fields

| Field             | Purpose                                                             |
| ----------------- | ------------------------------------------------------------------- |
| `id`              | Stable identifier (e.g. `EXC-0001`) — referenced by inline pointers |
| `key`             | Capability key this exception applies to                            |
| `rule`            | Which VIS invariant is suppressed                                   |
| `scope`           | Structured blast radius constraint                                  |
| `reason`          | Human justification                                                 |
| `owner`           | Who is responsible                                                  |
| `createdAt`       | UTC date-only (`YYYY-MM-DD`)                                        |
| `lastReviewedOn`  | UTC date-only; if missing, treated as `createdAt`                   |
| `reviewEveryDays` | Forces periodic re-justification                                    |
| `expiresOn`       | UTC date-only; CI fails if expired                                  |

### Inline pointer format

```typescript
/** @capability:ignore VIS-00 exceptionId="EXC-0001" reason="..." */
```

Join key is `id` — unambiguous. Pointer without matching `id` in exceptions file = error.

### Scope matching rules (deterministic)

| Scope kind | Match rule                                                                |
| ---------- | ------------------------------------------------------------------------- |
| `repo`     | Applies to every file in the repository                                   |
| `package`  | File's normalized path starts with `${scope.package}/` (e.g. `apps/web/`) |
| `file`     | Exact normalized path match against `scope.file`                          |

**Path normalization:** CLI normalizes all paths to forward-slash (`/`) relative to repo root before matching. Windows `\` separators are converted. Trailing slashes stripped.

### Rules

- CI **fails** if an exception is expired (`now > expiresOn`)
- CI **warns** if an exception is overdue for review (`now - lastReviewedOn > reviewEveryDays`)
- Exceptions are the ONLY way to suppress a VIS check
- Scanner loads exceptions before running checks, marks matching capabilities as `excepted` in the ledger
- All dates compared as UTC date-only (no timezone ambiguity)

---

## 8. Architecture — Where Things Live

### Canon layer (`packages/canon`)

```
src/types/capability.ts          ← CapabilityDescriptor, CAPABILITY_CATALOG, CAPABILITY_DOMAINS,
                                    CAPABILITY_NAMESPACES, CAPABILITY_VERBS, VERB_TO_KIND,
                                    CapabilityKind, VIS_POLICY, parseCapabilityKey(),
                                    validateCapabilityKey(), inferKindFromVerb(),
                                    ACTION_FAMILY_TO_TIER, KIND_TO_TIER, KIND_TO_SCOPE,
                                    CAPABILITY_KEYS (derived)
src/schemas/capability.ts        ← Zod schemas for descriptor + exception + ExceptionScope validation
```

Exported from barrel. Zero new deps.

### Scanner layer (`tools/afena-cli`)

```
src/meta/
├── collectors/
│   ├── capability-catalog.ts    ← imports CAPABILITY_CATALOG from canon, validates structure
│   ├── surface-scanner.ts       ← hybrid L1 regex + L2 ts-morph for annotations
│   ├── kernel-coverage.ts       ← cross-refs capabilities ↔ ACTION_TYPES ↔ HANDLER_REGISTRY
│   ├── mutation-boundary.ts     ← detects write boundaries in surface files without capability tag
│   ├── package-graph.ts         ← pnpm workspace → DAG (Phase 3)
│   ├── schema-catalog.ts        ← Drizzle introspection → entity manifest (Phase 3)
│   └── stats.ts                 ← LOC, file count (Phase 3)
├── checks/
│   ├── vis-00-completeness.ts   ← no hidden mutations (surface boundary folders only)
│   ├── vis-01-kernel.ts         ← mutation → handler linkage
│   ├── vis-02-surface.ts        ← kind-aware, phase-aware surface coverage
│   ├── vis-03-ui-truth.ts       ← no phantom UI capabilities
│   └── vis-04-dead-active.ts    ← no dead active capabilities (Phase 3)
├── exceptions.ts                ← loads + validates + expiry + review cycle + pointer/authority check
├── autofix.ts                   ← safe insertion of CAPABILITIES/SURFACE skeletons (Phase 2)
├── emitters/
│   ├── ledger.ts                ← → .afena/capability.ledger.json
│   ├── matrix.ts                ← → .afena/capability.matrix.md
│   ├── fix-report.ts            ← → .afena/meta.fix.report.json (Phase 2)
│   ├── manifest.ts              ← → .afena/codebase.manifest.json (Phase 3)
│   └── mermaid.ts               ← → capability flow diagrams (Phase 3)
└── index.ts                     ← CLI: afena meta [gen|check|fix|matrix]
```

### Output files

| File                                | Phase | Git     | Purpose                                            |
| ----------------------------------- | ----- | ------- | -------------------------------------------------- |
| `.afena/capability.ledger.json`     | 1     | No      | Machine evidence: declared/observed/status per key |
| `.afena/capability.matrix.md`       | 1     | No      | Human-readable coverage table                      |
| `.afena/capability-exceptions.json` | 1     | **Yes** | Governed exception allowlist                       |
| `.afena/meta.fix.report.json`       | 2     | No      | Autofix change report (files touched + changes)    |
| `.afena/codebase.manifest.json`     | 3     | No      | Structural + schema + stats                        |

---

## 9. Ledger Status Derivation (Deterministic)

Status is derived purely from booleans — no human judgment, no debate:

| Status     | Rule                                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| `covered`  | `declared && observed && (kernel ok if mutation)`                                  |
| `orphaned` | `declared && !observed && status !== 'planned'`                                    |
| `phantom`  | `!declared && observed` (found in surface but not in catalog)                      |
| `excepted` | matches an active (non-expired) exception                                          |
| `planned`  | `declared && catalog.status === 'planned'` (does not participate in VIS-02/VIS-04) |

### Ledger JSON Schema

```typescript
interface CapabilityLedger {
  version: '1.0';
  generatedAt: string;
  policyPhase: number; // from VIS_POLICY.phase
  summary: {
    total: number;
    covered: number;
    orphaned: number;
    phantom: number;
    excepted: number;
    planned: number;
  };
  entries: LedgerEntry[];
}

interface LedgerEntry {
  key: string;
  declared: boolean;
  observed: boolean;
  kind: CapabilityKind;
  status: 'covered' | 'orphaned' | 'phantom' | 'excepted' | 'planned';
  kernel: {
    // mutations only
    actionType: boolean;
    handler: boolean;
  } | null;
  surfaces: {
    file: string;
    kind: 'server_action' | 'api_route' | 'cli_command' | 'engine';
  }[];
  uiSurfaces: {
    file: string;
    surfaceId: string;
    page: string;
  }[];
  exception?: {
    id: string;
    rule: string;
    scope: ExceptionScope;
    reason: string;
    expiresOn: string;
    reviewOverdue: boolean;
  };
}
```

---

## 10. RBAC Derivation (Composable, No Duplication)

Capabilities connect to permissions without inventing a second permission system.

### `rbacTier` — simple UI hide/show

Derive from existing `ACTION_FAMILY` (mutations) or `kind` (non-mutations):

| Source                    | Tier      |
| ------------------------- | --------- |
| `field_mutation` family   | `editor`  |
| `lifecycle` family        | `editor`  |
| `state_transition` family | `manager` |
| `ownership` family        | `admin`   |
| `read` / `search` kind    | `viewer`  |
| `admin` kind              | `admin`   |
| `system` kind             | `system`  |
| `auth` kind               | `public`  |
| `storage` kind            | `editor`  |

### `rbacScope` — richer backend policy

Derived from `kind` for backend policies that need nuance beyond tier:

| Kind                          | Scope    |
| ----------------------------- | -------- |
| `mutation`                    | `write`  |
| `read` / `search`             | `read`   |
| `admin`                       | `admin`  |
| `system` / `auth` / `storage` | `system` |

UI stays simple (tier). Backend policies can use scope for finer control (e.g. "viewer can read contacts, but not PII fields").

### Derivation maps (canon consts, not buried in CLI)

These live in `packages/canon/src/types/capability.ts` so UI, backend, and CLI all agree:

```typescript
export const ACTION_FAMILY_TO_TIER: Record<ActionFamily, RbacTier> = {
  field_mutation: 'editor',
  lifecycle: 'editor',
  state_transition: 'manager',
  ownership: 'admin',
  annotation: 'editor',
  system: 'system',
};

export const KIND_TO_TIER: Record<CapabilityKind, RbacTier> = {
  mutation: 'editor', // overridden by ACTION_FAMILY_TO_TIER for mutations
  read: 'viewer',
  search: 'viewer',
  admin: 'admin',
  system: 'system',
  auth: 'public',
  storage: 'editor',
};

export const KIND_TO_SCOPE: Record<CapabilityKind, RbacScope> = {
  mutation: 'write',
  read: 'read',
  search: 'read',
  admin: 'admin',
  system: 'system',
  auth: 'system',
  storage: 'system',
};
```

Both fields are **derived at build time** if omitted from the descriptor. Explicit override is allowed for edge cases.

---

## 11. Autofix Mode (`afena meta fix`)

Turns governance from "police" into "mechanic."

**What it does:**

- Scans surface boundary files for missing annotations
- **Inserts** `export const CAPABILITIES = [...] as const;` into eligible server action / API route files (infers from route name + action name)
- **Inserts** `export const SURFACE = { surfaceId: '...', page: '...', exposes: [...] } as const;` skeleton into `page.tsx` files
- **Updates** `.afena/capability-exceptions.json` only if it must (new gaps that can't be auto-annotated)
- **Never overwrites** existing annotations — only fills gaps
- **Writes** `.afena/meta.fix.report.json` listing every touched file + changes made

### Safe insertion rules (never breaks formatting or exports)

| Rule                     | Detail                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `CAPABILITIES` placement | Top-level, after imports, before first export/default export. Never inside functions.       |
| `CAPABILITIES` existing  | Only **append missing keys**; don't reorder unless `--sort` flag.                           |
| `SURFACE` placement      | Near top, but after `'use client'` directive if present.                                    |
| `SURFACE` existing       | Never overwrite; only fill missing `exposes` entries.                                       |
| Formatting               | Respect existing file indentation (detect tabs vs spaces).                                  |
| Report                   | Always write `.afena/meta.fix.report.json` with `{ files: [{ path, action, keysAdded }] }`. |

### `--dry-run` mode (CI safety culture)

| Command                    | Behavior                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------- |
| `afena meta fix --dry-run` | Prints what it _would_ do, writes `.afena/meta.fix.report.json` with `"dryRun": true`. No files edited. |
| `afena meta fix`           | Actually edits files, writes report with `"dryRun": false`.                                             |

People trust fixers when they can preview. `--dry-run` is the recommended first step in any CI pipeline or pre-commit hook.

**Phase 2 delivery.** Phase 1 annotations are manual (small surface area: ~12 files).

---

## 12. Key Dependencies

| Dependency         | Purpose                                                  | Install target           | Notes           |
| ------------------ | -------------------------------------------------------- | ------------------------ | --------------- |
| `ts-morph`         | L2 AST: JSDoc tags, fallback scanning, autofix insertion | `tools/afena-cli` devDep | ~15MB, dev-only |
| `fast-glob`        | File discovery for surface scanning                      | `tools/afena-cli` devDep | Lightweight     |
| None new for canon | Types + const arrays + pure functions only               | `packages/canon`         | Zero new deps   |

---

## 13. Phased Implementation

### Phase 1 — Canon + Annotations + VIS-00 + VIS-03 (Foundation)

Protects the most dangerous class first: **hidden writes** and **phantom UI**.

1. **`packages/canon/src/types/capability.ts`** — `CapabilityDescriptor`, `CapabilityKind`, `CAPABILITY_DOMAINS`, `CAPABILITY_NAMESPACES`, `CAPABILITY_VERBS`, `VERB_TO_KIND`, `CAPABILITY_CATALOG` (all known capabilities including `status: 'planned'`), `parseCapabilityKey()`, `validateCapabilityKey()`, `inferKindFromVerb()`, `ACTION_FAMILY_TO_TIER`, `KIND_TO_TIER`, `KIND_TO_SCOPE`, `VIS_POLICY`, derived `CAPABILITY_KEYS`
2. **`packages/canon/src/schemas/capability.ts`** — Zod validation for descriptors + exceptions + `ExceptionScope`
3. **Export from canon barrel** (`src/index.ts`)
4. **Annotate write surfaces** — add `CAPABILITIES` const to:
   - `apps/web/app/actions/contacts.ts` (7 capabilities)
   - `apps/web/app/api/search/route.ts` (1)
   - `apps/web/app/api/custom-fields/[entityType]/route.ts` (1)
   - `apps/web/app/api/views/[entityType]/route.ts` (1)
   - `apps/web/app/api/storage/presign/route.ts` (1)
   - `apps/web/app/api/storage/metadata/route.ts` (1)
5. **Annotate UI pages** — add `SURFACE` const (with `surfaceId`) to contacts pages (7 pages)
6. **Create `.afena/capability-exceptions.json`** — seed with any known gaps
7. **`tools/afena-cli/src/meta/` scaffold** — directory + index.ts CLI wiring
8. **L1 regex scanner** (`surface-scanner.ts`) — fast scan for `CAPABILITIES` + `SURFACE` consts
9. **VIS-00 checker** (`vis-00-completeness.ts`) — detect write boundaries in surface folders without capability tags
10. **VIS-03 checker** (`vis-03-ui-truth.ts`) — no phantom UI capabilities
11. **Exceptions loader** (`exceptions.ts`) — load + validate + expiry + review cycle + pointer/authority check
12. **Ledger emitter** (`ledger.ts`) — generate `.afena/capability.ledger.json` with deterministic statuses
13. **Matrix emitter** (`matrix.ts`) — generate `.afena/capability.matrix.md`
14. **`afena meta gen`** CLI command — runs collectors + emitters
15. **`afena meta check`** CLI command — runs VIS-00 + VIS-03, exits non-zero on failure
16. **Wire canon build** — verify CAPABILITY_KEYS derived correctly, run `pnpm build`

### Phase 2 — VIS-01 + VIS-02 + Autofix (Mutation Enforcement)

17. **VIS-01 checker** (`vis-01-kernel.ts`) — mutation capabilities ↔ ACTION_TYPES ↔ HANDLER_REGISTRY
18. **VIS-02 checker** (`vis-02-surface.ts`) — phase-aware policy from `VIS_POLICY`
19. **L2 AST scanner** — ts-morph fallback for `@capability` JSDoc tags
20. **Mutation boundary detector** (`mutation-boundary.ts`) — detect `mutate()`, `db.insert`, `db.transaction`, `.execute` in surface files
21. **Autofix** (`autofix.ts`) — `afena meta fix` with safe insertion rules (§11)
22. **Fix report emitter** (`fix-report.ts`) — writes `.afena/meta.fix.report.json`
23. **Kind inference validation** — scanner warns if catalog `kind` disagrees with `inferKindFromVerb()`
24. **Update `afena meta check`** — add VIS-01 + VIS-02 to check suite

### Phase 3 — VIS-04 + Reads/Search/Admin Enforcement + Structural Metadata

25. **Bump `VIS_POLICY.phase` to 3** — promote read/admin `uiSeverity` from `warn` → `error`
26. **VIS-04 checker** (`vis-04-dead-active.ts`) — no dead active capabilities (`warn`)
27. **Package graph collector** — pnpm workspace → DAG
28. **Schema catalog collector** — Drizzle introspection → entity manifest
29. **Stats collector** — LOC, file count per package
30. **Codebase manifest emitter** — `.afena/codebase.manifest.json`
31. **Mermaid emitter** — capability flow diagrams

### Phase 4 — CI + Automation

32. **turbo.json** — add `meta:check` task
33. **`entity-new.ts` integration** — auto-adds capability entries to canon
34. **`generateEntityActions()` auto-annotation** — factory emits `CAPABILITIES` const
35. **RBAC derivation** — `rbacTier` + `rbacScope` auto-populated from `kind` + `ACTION_FAMILY`
36. **Promote VIS-04** from `warn` → `error`

### Phase 5 — Runtime + AI Context

37. **API route: `GET /api/meta/capabilities`** — serves catalog for admin UI
38. **Feature flags by capability** — admin toggles per key
39. **AI context emitter** — `.agent/context/capability-map.md`
40. **Navigation generation** — "show all capabilities for Sales role"
41. **Permission pre-check** — UI uses `rbacTier` + `rbacScope` to hide/show buttons per user role

---

## 14. Integration with Existing Infrastructure

| Existing system              | Integration                                                           |
| ---------------------------- | --------------------------------------------------------------------- |
| `ACTION_TYPES` (canon)       | Auto-included in `CAPABILITY_KEYS` — mutation capabilities derived    |
| `ACTION_VERBS` (canon)       | Subset of `CAPABILITY_VERBS.mutation` — stays as-is                   |
| `ACTION_FAMILIES` (canon)    | Drives `rbacTier` + `rbacScope` derivation for mutations              |
| `ENTITY_TYPES` (canon)       | Subset of `CAPABILITY_DOMAINS` — entity domains are auto-included     |
| `HANDLER_REGISTRY` (crud)    | VIS-01 cross-refs every mutation capability                           |
| `generateEntityActions()`    | Produces 8 standard actions — one `CAPABILITIES` const covers all     |
| `withAuth()` (API routes)    | VIS-00 detects POST/PUT/PATCH/DELETE wrappers without capability tags |
| `evaluateRules()` (workflow) | `system.workflows.evaluate` declared in canon, engine is the surface  |
| `meta_assets` (DB)           | Phase 3: schema catalog validates code ↔ DB consistency               |
| `afena discover`             | Reuse signature-based caching for ledger freshness                    |
| `entity-new.ts`              | Phase 4: auto-generates capability entries when scaffolding           |

---

## 15. Anti-Patterns

- **Don't annotate internal helpers** — only surface boundaries (actions, routes, pages, engine entrypoints)
- **Don't duplicate ACTION_TYPES** — mutation capabilities are derived, not re-declared
- **Don't hand-edit CAPABILITY_KEYS** — always derived from `CAPABILITY_CATALOG`
- **Don't manually set `kind`** — let `inferKindFromVerb()` do it; override only with justification
- **Don't mix domains and namespaces** — `admin`, `system`, `auth`, `storage` are namespaces, not domains
- **Don't make annotations a framework** — one const or one JSDoc tag, never decorators/HOCs
- **Don't block reads in CI initially** — `error` for mutations, `warn` for reads, promote via `VIS_POLICY.phase`
- **Don't put ts-morph in canon** — canon stays zero-dep; scanning is CLI-only
- **Don't store generated files in git** — only `capability-exceptions.json` is committed
- **Don't suppress VIS checks inline** — exceptions file is the only authority; inline comments are pointers with `exceptionId`
- **Don't invent a second RBAC system** — derive `rbacTier` + `rbacScope` from existing `ACTION_FAMILY` + `kind`
- **Don't let autofix reorder** — append-only unless `--sort` flag; never insert inside functions

---

## 16. Naming Convention

| Concept                 | Afena name                                               |
| ----------------------- | -------------------------------------------------------- |
| The system              | **Capability Truth Ledger**                              |
| The catalog (canon)     | `CAPABILITY_CATALOG`                                     |
| The keys (derived)      | `CAPABILITY_KEYS`                                        |
| The domains (canon)     | `CAPABILITY_DOMAINS`                                     |
| The namespaces (canon)  | `CAPABILITY_NAMESPACES`                                  |
| The verb sets (canon)   | `CAPABILITY_VERBS`                                       |
| The verb→kind map       | `VERB_TO_KIND`                                           |
| The key parser          | `parseCapabilityKey()`                                   |
| The key validator       | `validateCapabilityKey()`                                |
| The kind inferrer       | `inferKindFromVerb()`                                    |
| The RBAC maps (canon)   | `ACTION_FAMILY_TO_TIER`, `KIND_TO_TIER`, `KIND_TO_SCOPE` |
| The phase policy        | `VIS_POLICY`                                             |
| The evidence ledger     | `.afena/capability.ledger.json`                          |
| The coverage matrix     | `.afena/capability.matrix.md`                            |
| The structural manifest | `.afena/codebase.manifest.json`                          |
| The exception allowlist | `.afena/capability-exceptions.json`                      |
| The fix report          | `.afena/meta.fix.report.json`                            |
| The invariants          | `VIS-00`, `VIS-01`, `VIS-02`, `VIS-03`, `VIS-04`         |
| The CLI                 | `afena meta [gen\|check\|fix\|matrix]`                   |

---

## 17. Resolved Decisions

All open questions from v1, v2, and v3 are now resolved:

| Question                                  | Decision                                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Flat vs grouped catalog?                  | **Flat map** (`Record<string, CapabilityDescriptor>`), `CAPABILITY_KEYS` derived                                          |
| Domain vs namespace?                      | **Split**: `CAPABILITY_DOMAINS` (business) + `CAPABILITY_NAMESPACES` (cross-cutting)                                      |
| Key format?                               | **2-part** `{domain}.{verb}` or **3-part** `{namespace}.{domain}.{verb}` — enforced by `parseCapabilityKey()`             |
| Key parsing?                              | **3-shape discriminated union** (`domain`, `namespace`, `namespaced-domain`) via `parseCapabilityKey()`                   |
| Key validation?                           | **`validateCapabilityKey()`** — parse + validate domain/namespace/verb in one call with developer-friendly errors         |
| Kind assignment?                          | **`VERB_TO_KIND`** precomputed map + `inferKindFromVerb()` — O(1), no-verb-in-two-kinds enforced at init                  |
| VIS-00 coverage rule?                     | **File-level const OR JSDoc on write-performing function** — tagging "some other function" doesn't count                  |
| VIS-00 write-performing function?         | **Deterministic per file type**: route.ts → exported HTTP handler; actions → exported async fn; handlers → default export |
| VIS-00 inline suppression?                | **Pointer with `exceptionId`** — must match `id` in exceptions file; pointer without authority = error                    |
| Exception scope matching?                 | **Deterministic**: `repo` = everywhere, `package` = path starts with, `file` = exact match; paths normalized to `/`       |
| VIS-02 severity?                          | **Phase-aware policy** encoded in `VIS_POLICY` — bump `phase` to tighten                                                  |
| VIS-04?                                   | **Deferred to Phase 3** (`warn`), promotes to `error` in Phase 4 — prevents dead active capabilities                      |
| Exception schema?                         | **Structured**: `id`, `createdAt`, `lastReviewedOn`, `reviewEveryDays`, `ExceptionScope` (repo/package/file)              |
| Exception scope?                          | **Typed union**: `{ kind: 'repo' }`, `{ kind: 'package'; package }`, `{ kind: 'file'; file }`                             |
| RBAC duplication?                         | **Composable**: `rbacTier` (UI hide/show) + `rbacScope` (backend policy) — both derived from `kind` + `ACTION_FAMILY`     |
| RBAC derivation maps?                     | **Canon consts**: `ACTION_FAMILY_TO_TIER`, `KIND_TO_TIER`, `KIND_TO_SCOPE` — shared by UI/backend/CLI                     |
| Autofix safety?                           | **Safe insertion rules**: after imports, before first export, never inside functions, append-only, fix report             |
| Autofix preview?                          | **`--dry-run`** writes report with `"dryRun": true`, edits nothing — recommended first step in CI                         |
| Read enforcement timing?                  | **Phase 1 declares**, Phase 3 enforces via `VIS_POLICY.phase` bump                                                        |
| SURFACE in page.tsx vs separate manifest? | **In page.tsx** with stable `surfaceId` for historical continuity                                                         |
| Phase 1 scope?                            | **Declare all known capabilities** (including `planned`), annotate contacts surfaces only                                 |
| Manifest naming?                          | **Split**: `capability.ledger.json` + `capability.matrix.md` + `codebase.manifest.json` + `meta.fix.report.json`          |
| Verb governance?                          | **`CAPABILITY_VERBS`** — locked sets per kind, no verb in two kinds                                                       |
| Scanning strategy?                        | **Hybrid**: L1 regex (fast, default) + L2 ts-morph (deep, fallback)                                                       |
| CAPABILITY_KEYS maintenance?              | **Derived** from `CAPABILITY_CATALOG` — never hand-edited                                                                 |
| Ledger statuses?                          | **Deterministic boolean derivation** — no human judgment                                                                  |
| Route renames?                            | **Stable `surfaceId`** in SURFACE declarations                                                                            |
| Annotation fatigue?                       | **`afena meta fix`** autofix mode with fix report (Phase 2)                                                               |
| Exception rot?                            | **`reviewEveryDays`** + structured `scope` + `lastReviewedOn` + UTC date-only expiry                                      |
