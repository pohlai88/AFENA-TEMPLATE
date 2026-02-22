/**
 * Architecture emitter — generates .architecture/*.architecture.md
 * from live codebase introspection data.
 *
 * Each package gets an architecture document combining:
 * 1. Static architectural description (from ARCH_REGISTRY)
 * 2. Live introspected data (exports, dirs, types, invariants, deps, tests)
 *
 * Run via: `afenda readme gen` (alongside README generation)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

import type { ArchPackageInfo } from '../collectors/architecture-introspector';

// ── Architecture Registry ──────────────────────────────────
// Static descriptions per package. Keys = package.json name.
// These provide the "why" and "how" that can't be introspected.

interface ArchEntry {
  /** Document title */
  title: string;
  /** Output filename (without .md) */
  filename: string;
  /** If true, do NOT auto-generate; file is manually maintained (e.g. database.architecture.md) */
  manualMaintenance?: boolean;
  /** One-line purpose */
  purpose: string;
  /** Architecture overview (markdown) */
  overview: string;
  /** Key design decisions (markdown) */
  decisions: string;
  /** Data flow description (markdown) */
  dataFlow?: string;
  /** Integration points */
  integrations?: string;
  /** Cross-references to other docs */
  crossRefs?: string[];
  /** ERP App Shell governance spec (adds dedicated section with link) */
  erpAppShellRef?: string;
}

const ARCH_REGISTRY: Record<string, ArchEntry> = {
  'afenda-canon': {
    title: 'Canon (Type Authority)',
    filename: 'canon.architecture',
    purpose: 'Single source of truth for all types, schemas, enums, and capability definitions across the monorepo.',
    overview: `
Canon is the **type authority** package — every other package imports its contracts from here.
It defines the vocabulary of the entire system: entity types, action types, error codes,
capability keys, Zod validation schemas, and RBAC tier mappings.

**Zero runtime dependencies.** Canon is pure TypeScript types + Zod schemas + const objects.
It never imports from any other workspace package.
`,
    decisions: `
- **ActionType formula**: \`\${entityType}.\${verb}\` — canonical, no exceptions
- **Capability key shapes**: 3 discriminated union shapes (domain.verb, domain.namespace.verb, namespace.verb)
- **Zod v4**: strict mode, \`z.record()\` requires 2 args, UUID validation is RFC 4122 strict
- **VIS_POLICY**: phase-aware visibility rules encoded as const objects (not runtime config)
- **CAPABILITY_CATALOG**: 26 capabilities with kind, tier, scope, status, entities, risks
`,
    crossRefs: ['crud.architecture.md', 'business.logic.architecture.md'],
  },

  'afenda-crud': {
    title: 'Interaction Kernel (CRUD-SAP)',
    filename: 'crud.architecture',
    purpose: 'Single mutation entry point for all domain data — the afenda Interaction Kernel (AIK).',
    overview: `
Every domain mutation flows through \`mutate()\` — no exceptions. ESLint INVARIANT-01 enforces
that no package outside \`packages/crud\` may call \`db.insert()\`, \`db.update()\`, or \`db.delete()\`
on domain tables.

The kernel pipeline: Validation → Lifecycle Guard → Policy Gate → Governor → Workflow Before →
Transaction (handler + audit + version) → Workflow After → Metering.
`,
    decisions: `
- **K-01**: \`mutate()\` is the only way to write domain data
- **K-02**: Single DB transaction per mutation
- **K-03**: Every mutation writes audit_logs + entity_versions
- **K-04**: \`expectedVersion\` required on update/delete/restore (optimistic locking)
- **K-05**: Package exports ONLY \`mutate\`, \`readEntity\`, \`listEntities\`
- **K-06**: Namespaced actions \`{entity}.{verb}\`, verb = last segment
- **K-11**: Allowlist input (handler pick) + kernel denylist backstop (strips system cols)
- **K-13**: Diff normalizes snapshots first, no post-filter
`,
    dataFlow: `
\`\`\`
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
\`\`\`
`,
    crossRefs: ['business.logic.architecture.md', 'database.architecture.md'],
  },

  'afenda-database': {
    title: 'Database Layer',
    filename: 'database.architecture',
    /** Manually maintained contract; do NOT overwrite via readme gen */
    manualMaintenance: true,
    purpose: 'Drizzle ORM schema definitions, dual RW/RO compute, migration management, and schema governance.',
    overview: `
Neon Postgres with Drizzle ORM. Two connection singletons: \`db\` (RW) and \`dbRo\` (RO read replica).
All domain tables use \`baseEntityColumns\` or \`erpEntityColumns\` helpers. Custom fields are
JSONB + typed index (no DDL migrations for user-defined fields).

Schema governance: 8-rule lint, entity generator script, LiteMetadata registry.
`,
    decisions: `
- **Dual compute**: \`DATABASE_URL\` (RW) + \`DATABASE_URL_RO\` (RO, optional fallback)
- **Write safety**: 3 layers — export naming (\`dbRo\`), ESLint rules (INVARIANT-RO), DB role
- **RLS**: Every domain table has \`org_id\` + \`enableRLS\` + \`tenantPolicy\`
- **Column helpers**: \`baseEntityColumns\` (all entities), \`erpEntityColumns\` (ERP axis keys), \`docEntityColumns\` (document lifecycle)
- **Custom fields**: \`custom_fields\` meta → \`custom_data\` JSONB + \`custom_field_values\` typed index
- **Triggers**: \`set_updated_at\` in public schema, \`search_vector\` tsvector triggers per entity
`,
    crossRefs: ['db.schema.governance.md', 'multitenancy.architecture.md'],
  },

  'afenda-search': {
    title: 'Search Engine',
    filename: 'search.architecture',
    purpose: 'Full-text search helpers, per-entity adapters, and cross-entity search registry.',
    overview: `
PostgreSQL-native search using tsvector columns + GIN indexes. Each entity registers a search
adapter function. Cross-entity search fans out to all registered adapters in parallel, merges
results by score, and caps at the requested limit.

Two search paths: FTS (queries ≥ 3 chars, no @) and ILIKE fallback (short queries, email searches).
The \`search_index\` materialized view provides a unified cross-entity search surface.
`,
    decisions: `
- **FTS config**: \`'simple'\` (not \`'english'\`) — multi-language friendly
- **Adapter pattern**: Each entity provides a \`searchFn(query, limit) → SearchResult[]\`
- **Cross-entity**: \`Promise.all\` fan-out with per-adapter error isolation (\`.catch(() => [])\`)
- **Score normalization**: FTS uses \`ts_rank\`, ILIKE uses position-based scoring (1 - idx * 0.01)
- **Read replica**: All search queries use \`dbRo\` (never the RW connection)
`,
    integrations: `
- **Command palette** (⌘K/Ctrl+K): \`apps/web\` calls \`/api/search\` → \`crossEntitySearch()\`
- **Entity list pages**: Per-entity adapters used for filtered search within entity type
`,
    crossRefs: ['database.architecture.md', 'route.architecture.md'],
  },

  'afenda-workflow': {
    title: 'Workflow Engine',
    filename: 'workflow.architecture',
    purpose: 'Rule engine for before/after mutation hooks — conditional logic, input enrichment, and side effects.',
    overview: `
Rules are registered in an in-memory registry (sorted by priority) and evaluated by the engine
during \`mutate()\`. Before-rules can block or enrich mutations. After-rules execute fire-and-forget
side effects. All rule executions are logged to \`workflow_executions\` (append-only).

Rules can be defined in code (startup registration) or loaded from DB per-org with TTL caching (60s).
JSON rule definitions are interpreted into ConditionFn/ActionFn via the interpreter module.
`,
    decisions: `
- **Before-rules**: Can block (\`ok: false\`) or enrich (\`enrichedInput\`). Errors = block (fail-safe).
- **After-rules**: Fire-and-forget. Errors logged but never block the mutation.
- **Priority ordering**: Lower number = runs first (default 100)
- **DB loader**: TTL-cached (60s), rule IDs prefixed with \`db:{orgId}:\` for collision avoidance
- **Execution logging**: Fire-and-forget \`db.insert(workflowExecutions)\` — never fails the mutation
- **Error truncation**: \`String(error).slice(0, 2000)\` to prevent log bloat
`,
    dataFlow: `
\`\`\`
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
\`\`\`
`,
    crossRefs: ['crud.architecture.md', 'business.logic.architecture.md'],
  },

  'afenda-migration': {
    title: 'Migration Engine',
    filename: 'migration.architecture',
    purpose: 'Legacy data migration pipeline with atomicity guarantees, conflict detection, and signed audit reports.',
    overview: `
Template Method pipeline: Extract → Transform → Plan → Load. Each batch is processed through
a configurable chain of transforms, conflict detectors, and gates. Lineage tracking ensures
every legacy record maps to exactly one afenda entity (reservation-first pattern).

Operational hardening: retry/quarantine wrapper (\`withTerminalOutcome\`), periodic checkpoints,
performance tracking (p50/p95), and configurable conflict thresholds for score-based merge routing.
`,
    decisions: `
- **D0.1**: Reservation reclaim is single-statement atomic (\`UPDATE ... RETURNING\`)
- **D0.2**: Delete reservation only by owned \`lineageId\` (never composite key)
- **TERM-01**: Every record reaches exactly one terminal state (loaded/quarantined/manual_review/skipped)
- **Error classification**: Transient (40001, 40P01, 57014, 08006) → retry; permanent → quarantine
- **Conflict thresholds**: \`autoMerge: 60\`, \`manualReview: 30\` (configurable)
- **Signed reports**: SHA-256 fingerprints for source schema, mappings, transforms, strategy
- **Parallel creates**: \`p-limit\` with configurable concurrency (default 10)
`,
    dataFlow: `
\`\`\`
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
\`\`\`
`,
    crossRefs: ['database.architecture.md', 'crud.architecture.md'],
  },

  'afenda-logger': {
    title: 'Logging & Observability',
    filename: 'logger.architecture',
    purpose: 'Pino-based structured logging with AsyncLocalStorage context propagation.',
    overview: `
Singleton Pino logger with environment-aware configuration (JSON in prod, pretty in dev, silent in test).
AsyncLocalStorage (ALS) propagates request context (request_id, org_id, actor_id) through the
entire call chain without manual threading.

Edge Runtime safe: ALS uses lazy \`require('node:async_hooks')\` with try/catch fallback.
`,
    decisions: `
- **ALS scope**: Established at handler level (\`withAuth\`), not middleware level
- **Graceful degradation**: \`getRequestId() ?? crypto.randomUUID()\` — always works without ALS
- **Redaction**: Passwords, tokens, secrets, authorization headers auto-redacted
- **Audit channel**: Dedicated child logger with stable schema (\`channel: 'audit'\`)
- **Component loggers**: \`createComponentLogger(parent, 'crud')\` for scoped logging
- **No console.***: CI invariant E2 enforces Pino-only logging in runtime paths
`,
    crossRefs: ['route.architecture.md', 'crud.architecture.md'],
  },

  'afenda-ui': {
    title: 'UI Design System',
    filename: 'ui.architecture',
    purpose: 'Four-layer design system: Engine tokens → CSS bridge → shadcn/ui primitives → App shell.',
    overview: `
Layer 0 (Engine): \`tailwindengine.json\` → codegen → CSS custom properties.
Layer 1 (Bridge): \`globals.css\` maps engine tokens → shadcn semantic variables.
Layer 2 (Components): 56 shadcn/ui primitives + custom hooks + utility lib.
Layer 3 (App Shell): Sidebar, header, breadcrumbs, command palette, auth UI.

Zero-drift constraints: no hardcoded colors, no client-invented actions, no \`console.*\`,
no \`'use client'\` in pages/layouts.
`,
    decisions: `
- **Tailwind v4**: \`@theme inline\` registers \`--color-*\` for utility classes
- **shadcn/ui**: new-york style, Radix UI unified package
- **Token bridge**: Engine tokens → bare CSS vars (shadcn) + \`@theme inline\` (Tailwind v4)
- **Glass utility**: Dark-mode-aware in \`@layer utilities\` (not \`@utility\`)
- **Button polish**: Transition, shadow, lift on hover, press scale (both modes)
- **Import aliases**: \`afenda-ui/components\` and \`afenda-ui/lib/utils\` in app workspace
`,
    crossRefs: ['route.architecture.md'],
    erpAppShellRef: '../packages/ui/erp-architecture.ui.md',
  },

  'apps/web': {
    title: 'Web Application (Next.js)',
    filename: 'route.architecture',
    purpose: 'BFF pattern — Server Actions for domain CRUD, API routes for cross-cutting concerns.',
    overview: `
Next.js 16 App Router with RSC-first architecture. Server actions are the primary interface
for all domain mutations and reads. API routes exist for search, metadata, storage, and
future external integrations.

Auth: Neon Auth with middleware-level session validation. Org context resolved from path
(\`/org/[slug]/...\`). AsyncLocalStorage established at handler level for request tracing.
`,
    decisions: `
- **Server actions**: Primary BFF — domain CRUD via \`generateEntityActions(entityType)\` factory
- **API routes**: \`withAuth()\` factory — auth guard + org resolution + standard envelope
- **No client DB access**: Every data path flows through server actions or API routes
- **RSC-first**: Pages/layouts are Server Components; client interactivity in \`*_client.tsx\` only
- **Entity generator**: Zero manual wiring for new entities (Gate G2)
- **CI invariants**: E1 (no 'use client' in page/layout), E2 (no console.*), E3 (no hardcoded colors), E4 (no ad-hoc verbs)
`,
    crossRefs: ['ui.architecture.md', 'multitenancy.architecture.md'],
  },

  'erp-architecture.ui': {
    title: 'ERP Architecture UI',
    filename: 'erp-architecture.ui',
    manualMaintenance: true,
    purpose: 'Governance spec for ERP app shell, nav SSOT, forms. Manually maintained in packages/ui/.',
    overview: 'See packages/ui/erp-architecture.ui.md.',
    decisions: '- Manually maintained. Not generated by readme gen.',
  },

  'tools/afenda-cli': {
    title: 'CLI & Meta Engine',
    filename: 'meta.architecture',
    purpose: 'Capability Truth Ledger — scan, check, generate, fix. README generation. Entity scaffolding.',
    overview: `
The CLI provides three command groups: \`meta\` (capability governance), \`readme\` (documentation),
and entity generation. The meta engine scans the codebase for capability annotations, runs
5 visibility checks (VIS-00 through VIS-04), and generates a capability ledger, coverage matrix,
Mermaid diagrams, and AI context documents.

Architecture documents are auto-generated from live codebase introspection during \`readme gen\`.
`,
    decisions: `
- **VIS-00**: No state mutation without a capability key (write boundary detection)
- **VIS-01**: Every mutation capability maps to ACTION_TYPES + HANDLER_REGISTRY
- **VIS-02**: Phase-aware surface coverage (kind-dependent severity)
- **VIS-03**: UI surfaces must not expose undeclared capabilities
- **VIS-04**: Active capabilities must be observed in at least one surface
- **L1 scanner**: Regex-based (fast) for CAPABILITIES + SURFACE consts
- **L2 scanner**: AST-based (\`--deep\` flag) for @capability JSDoc tags
- **Exception system**: JSON file with expiry dates + review cycles
`,
    crossRefs: ['crud.architecture.md'],
  },
};

// ── Renderer ───────────────────────────────────────────────

/**
 * Render a single architecture document from registry entry + live data.
 */
function renderArchDoc(entry: ArchEntry, info: ArchPackageInfo): string {
  const lines: string[] = [];
  const now = `${new Date().toISOString().slice(0, 19)}Z`;

  lines.push(`# afenda ${entry.title} — Architecture Reference`);
  lines.push('');
  lines.push(`> **Auto-generated** by \`afenda readme gen\` at ${now}. Do not edit — regenerate instead.`);
  lines.push(`> **Package:** \`${info.name}\` (\`${info.path}\`)`);
  lines.push(`> **Purpose:** ${entry.purpose}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // §1 Overview
  lines.push('## 1. Architecture Overview');
  lines.push('');
  lines.push(entry.overview.trim());
  lines.push('');

  // §2 Data Flow (if provided)
  if (entry.dataFlow) {
    lines.push('---');
    lines.push('');
    lines.push('## 2. Data Flow');
    lines.push('');
    lines.push(entry.dataFlow.trim());
    lines.push('');
  }

  // §3 Key Design Decisions
  lines.push('---');
  lines.push('');
  lines.push(`## ${entry.dataFlow ? '3' : '2'}. Key Design Decisions`);
  lines.push('');
  lines.push(entry.decisions.trim());
  lines.push('');

  // §4 Package Structure (live)
  const sectionNum = entry.dataFlow ? 4 : 3;
  lines.push('---');
  lines.push('');
  lines.push(`## ${sectionNum}. Package Structure (live)`);
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`| ------ | ----- |`);
  lines.push(`| **Source files** | ${info.sourceFileCount} |`);
  lines.push(`| **Test files** | ${info.testFileCount} |`);
  lines.push(`| **Source directories** | ${info.sourceDirs.length > 0 ? info.sourceDirs.join(', ') : '(flat)'} |`);
  lines.push('');

  if (info.sourceDirs.length > 0) {
    lines.push('```');
    lines.push(`${info.path}/src/`);
    for (const dir of info.sourceDirs) {
      lines.push(`├── ${dir}/`);
    }
    lines.push('```');
    lines.push('');
  }

  // §5 Public API (live barrel exports)
  if (info.barrelExports.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push(`## ${sectionNum + 1}. Public API (barrel exports)`);
    lines.push('');

    const valueExports = info.barrelExports.filter((e) => e.kind !== 'type');
    const typeExports = info.barrelExports.filter((e) => e.kind === 'type');

    if (valueExports.length > 0) {
      lines.push('### Value Exports');
      lines.push('');
      lines.push('| Export | Source |');
      lines.push('| ------ | ------ |');
      for (const exp of valueExports) {
        lines.push(`| \`${exp.name}\` | \`${exp.source}\` |`);
      }
      lines.push('');
    }

    if (typeExports.length > 0) {
      lines.push('### Type Exports');
      lines.push('');
      lines.push('| Type | Source |');
      lines.push('| ---- | ------ |');
      for (const exp of typeExports) {
        lines.push(`| \`${exp.name}\` | \`${exp.source}\` |`);
      }
      lines.push('');
    }
  }

  // §6 Dependencies (live)
  const depSection = info.barrelExports.length > 0 ? sectionNum + 2 : sectionNum + 1;
  lines.push('---');
  lines.push('');
  lines.push(`## ${depSection}. Dependencies`);
  lines.push('');

  if (info.internalDeps.length > 0) {
    lines.push('### Internal (workspace)');
    lines.push('');
    for (const dep of info.internalDeps) {
      lines.push(`- \`${dep}\``);
    }
    lines.push('');
  }

  const extEntries = Object.entries(info.externalDeps);
  if (extEntries.length > 0) {
    lines.push('### External');
    lines.push('');
    lines.push('| Package | Version |');
    lines.push('| ------- | ------- |');
    for (const [name, version] of extEntries.sort((a, b) => a[0].localeCompare(b[0]))) {
      lines.push(`| \`${name}\` | \`${version}\` |`);
    }
    lines.push('');
  }

  // §7 Database Tables (if any)
  if (info.ownedTables.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push(`## ${depSection + 1}. Database Tables`);
    lines.push('');
    for (const table of info.ownedTables) {
      lines.push(`- \`${table}\``);
    }
    lines.push('');
  }

  // §8 Invariants (live)
  if (info.invariants.length > 0) {
    const invSection = info.ownedTables.length > 0 ? depSection + 2 : depSection + 1;
    lines.push('---');
    lines.push('');
    lines.push(`## ${invSection}. Invariants`);
    lines.push('');
    for (const inv of info.invariants) {
      lines.push(`- \`${inv}\``);
    }
    lines.push('');
  }

  // §9 Design Patterns (live)
  if (info.patterns.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('## Design Patterns Detected');
    lines.push('');
    for (const p of info.patterns) {
      lines.push(`- **${p}**`);
    }
    lines.push('');
  }

  // §10 Integrations
  if (entry.integrations) {
    lines.push('---');
    lines.push('');
    lines.push('## Integrations');
    lines.push('');
    lines.push(entry.integrations.trim());
    lines.push('');
  }

  // §11 Cross-references
  if (entry.crossRefs && entry.crossRefs.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('## Cross-References');
    lines.push('');
    for (const ref of entry.crossRefs) {
      lines.push(`- [\`${ref}\`](./${ref})`);
    }
    lines.push('');
  }

  // §12 ERP App Shell (when applicable)
  if (entry.erpAppShellRef) {
    lines.push('---');
    lines.push('');
    lines.push('## ERP App Shell');
    lines.push('');
    lines.push(`- [\`erp-architecture.ui.md\`](./${entry.erpAppShellRef}) — Governance spec for org-scoped app shell, nav SSOT, forms`);
    lines.push('');
  }

  return lines.join('\n');
}

// ── Public API ─────────────────────────────────────────────

/**
 * Generate all architecture documents from introspected package data.
 * Returns a map of filename → markdown content.
 */
export function generateArchitectureDocs(
  packages: ArchPackageInfo[],
): Map<string, string> {
  const docs = new Map<string, string>();

  // Build lookup by name and by path
  const byName = new Map<string, ArchPackageInfo>();
  const byPath = new Map<string, ArchPackageInfo>();
  for (const pkg of packages) {
    byName.set(pkg.name, pkg);
    byPath.set(pkg.path, pkg);
  }

  for (const [key, entry] of Object.entries(ARCH_REGISTRY)) {
    if (entry.manualMaintenance) continue;
    // Match by name first, then by path
    const info = byName.get(key) ?? byPath.get(key);
    if (!info) continue;

    const content = renderArchDoc(entry, info);
    docs.set(`${entry.filename}.md`, content);
  }

  return docs;
}

/**
 * Write architecture documents to .architecture/ directory.
 * Returns list of written filenames.
 */
export function writeArchitectureDocs(
  repoRoot: string,
  docs: Map<string, string>,
): string[] {
  const archDir = join(repoRoot, '.architecture');
  mkdirSync(archDir, { recursive: true });

  const written: string[] = [];

  for (const [filename, content] of docs) {
    const outPath = join(archDir, filename);
    writeFileSync(outPath, content, 'utf-8');
    written.push(filename);
  }

  return written;
}

/**
 * Get the list of registered architecture document filenames.
 */
export function getRegisteredArchDocs(): string[] {
  return Object.values(ARCH_REGISTRY).map((e) => `${e.filename}.md`);
}
