# afenda Workflow V2 — Contracted Workflow Envelope (Ratification Draft)

> **Document:** `.PRD/workflow.md`
> **Monorepo root:** `C:\AI-BOS\AFENDA-NEXUS`
>
> | Path                                              | Purpose                                             | Status          |
> | ------------------------------------------------- | --------------------------------------------------- | --------------- |
> | `.PRD/workflow.md`                                | This spec (canonical, ratification-grade)           | Active          |
> | `packages/workflow/src/`                          | V1 rule engine (7 source files)                     | Production      |
> | `packages/workflow/src/v2/`                       | V2 Contracted Workflow Envelope (projected)         | Not yet created |
> | `packages/crud/src/lifecycle.ts`                  | Lifecycle state machine (draft→submitted→active→…)  | Production      |
> | `packages/database/src/schema/approval-chains.ts` | Approval chain schema (4 tables)                    | Schema only     |
> | `packages/database/drizzle/`                      | SQL migrations (0031–0037 transactional spine done) | Production      |
> | `packages/canon/src/`                             | Canon types, Zod schemas, contracts                 | Production      |
> | `.PRD/advance.db.md`                              | DB architecture audit (v2.2)                        | Active          |
> | `.PRD/erp.db.schema.md`                           | ERP schema reference                                | Active          |

Evolve the current flat rule engine into an ERP-native **Contracted Workflow Envelope**: lifecycle skeleton (immutable) + DAG body (org-customizable) + version-pinned approvals + exactly-once semantics + outbox-driven advancement, designed for 1M+ document scale on Neon Postgres.

---

## Current State Analysis

### What exists today

| Layer                       | Status                    | Files                                                                                             |
| --------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------- |
| **Rule Engine**             | ✅ Production             | `packages/workflow/src/` — 7 source files, before/after hooks on `mutate()`                       |
| **Lifecycle State Machine** | ✅ Production             | `packages/crud/src/lifecycle.ts` — draft→submitted→active→cancelled→amended                       |
| **Approval Chain Schema**   | ⚠️ Schema only, not wired | `packages/database/src/schema/approval-chains.ts` — 4 tables (chains, steps, requests, decisions) |
| **Workflow Rules (DB)**     | ✅ Production             | `workflow_rules` table + TTL-cached DB loader + JSON interpreter                                  |
| **Execution Logging**       | ✅ Production             | `workflow_executions` — append-only evidence                                                      |

### Gaps preventing "open-ended" workflows

1. **No graph/DAG model** — rules are flat (before/after), no concept of "this step leads to that step"
2. **No step orchestration** — no sequential, parallel, or branching execution
3. **No wait states** — can't pause for human input, timer, or external event
4. **No workflow instances** — no runtime tracking of "where is this document in its flow"
5. **Approval chains not wired** — schema exists but no runtime engine connects them to lifecycle
6. **No user-customizable flows** — rules are dev-configured or org-JSON, not visual DAGs
7. **No version-pinned approvals** — no mechanism to bind approval decisions to a specific document revision
8. **No concurrency control** — no single-writer guarantee on workflow advancement
9. **No event outbox** — workflow advancement inside request latency at scale

---

## Truth Invariants (non-negotiable, CI-testable + runtime-enforced)

Workflow equivalent of K-01 through K-15. Every one must be provable.

| ID        | Invariant                                                                                                                                                                                                                                                                                                                                                                                                          | Enforcement                                                                                                                                                                                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **WF-01** | **Single writer per instance** — only one `advanceWorkflow()` may own an instance at a time. Prevents edge fan-out races.                                                                                                                                                                                                                                                                                          | `pg_advisory_xact_lock(hashtextextended(instance_id::text, 0))` at start of every `advanceWorkflow()`. Uses Postgres-native 64-bit hash — deterministic, no Node/TS runtime drift.                                                                                                                                                 |
| **WF-02** | **Exactly-once step execution** per (instance, node, token, entity_version). Version change = new contract.                                                                                                                                                                                                                                                                                                        | `idempotency_key = sha256(instance_id + node_id + token_id + entity_version)`. Global dedup via `workflow_step_receipts` PK `(org_id, instance_id, idempotency_key)` — non-partitioned. INSERT conflict = skip. Step execution row written to partitioned table in same TX.                                                        |
| **WF-03** | **Approvals are version-pinned AND version-consumptive**. A decision is valid only for its entity_version and is marked `applied: true` when used to pass a gate. Cannot be replayed. Post-approval edits invalidate unapplied decisions.                                                                                                                                                                          | `approval` handler checks version match. `lifecycle_gate` handler verifies feeding approval step's `entity_version === current`.                                                                                                                                                                                                   |
| **WF-04** | **Definition immutability enforced by DB** — published `workflow_definitions` rows cannot have `nodes_json`/`edges_json`/`compiled_json` mutated.                                                                                                                                                                                                                                                                  | DB trigger: `reject_published_definition_mutation()` raises exception if `OLD.status = 'published'` and content columns changed. Draft is editable. Publish = compile + lock. Archive only changes status.                                                                                                                         |
| **WF-05** | **Version drift auto-routes to amendment** — if entity_version changes while instance is in a "stable region" (between Submit and Approval gates), auto-route to Amendment branch or fail with `WORKFLOW_VERSION_DRIFT`.                                                                                                                                                                                           | `advanceWorkflow()` checks `current_entity_version` vs `instance.entity_version`. If diverged and current node is in `compiled.stableRegionNodes`, emit error or auto-advance to amendment branch.                                                                                                                                 |
| **WF-06** | **Body patches are slot-scoped**. Custom nodes/edges may only exist in declared body slots between system gates. No edges may target `sys:*` nodes except via slot attachment points. Org definitions are "slot graph patches", not full DAG edits.                                                                                                                                                                | Compiler validates: every custom node ID matches `usr:<slotId>:<uuid>` namespace. Every custom edge stays within slot boundaries. Slot validator rejects out-of-scope references.                                                                                                                                                  |
| **WF-07** | **Effective workflow is always compiled + compiler-current**. Runtime never executes raw body JSON — only the compiled Effective Workflow (envelope + merged body). `compiled_hash` must match recomputation. `compiler_version` must match current engine.                                                                                                                                                        | Engine refuses to create instances from uncompiled definitions. `advanceWorkflow()` verifies `compiled_hash` on load. If `compiled.compilerVersion !== CURRENT_COMPILER_VERSION` → refuse with `WORKFLOW_COMPILER_STALE` (force recompile gated by admin). Publish = `compileEffective()` + freeze.                                |
| **WF-08** | **System envelope integrity**. System nodes/edges must be present and in correct topological order in every Effective Workflow. Compile fails if any system node is missing, altered, or reordered.                                                                                                                                                                                                                | `compileEffective()` checks `systemGateIntegrity` as final step. CI test: compile with missing/reordered system node → must fail.                                                                                                                                                                                                  |
| **WF-09** | **All body actions are explicit workflow steps**. No "hidden" post-hooks that perform side effects without a `workflow_step_execution` row. Any additional mutation invoked by workflow must create a step execution record.                                                                                                                                                                                       | Engine enforces: every node dispatch writes a step*execution row \_before* executing. `action` node handler calls `mutate()` via `MutationSpecRef` and records the receipt in `output_json`. Prevents "workflow drift by hidden code".                                                                                             |
| **WF-10** | **All cross-service side effects must be outbox-backed**. Webhooks, email, 3rd-party sync, notifications — must write to `workflow_side_effects_outbox` first. IO worker executes and records evidence. No direct HTTP/SMTP calls from engine hot path.                                                                                                                                                            | `webhook_out` and `notification` node handlers write to `workflow_side_effects_outbox` (separate from engine trigger outbox). IO worker executes with exponential backoff + dead-letter. Evidence stored in `response_json` + `step_execution.output_json`.                                                                        |
| **WF-11** | **Outbox processing is idempotent per event**. Worker crash after executing but before marking completed must not cause duplicate side effects. Both outbox tables use `event_idempotency_key` for dedup via non-partitioned `workflow_outbox_receipts`.                                                                                                                                                           | Engine outbox: `sha256(instance_id + event_type + canonicalJsonHash(payload_json) + entity_version)`. Side-effect outbox: `sha256(step_execution_id + effect_type + canonicalJsonHash(payload_json))`. Global dedup enforced by `workflow_outbox_receipts` PK (non-partitioned). INSERT conflict = skip.                           |
| **WF-12** | **Compile output is deterministic (node/edge canonicalization)**. Two compiles of the same inputs must produce identical `compiled_hash`. Node and edge arrays sorted by `id` before hashing.                                                                                                                                                                                                                      | `compileEffective()` sorts `effective.nodes` and `effective.edges` by `id` before computing adjacency maps and hash. CI test: compile same definition twice → hashes must match.                                                                                                                                                   |
| **WF-13** | **Topological order is stable (tie-break by node_id)**. When multiple nodes have equal topo rank, they are ordered by `node_id` lexicographically. Prevents hash drift across environments.                                                                                                                                                                                                                        | `topologicalSort()` uses `node_id` as deterministic tie-breaker. CI test: compile on two different machines → `topologicalOrder` arrays must be identical.                                                                                                                                                                         |
| **WF-14** | **Receipt-first execution**. No step handler may run unless the receipt INSERT succeeded. Receipt → step row → dispatch handler → side effects. This prevents "executed but receipt write failed" split-brain.                                                                                                                                                                                                     | Core loop enforces strict ordering: (1) receipt INSERT, (2) step_execution INSERT, (3) handler dispatch. If receipt INSERT is no-op → skip entirely. CI test: mock receipt failure → handler must NOT execute.                                                                                                                     |
| **WF-15** | **Token position determinism**. For any instance, the set of executable nodes is derivable from compiled DAG + step_executions alone, independent of `workflow_instances` projection. Token position = "next executable node" (a node becomes executable only after all inbound requirements are satisfied). Every `advanceWorkflow()` writes exactly one step_execution for one node/token, then the token moves. | `workflow_instances` is a rebuildable projection. `rebuild_instance_projection(instance_id)` must produce identical `active_tokens` + `current_nodes` from step_executions + compiled DAG. CI test: advance 10 steps, rebuild projection, compare to live projection — must match.                                                 |
| **WF-16** | **Join idempotency**. Parallel join nodes (ALL/ANY) must not double-fire when concurrent tokens arrive simultaneously. A join-level receipt prevents "two tokens both think they are the winner".                                                                                                                                                                                                                  | `join_idempotency_key = sha256(instance_id + join_node_id + entity_version + join_epoch)`. Stored in `workflow_step_receipts`. ON CONFLICT DO NOTHING = second token skips join dispatch. For ANY-join, first receipt wins; losers get `cancelled` step rows. CI test: simulate concurrent token arrival → exactly one join fires. |

---

## Why NOT n8n / Camunda / Temporal

| Engine                     | Strength                             | Why wrong for afenda                                                                                                      |
| -------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **n8n**                    | Integration automation (Zapier-like) | Doesn't understand doc lifecycle, multi-tenancy, or ERP audit trails. Impedance mismatch on every node.                   |
| **Camunda**                | Enterprise BPMN process modeling     | Requires separate Zeebe engine + BPMN XML. Massive infra overhead for a SaaS. Doesn't share your DB/RLS/audit.            |
| **Temporal**               | Durable long-running code workflows  | Requires separate Temporal server + worker fleet. Overkill when your workflows are document-centric, not compute-centric. |
| **ERP-native (this plan)** | Workflow lives with the data         | Same DB, same RLS, same `mutate()` kernel, same audit trail. Zero impedance mismatch.                                     |

**The decisive factor:** afenda's `mutate()` kernel is the single write path (K-01). Any external workflow engine would either bypass it (breaking invariants) or awkwardly call back into it (adding latency + failure modes). Building natively means every workflow step is a first-class mutation with full audit + versioning + policy + lifecycle enforcement.

**n8n's real value** (integration connectors) can be captured later via `webhook_out` nodes — fire outbound HTTP to n8n/Make/Zapier for external integrations, while keeping core ERP flow in-house.

---

## Workflow vs CRUD-SAP Boundary

The workflow engine and CRUD-SAP kernel have **distinct responsibilities**. Do not attempt to derive workflow definitions from runtime mutate traces.

### Responsibility Split

| System                    | Responsibility                                                            | Analogy                                               |
| ------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| **CRUD-SAP (`mutate()`)** | Authoritative write path + audit (9W1H) + versioning + policy enforcement | The **skeleton** — immutable envelope + event emitter |
| **Workflow engine**       | Authoritative "what should happen next" + "what is allowed now"           | The **orchestrator** — consumes events, enforces flow |

### Why NOT "derive from mutate"

Attempting to infer workflow state purely from mutation history fails because:

- Can't represent **future intent** (what should happen next) — only what already happened
- Can't enforce **edit windows / stable regions** before mutations happen
- Can't do **wait states, approvals, parallel joins** from observation alone
- Re-implements a hidden definition anyway (in code paths + rule checks), harder to audit

### The Clean Pattern

1. **Envelope is generated once** from `EntityContract.lifecycleTransitions` → stored as `workflow_definitions` row (`is_default=true`) with stable `sys:*` IDs + declared `BodySlot[]` → compiled on publish
2. **Org customization is slot-scoped** — org definitions provide `SlotGraphPatch` per slot, referencing `baseRef.envelopeVersion`. Compile merges envelope + patches into Effective Workflow (WF-06, WF-07)
3. **`mutate()` emits trigger events** via outbox — `on_create`, `on_lifecycle_transition`, `on_mutation` — workflow consumes and decides next steps
4. **Body steps orchestrate additional `mutate()` calls** via `MutationSpecRef` — each step is a first-class `workflow_step_execution` row (WF-09), not a hidden post-hook

### Avoiding "Double Maintenance"

| Concern                                                           | Solution                                                                                                                           |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Lifecycle spec AND workflow definition are two things to maintain | Envelope is **generated from Canon** — not human-authored. Single source: `EntityContract`.                                        |
| System gates AND org customizations might conflict                | Envelope has stable `sys:*` IDs. Org edits only target declared body slots (WF-06). `compileEffective()` merges deterministically. |
| Workflow steps might bypass CRUD-SAP                              | Every `action` node calls `mutate()` via `MutationSpecRef` — gets full 9W1H, policy, audit. No bypass possible (K-01, WF-09).      |

### Mutation Classes

Two distinct mutation families, both through `mutate()`, both with full 9W1H:

| Class                  | Examples                                                                | Notes                                                                                                          |
| ---------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Business mutations** | `invoice.create`, `invoice.update`, `invoice.post`, `inventory.reserve` | Domain data writes — the core ERP operations                                                                   |
| **Workflow mutations** | `workflow.approval_decide`, `workflow.advance`, `workflow.cancel_token` | Workflow state writes — can be rate-limited separately, restricted to workflow actors, tables kept append-only |

### Where Runtime Derivation IS Useful

| ✅ Good (triggering + evidence)                | ❌ Bad (definition inference)                        |
| ---------------------------------------------- | ---------------------------------------------------- |
| Start instance on create                       | Infer workflow graph from mutation sequence          |
| Advance gate when lifecycle transition happens | Derive "what should happen next" from past mutations |
| Detect edit during amend_only region           | Reconstruct approval requirements from audit logs    |
| Record step evidence / timings                 |                                                      |
| Rebuild projection from step executions        |                                                      |

---

## Architecture: Envelope + Body Slots = Effective Workflow

### Terms

| Term                   | Definition                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **Envelope**           | System nodes + system edges derived from Canon lifecycle. Immutable. Stable IDs (`sys:*`). |
| **Body Slot**          | A named region between two system gates where org-custom steps can be inserted.            |
| **Slot Graph Patch**   | Org-authored nodes/edges that fill a specific body slot. Scoped by construction (WF-06).   |
| **Effective Workflow** | The compiled DAG the engine runs = Envelope + merged Body Patches. Pinned to instances.    |

**Key principle:** the engine **never** runs raw body JSON. It runs **Compiled Effective Workflow** produced by `compileEffective(envelope, bodyPatches)`.

### System Envelope (generated from Canon, stable IDs)

For every entity type, generate an envelope definition from `EntityContract.lifecycleTransitions`:

**System nodes** (stable IDs, `sys:*` prefix):

```
sys:start
sys:state:draft          (editWindow: editable)
sys:gate:submit          (editWindow: amend_only)
sys:state:submitted      (editWindow: amend_only)
sys:gate:approve         (editWindow: amend_only)
sys:state:active         (editWindow: locked)
sys:gate:cancel
sys:state:cancelled
sys:state:amended
sys:end
```

**System edges** (derived from lifecycle transitions):

```
sys:start → sys:state:draft
sys:state:draft → sys:gate:submit → sys:state:submitted
sys:state:submitted → sys:gate:approve → sys:state:active
sys:state:active → sys:end
sys:gate:approve [reject] → sys:state:draft
```

**Storage:** Stored once as `workflow_definitions` row with `is_default=true, status='published'`. Hashed for diff/audit. DB trigger prevents edits to `is_default=true` rows.

### Body Slots (where org customization lives)

A body slot is a named region between two system nodes where custom steps can be inserted:

```typescript
interface BodySlot {
  slotId: string; // e.g. 'slot:submitted_to_approved'
  entryNodeId: string; // system node (e.g. 'sys:state:submitted')
  exitNodeId: string; // system node (e.g. 'sys:gate:approve')
  defaultEditWindow: 'editable' | 'locked' | 'amend_only';
  stableRegion: boolean; // if true, version drift → amendment (WF-05)
}
```

Example slots for a standard invoice workflow:

| Slot ID                      | Entry → Exit                               | Default Edit Window | Stable Region |
| ---------------------------- | ------------------------------------------ | ------------------- | ------------- |
| `slot:draft_to_submit`       | `sys:state:draft` → `sys:gate:submit`      | `editable`          | no            |
| `slot:submitted_to_approved` | `sys:state:submitted` → `sys:gate:approve` | `amend_only`        | **yes**       |
| `slot:approved_to_active`    | `sys:gate:approve` → `sys:state:active`    | `locked`            | no            |
| `slot:amendment_cycle`       | `sys:state:amended` → `sys:gate:submit`    | `editable`          | no            |

### Org Definition Format: Slot Graph Patches

Org definitions don't edit the whole DAG — they provide **patches per slot**:

```typescript
interface OrgWorkflowDefinition {
  baseRef: {
    entityType: string;
    envelopeVersion: number; // pins to specific envelope version
  };
  slots: Record<string, SlotGraphPatch>; // slotId → patch
}

interface SlotGraphPatch {
  nodes: WorkflowNode[]; // custom nodes (IDs: usr:<slotId>:<uuid>)
  edges: WorkflowEdge[]; // custom edges (within slot scope only)
  entryEdgeMode: 'serial' | 'branch'; // how patch attaches to envelope entry
  exitEdgeMode: 'single' | 'join'; // how patch returns to envelope exit
  editWindowOverride?: 'editable' | 'locked' | 'amend_only'; // can only be stricter, not looser
}
```

This prevents users from breaking envelope integrity **by construction** (WF-06).

### Merge Algorithm: `compileEffective(envelope, bodyPatches)`

Deterministic, compile-time merge:

```
Input:  envelope (generated/stored), bodyPatches (org), invariants (WF-01…WF-09)
Output: effective.nodes[], effective.edges[], compiled_json (adjacency, joins, editWindows, stableRegions, hash)

For each slot with a patch:
  1. VALIDATE patch scope (WF-06)
     - Every custom node id must match usr:<slotId>:<uuid>
     - Every custom edge must stay within slot nodes + attachment points
  2. CREATE attachment nodes
     - sys:slot:<slotId>:in  (internal proxy)
     - sys:slot:<slotId>:out (internal proxy)
  3. REPLACE envelope direct edge (entry → exit) with:
     - entry → sys:slot:<slotId>:in
     - sys:slot:<slotId>:in → usr:<slotStart>
     - usr:<slotEnd> → sys:slot:<slotId>:out
     - sys:slot:<slotId>:out → exit
  4. PROPAGATE edit windows
     - Slot inherits default from envelope region
     - Override only allowed if stricter (editable → amend_only ✅, amend_only → editable ❌)
  5. TAG stable regions (WF-05)
     - If slot sits in stable region, all nodes in that slot trigger amend_only logic

Final step: VERIFY system gate integrity (WF-08)
  - All sys:* nodes present and in correct topological order
  - compile fails if missing/altered

Output: compiled_json + compiled_hash (SHA-256)
```

### Edit Windows (policy-driven document editability per workflow region)

Each workflow region declares an **edit policy** controlling what happens when a document is modified at that position:

| Edit Window  | Behavior                                                                | Typical Region               |
| ------------ | ----------------------------------------------------------------------- | ---------------------------- |
| `editable`   | Edits allowed, version increments, workflow continues on same path      | Draft                        |
| `locked`     | Edits forbidden → hard error `WORKFLOW_EDIT_LOCKED`                     | Active/Posted                |
| `amend_only` | Edits allowed but auto-route to `amended` branch + re-approval required | Submitted + Pending Approval |

**Enforcement (CRUD-SAP precondition — not workflow-dependent):**

Edit windows are enforced **inside `mutate()` itself** as a precondition hook, not by the workflow engine. This is critical: if the workflow engine is down, users must still be unable to edit `locked` documents.

1. `mutate()` loads the active `workflow_instance` for the entity (cheap: single indexed lookup)
2. Resolves current node position → looks up `compiled.editWindows[currentNodeId]`
3. If `locked` → **hard reject** with `WORKFLOW_EDIT_LOCKED` (before any handler runs)
4. If `amend_only` → allow write, but **force** amendment outbox event in same TX (triggers re-approval)
5. If `editable` or no active instance → proceed normally

This keeps CRUD-SAP as the **truth boundary** for editability. Workflow only decides _what happens after_ the edit.

**Stable region is slot-driven, compiler-expanded:** The `stableRegion: boolean` flag on `BodySlot` is the **source of truth** for version drift detection (WF-05). The compiler expands slot-level `stableRegion` into `compiled.stableRegionNodes: Set<string>` — the set of all node IDs within stable-region slots. At runtime, `mutate()` edit-window hook reads `compiled.editWindows[currentNodeId]` for edit policy and `compiled.stableRegionNodes` for version drift routing. No inference needed — it's a precomputed lookup.

**Override rule:** Org slot patches can make edit windows **stricter** (editable → amend_only), never **looser** (amend_only → editable).

**Amendment contract (B4):** Amendments follow the transactional spine philosophy:

- **Amendment = new entity row** — new `entity_id` with `amended_from_id` FK pointing to the original document
- Old workflow instance transitions to `cancelled` with `context_json.cancel_reason = 'amended'`
- New instance starts naturally for the new entity row (partial UNIQUE permits this)
- This avoids "same document, multiple active instances" ambiguity
- Aligns with posting contract: posted documents are immutable; amendments create new rows

### What users can customize (within slots)

1. **Add steps** — insert "Manager Review", "Budget Check" in `slot:submitted_to_approved`
2. **Add branches** — "if amount > 10K → CFO approval, else → auto-approve" inside a slot
3. **Add parallel paths** — simultaneously "Notify Warehouse" AND "Reserve Inventory" inside a slot
4. **Add wait states** — "Wait 24h for counter-party confirmation" inside a slot
5. **Add webhooks** — "POST to accounting system when approved" inside a slot
6. **Tighten edit windows** — make a slot stricter than envelope default

### What users CANNOT do

- Edit anything outside declared body slots (WF-06: slot-scoped patches)
- Remove or reorder system nodes (WF-08: envelope integrity)
- Target `sys:*` nodes except via slot attachment points (WF-06)
- Run uncompiled definitions (WF-07: effective workflow always compiled)
- Skip the `mutate()` kernel (K-01)
- Bypass RLS/policy (every step runs as the actor, unless explicitly `runAs: 'system'` with evidence)
- Approve a stale document version (WF-03: version-pin enforcement)
- Loosen edit windows (override can only be stricter)
- Mutate a published definition (WF-04: DB trigger enforced)
- Write arbitrary JS in conditions (DSL only — see § Typed DSL)

### Versioning and Pinning (no drift)

| Layer                  | Versioning                                            | Pinning                                                                   |
| ---------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| **Envelope**           | Own version derived from Canon lifecycle spec version | Org definition references `envelopeVersion` in `baseRef`                  |
| **Org body**           | Own version per org + entity_type                     | Published = frozen (WF-04)                                                |
| **Effective compiled** | New immutable version on each publish                 | Instances pin to `effective_definition_id + effective_definition_version` |
| **Entity**             | `entity_version` incremented on each mutation         | Each approval step pins to specific `entity_version` (WF-03)              |

---

## Data Model (Neon Postgres, 1M+ doc scale)

### New Tables

```sql
-- ═══════════════════════════════════════════════════════════════════
-- Workflow definitions: envelope (default) OR org body (slot patches)
-- ═══════════════════════════════════════════════════════════════════
workflow_definitions
  id UUID PK
  org_id TEXT NOT NULL                    -- RLS
  entity_type TEXT NOT NULL
  name TEXT NOT NULL
  version INTEGER NOT NULL DEFAULT 1      -- monotonic per org+entity_type
  status TEXT NOT NULL DEFAULT 'draft'    -- draft | published | archived
  is_default BOOLEAN NOT NULL DEFAULT false  -- true = system envelope (immutable, generated from Canon)
  definition_kind TEXT NOT NULL           -- 'envelope' | 'org_patch' | 'effective'
  CHECK (definition_kind IN ('envelope', 'org_patch', 'effective'))

  -- Envelope definitions (definition_kind='envelope'): full DAG
  nodes_json JSONB                       -- WorkflowNode[] (required for envelope + effective, NULL for org_patch)
  edges_json JSONB                       -- WorkflowEdge[] (required for envelope + effective, NULL for org_patch)
  slots_json JSONB                       -- BodySlot[] — declared slots (envelope only)

  -- Org body definitions (definition_kind='org_patch'): slot graph patches + base reference
  base_ref JSONB                         -- { entityType, envelopeVersion } — pins to specific envelope version (org_patch only)
  body_patches_json JSONB                -- Record<slotId, SlotGraphPatch> — org customizations per slot (org_patch only)

  -- Compiled effective workflow (definition_kind='effective', produced by compileEffective)
  compiled_json JSONB                    -- effective adjacency maps, topo order, join requirements, edit windows, stable regions
  compiled_hash TEXT                     -- SHA-256 of compiled artifact (WF-07: must match recomputation)
  compiler_version TEXT                  -- semver of compileEffective() — detect stale compilations on upgrade

  -- CHECK constraints per definition_kind:
  -- envelope:   is_default=true, nodes_json IS NOT NULL, edges_json IS NOT NULL, slots_json IS NOT NULL, body_patches_json IS NULL
  -- org_patch:  is_default=false, body_patches_json IS NOT NULL, base_ref IS NOT NULL, nodes_json IS NULL, edges_json IS NULL
  -- effective:  compiled_json IS NOT NULL, compiled_hash IS NOT NULL, nodes_json IS NOT NULL, edges_json IS NOT NULL

  created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
  -- TRIGGER: reject_published_definition_mutation() — prevents content mutations when status='published' (WF-04)
  -- TRIGGER: reject_default_definition_mutation() — prevents ANY edits to is_default=true rows

-- ═══════════════════════════════════════════════════════════════════
-- Runtime execution state (PROJECTION — rebuildable from step_executions)
-- ═══════════════════════════════════════════════════════════════════
workflow_instances
  id UUID PK
  org_id TEXT NOT NULL                    -- RLS
  definition_id UUID NOT NULL            -- pinned to specific definition version
  definition_version INTEGER NOT NULL    -- frozen at instance creation time
  entity_type TEXT NOT NULL
  entity_id UUID NOT NULL
  entity_version INTEGER NOT NULL        -- document version at workflow start
  active_tokens JSONB NOT NULL DEFAULT '[]'  -- Token[] execution threads
  current_nodes TEXT[] NOT NULL DEFAULT '{}'  -- cache of active node IDs (derived, optional)
  status TEXT NOT NULL DEFAULT 'running'  -- running | paused | completed | failed | cancelled
  started_at TIMESTAMPTZ NOT NULL
  completed_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ NOT NULL
  last_step_execution_id UUID            -- monotonic cursor for projection rebuild
  context_json JSONB DEFAULT '{}'        -- accumulated workflow variables

-- ═══════════════════════════════════════════════════════════════════
-- Per-step audit trail (SOURCE OF TRUTH — controlled updates only)
-- ═══════════════════════════════════════════════════════════════════
workflow_step_executions                    -- PARTITIONED BY RANGE (created_at)
  id UUID NOT NULL                       -- NOT a standalone PK (partition constraint)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()  -- PARTITION KEY (monthly range)
  PRIMARY KEY (created_at, id)           -- Postgres requires partition key in PK
  org_id TEXT NOT NULL                    -- RLS
  instance_id UUID NOT NULL
  node_id TEXT NOT NULL                  -- references node in definition
  node_type TEXT NOT NULL
  token_id TEXT NOT NULL                 -- execution thread (for parallel)
  entity_version INTEGER NOT NULL        -- document version at step execution
  status TEXT NOT NULL DEFAULT 'pending'  -- pending | running | completed | failed | skipped | cancelled
  run_as TEXT NOT NULL DEFAULT 'actor'   -- actor | system | service_account
  idempotency_key TEXT NOT NULL          -- sha256(instance_id + node_id + token_id + entity_version) (WF-02)
  started_at TIMESTAMPTZ
  completed_at TIMESTAMPTZ
  duration_ms INTEGER
  input_json JSONB
  output_json JSONB                     -- includes DSL expression text + evaluated result + chosen_edge_ids for audit
  error TEXT
  actor_user_id TEXT
  approval_request_id UUID              -- for approval: FK to approval_requests.id (authority lives in approval_* tables)
  applied BOOLEAN                       -- for approval: true when consumed by a gate (WF-03)
  snapshot_version_id UUID              -- for approval: FK to entity_versions.id (DEFERRABLE INITIALLY DEFERRED)
  -- NOTE: decision + reason live in approval_decisions table (single source of truth). Step stores reference + consumed evidence only.
  resume_at TIMESTAMPTZ                  -- for wait_timer nodes
  waiting_for_event_key TEXT             -- for wait_event nodes
  -- NOTE: entity_versions.id is a stable UUID PK. FK is DEFERRABLE for cases where both rows are inserted in one TX.
  -- TRIGGER: restrict_step_execution_updates()
  --   Mutable columns (UPDATE allowed): status, started_at, completed_at, duration_ms,
  --     output_json, error, approval_request_id, applied, resume_at, waiting_for_event_key
  --   Immutable columns (trigger rejects UPDATE): id, org_id, instance_id, node_id, node_type,
  --     token_id, entity_version, run_as, idempotency_key, created_at, input_json,
  --     actor_user_id, snapshot_version_id
  -- REVOKE UPDATE, DELETE ON workflow_step_executions FROM authenticated
  --   (DELETE/TRUNCATE blocked at role level, same as audit_logs)

-- ═══════════════════════════════════════════════════════════════════
-- Engine trigger outbox (advance/create/resume — consumed by workflow worker)
-- ═══════════════════════════════════════════════════════════════════
workflow_events_outbox                    -- PARTITIONED BY RANGE (created_at)
  id UUID NOT NULL
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()  -- PARTITION KEY (monthly range)
  PRIMARY KEY (created_at, id)           -- Postgres requires partition key in PK
  org_id TEXT NOT NULL
  instance_id UUID NOT NULL
  entity_version INTEGER NOT NULL        -- document version when event was emitted (part of WF-11 idempotency key)
  definition_version INTEGER             -- present on 'create_instance' events; NULL for 'advance' events
  event_type TEXT NOT NULL               -- trigger type (see § Workflow Triggers)
  payload_json JSONB NOT NULL DEFAULT '{}'
  event_idempotency_key TEXT NOT NULL    -- sha256(instance_id + event_type + canonicalJsonHash(payload_json) + entity_version) (WF-11)
  trace_id TEXT                           -- OpenTelemetry trace ID propagated from mutate() → outbox → worker → step (debugging at scale)
  status TEXT NOT NULL DEFAULT 'pending'  -- pending | processing | completed | failed | dead_letter
  attempts INTEGER NOT NULL DEFAULT 0
  max_attempts INTEGER NOT NULL DEFAULT 5
  next_retry_at TIMESTAMPTZ
  completed_at TIMESTAMPTZ
  error TEXT

-- ═══════════════════════════════════════════════════════════════════
-- Side-effect outbox (HTTP, email, SMS, integrations — consumed by IO worker) (WF-10)
-- ═══════════════════════════════════════════════════════════════════
workflow_side_effects_outbox              -- PARTITIONED BY RANGE (created_at)
  id UUID NOT NULL
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()  -- PARTITION KEY (monthly range)
  PRIMARY KEY (created_at, id)           -- Postgres requires partition key in PK
  org_id TEXT NOT NULL
  instance_id UUID NOT NULL
  step_execution_id UUID NOT NULL        -- which step triggered this side effect
  effect_type TEXT NOT NULL              -- webhook | email | sms | integration
  payload_json JSONB NOT NULL DEFAULT '{}'
  event_idempotency_key TEXT NOT NULL    -- sha256(step_execution_id + effect_type + canonicalJsonHash(payload_json)) (WF-11)
  trace_id TEXT                           -- OpenTelemetry trace ID propagated from engine → side-effect worker (debugging at scale)
  status TEXT NOT NULL DEFAULT 'pending'  -- pending | processing | completed | failed | dead_letter
  attempts INTEGER NOT NULL DEFAULT 0
  max_attempts INTEGER NOT NULL DEFAULT 5
  next_retry_at TIMESTAMPTZ
  completed_at TIMESTAMPTZ
  error TEXT
  response_json JSONB                    -- evidence: HTTP status, response body, etc.
```

**Why two outboxes?** Different retry policies (engine retries aggressively, side effects use exponential backoff), different DLQ handling (engine DLQ = ops alarm, side effect DLQ = retry later), different security policies (engine = internal, side effects = external network), and separate ops dashboards.

```sql
-- ═══════════════════════════════════════════════════════════════════
-- Dedup receipts (NON-PARTITIONED — global uniqueness for WF-02)
-- Postgres UNIQUE on partitioned tables requires the partition key in the constraint,
-- which breaks exactly-once semantics. This small, hot table enforces global dedup.
-- ═══════════════════════════════════════════════════════════════════
workflow_step_receipts
  org_id TEXT NOT NULL                     -- RLS (same org_id policy as all tables)
  instance_id UUID NOT NULL
  idempotency_key TEXT NOT NULL
  step_execution_id UUID NOT NULL         -- plain column for joins (NO FK — cross-partition FK unreliable)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  PRIMARY KEY (org_id, instance_id, idempotency_key)
  -- RLS: USING (org_id = auth.org_id())
  -- REVOKE UPDATE, DELETE ON workflow_step_receipts FROM authenticated (append-only)
  -- INSERT allowed only by service role / worker role

-- ═══════════════════════════════════════════════════════════════════
-- Outbox dedup receipts (NON-PARTITIONED — global uniqueness for WF-11)
-- Same rationale: outbox tables are time-partitioned, so UNIQUE constraints
-- would be per-partition only. This table enforces global event dedup.
-- ═══════════════════════════════════════════════════════════════════
workflow_outbox_receipts
  org_id TEXT NOT NULL                     -- RLS (same org_id policy as all tables)
  instance_id UUID NOT NULL
  event_idempotency_key TEXT NOT NULL
  source_table TEXT NOT NULL              -- 'events' | 'side_effects'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  PRIMARY KEY (org_id, instance_id, source_table, event_idempotency_key)  -- source_table in PK prevents collision between engine + side-effect keys
  -- RLS: USING (org_id = auth.org_id())
  -- REVOKE UPDATE, DELETE ON workflow_outbox_receipts FROM authenticated (append-only)
  -- INSERT allowed only by service role / worker role
```

**Why separate receipts tables?** Postgres partitioned tables cannot enforce cross-partition UNIQUE constraints. These small, non-partitioned tables act as the global dedup authority. The partitioned data tables store the full payload/evidence. Both writes happen in the same TX — receipt INSERT with ON CONFLICT DO NOTHING is the dedup gate; data INSERT follows only if the receipt succeeded.

### Indexes (1M invoice scale)

```sql
-- workflow_definitions
UNIQUE (org_id, entity_type, version)
(org_id, entity_type, status)            -- "find published workflow for this entity"

-- workflow_instances
UNIQUE (org_id, entity_type, entity_id) WHERE status IN ('running', 'paused')  -- one ACTIVE workflow per document; completed/cancelled preserved for history + new runs allowed
(org_id, entity_type, entity_id)         -- supporting btree for partial UNIQUE (Postgres needs it for fast lookups even when partial index exists)
(org_id, status, updated_at)             -- "my running/paused flows"
(org_id, definition_id)                  -- "all instances of this workflow"

-- workflow_step_executions (partitioned by created_at)
-- NOTE: WF-02 exactly-once enforced by workflow_step_receipts PK (non-partitioned), NOT here
(org_id, instance_id, created_at)        -- step timeline for a document (partition-aligned)
(org_id, actor_user_id, status)          -- approval inbox query
(org_id, instance_id, node_id, status)   -- "is this step already done?"
(org_id, snapshot_version_id) WHERE snapshot_version_id IS NOT NULL  -- approval snapshot lookups
(org_id, resume_at) WHERE resume_at IS NOT NULL AND status = 'pending'  -- resume scheduler
(org_id, waiting_for_event_key) WHERE status = 'pending' AND waiting_for_event_key IS NOT NULL  -- webhook/event resume lookup

-- workflow_step_receipts (non-partitioned — WF-02 global dedup)
-- PK (org_id, instance_id, idempotency_key) — defined in table DDL above

-- workflow_events_outbox (partitioned by created_at)
-- NOTE: WF-11 dedup enforced by workflow_outbox_receipts PK (non-partitioned), NOT here
(status, next_retry_at, created_at) WHERE status IN ('pending', 'failed')  -- compound index for worker poll ORDER BY created_at
(org_id, instance_id)                    -- "events for this instance"

-- workflow_side_effects_outbox (partitioned by created_at)
-- NOTE: WF-11 dedup enforced by workflow_outbox_receipts PK (non-partitioned), NOT here
(status, next_retry_at, created_at) WHERE status IN ('pending', 'failed')  -- compound index for IO worker poll ORDER BY created_at
(org_id, instance_id)                    -- "side effects for this instance"
(org_id, step_execution_id)             -- "side effects for this step"

-- workflow_outbox_receipts (non-partitioned — WF-11 global dedup)
-- PK (org_id, instance_id, event_idempotency_key) — defined in table DDL above
```

### Partition Strategy (1M+ scale on Neon Postgres)

At 1M documents, `workflow_step_executions` and `workflow_events_outbox` will grow fast. Partition early.

| Table                          | Strategy                        | Key          | Retention                                                                              |
| ------------------------------ | ------------------------------- | ------------ | -------------------------------------------------------------------------------------- |
| `workflow_step_executions`     | Range by `created_at` (monthly) | `created_at` | Full evidence retained; old `output_json` compressed after 12 months                   |
| `workflow_events_outbox`       | Range by `created_at` (monthly) | `created_at` | Completed rows pruned after 90 days; `dead_letter` rows retained indefinitely          |
| `workflow_side_effects_outbox` | Range by `created_at` (monthly) | `created_at` | Completed rows pruned after 90 days; `dead_letter` rows retained indefinitely          |
| `workflow_instances`           | No partition needed             | —            | Active count stays manageable (~1-5x entity count)                                     |
| `workflow_definitions`         | No partition needed             | —            | Low cardinality (entity_types × orgs × versions)                                       |
| `workflow_step_receipts`       | No partition needed             | —            | Small, hot dedup table (~1 row per step). Prunable by joining to completed instances.  |
| `workflow_outbox_receipts`     | No partition needed             | —            | Small, hot dedup table (~1 row per event). Prunable by joining to completed instances. |

**Implementation:** Create partitions in migration (or via `pg_partman` if available). Partition-aware indexes automatically scoped. Neon supports standard Postgres RANGE partitioning.

**Partition creation pattern:**

```sql
CREATE TABLE workflow_step_executions (
  -- columns as above
  -- PRIMARY KEY (created_at, id)  ← partition key MUST be in PK
) PARTITION BY RANGE (created_at);

-- Create monthly partitions (initial + future via cron or migration)
CREATE TABLE workflow_step_executions_2026_01
  PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

**Receipts pruning job:** Non-partitioned receipts tables become hot at scale. Keep rows tiny (no JSON). Add a periodic pruning job:

- Delete receipts for instances where `workflow_instances.status IN ('completed', 'cancelled')` AND `workflow_instances.completed_at < now() - interval 'N days'` (configurable, default 90 days).
- Safe because: completed instances will never re-run the same idempotency key. If an instance is re-opened (admin override), it gets a new entity_version → new idempotency keys.
- Run as a low-priority background job (e.g., weekly via pg_cron or Graphile Worker scheduled task).

**Compiled workflow cache:** The runtime hot path must not repeatedly load large `compiled_json` blobs from DB.

- Cache compiled workflow by `(definition_id, version)` in memory with TTL (same pattern as existing `workflow_rules` TTL cache in `db-loader.ts`).
- Invalidation: TTL-based (e.g., 5 minutes). `compiled_hash` verification on load catches stale cache entries.
- Optional: store a small `compiled_header` column (node count, edge count, topologicalOrder length, slot map hash) for quick sanity checks without reading full JSON.

---

### Node Types (canon enum)

```typescript
const WORKFLOW_NODE_TYPES = [
  // System (lifecycle-derived, immutable)
  'start', // entry point (create)
  'end', // terminal state
  'lifecycle_gate', // enforces state transition (submit, approve, etc.)
  'policy_gate', // enforces mutate() policy check (mandatory for action nodes)

  // User-customizable
  'action', // calls mutate() with predefined spec
  'approval', // creates approval request, version-pinned + consumptive (WF-03)
  'condition', // evaluates typed DSL expression, branches to different edges
  'parallel_split', // fork into parallel paths (spawns tokens)
  'parallel_join', // ALL: wait for every token; ANY: first wins, losers cancelled (see § Parallel)
  'wait_timer', // pause for duration or until datetime
  'wait_event', // pause until external event (webhook inbound, keyed)
  'webhook_out', // fire HTTP POST to external system
  'notification', // send email/SMS/in-app notification
  'script', // execute typed DSL expression (see § Typed DSL — not JS)
  'rule', // evaluate existing WorkflowRule (bridge to V1)
] as const;
```

### Edge Model

```typescript
interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string; // "approved", "rejected", "amount > 10K"
  condition?: ConditionJson; // reuses existing interpreter conditions
  priority?: number; // for ordered evaluation of multiple outgoing edges
}
```

### Compiled Effective Workflow (publish-time artifact)

When a definition is published, `compileEffective()` merges envelope + body patches and stores the result:

```typescript
interface CompiledWorkflow {
  // Edge-first adjacency (preserves edge identity for audit + deterministic evaluation)
  adjacency: Record<string, string[]>; // nodeId → outgoing edgeId[]
  reverseAdjacency: Record<string, string[]>; // nodeId → incoming edgeId[]
  edgesById: Record<
    string,
    {
      id: string;
      source: string;
      target: string;
      priority: number; // deterministic eval order (lower = first)
      condition?: ConditionJson;
      label?: string; // "approved", "rejected", "amount > 10K"
      provenance: 'envelope' | string; // 'envelope' for system edges, slotId for slot-contributed edges (diff view + audit)
    }
  >;
  topologicalOrder: string[]; // deterministic execution order (WF-13)

  // Parallel join semantics
  joinRequirements: Record<
    string,
    {
      requiredTokenCount: number;
      mode: 'all' | 'any'; // ANY cancels losing tokens (see § Parallel)
    }
  >;

  // Edit windows + stable regions
  editWindows: Record<string, 'editable' | 'locked' | 'amend_only'>; // per-node edit policy
  stableRegionNodes: string[]; // nodes where version drift → amendment (WF-05)

  // Slot provenance (for diff view + audit)
  slotMap: Record<string, string>; // nodeId → slotId (which slot owns this node)

  // System gate integrity proof (WF-08)
  systemGateIntegrity: {
    requiredGates: string[];
    presentGates: string[];
    valid: boolean;
  };

  // Provenance + recompile guard
  envelopeVersion: number; // Canon envelope version used
  compilerVersion: string; // semver of compileEffective() — detect stale compilations on upgrade
  hash: string; // SHA-256 of the above
}
```

Runtime is **O(1) lookup** (pre-computed adjacency), **deterministic** (compiled once), **verifiable** (SHA-256 hash). Engine refuses to run if `compiled_hash` doesn't match recomputation (WF-07).

### MutationSpecRef (how action nodes call mutate)

Each `action` node references a mutation spec — the workflow never writes tables directly (WF-09):

```typescript
interface MutationSpecRef {
  actionType: string; // e.g. 'invoice.reserve_inventory'
  payloadTemplate: Record<string, DslExpression>; // DSL mapping from entity/context/actor
  runAs: 'actor' | 'system' | 'service_account';
}
```

The node handler calls `mutate()` with the resolved spec and records the receipt in `output_json`.

---

## Workflow Triggers + Event Outbox

### Trigger Types

Workflow instances are created and advanced by explicit trigger events:

| Trigger                             | When                              | Example                                                  |
| ----------------------------------- | --------------------------------- | -------------------------------------------------------- |
| `on_create(entity_type)`            | New entity created via `mutate()` | Invoice created → start workflow instance                |
| `on_lifecycle_transition(from, to)` | Doc status changes                | Draft → Submitted triggers Submit gate                   |
| `on_mutation(action_type)`          | Specific mutation fires           | `invoice.update` while in approval → version drift check |
| `on_timer(resume_at)`               | Timer expires                     | 24h wait for counter-party confirmation                  |
| `on_event(event_key)`               | External event arrives            | `delivery:pod:{shipmentId}` webhook                      |
| `manual(actor)`                     | User clicks "Advance" or "Retry"  | Re-try failed step, manually advance                     |

### Event Outbox Pattern (decouple from request latency)

At 1M+ scale, workflow orchestration **must not** live inside request latency:

```
mutate() TX:
  ├── entity write
  ├── audit_log write
  ├── entity_version write
  └── workflow_events_outbox INSERT  ← same TX, guaranteed delivery

Background Worker (Graphile Worker / pg_cron):
  ├── SELECT FROM outbox WHERE status='pending' ORDER BY created_at LIMIT 100
  ├── pg_advisory_xact_lock(hashtext(instance_id))  ← WF-01
  ├── advanceWorkflow(...)
  └── UPDATE outbox SET status='completed'
```

Benefits: retry + dead-letter queue + rate limiting + zero request latency impact.

**Edge case — outbox stuck?** Worker marks `status='failed'` after `max_attempts`. Ops can manually retry or route to `dead_letter`. Dashboard shows outbox health.

---

## Runtime Engine: Event-Sourced + Resumable

### Design Principle: Step Executions are the Source of Truth

`workflow_step_executions` is the authoritative record with **controlled updates** — identity columns (instance_id, node_id, token_id, entity_version, idempotency_key, actor_user_id, snapshot_version_id) are immutable after INSERT, enforced by `restrict_step_execution_updates()` trigger. Only status/output/evidence columns may be updated. DELETE/TRUNCATE revoked at role level (same as `audit_logs`). `workflow_instances` is a **projection** (rebuildable). If the projection ever corrupts, it can be reconstructed from step execution history. This is critical for trust and debugging in an ERP context.

### Strict State Machine per Step

```
pending → running → completed | failed | skipped | cancelled
```

- `cancelled` is used when an ANY-join winner kills losing parallel branches
- Status transitions are in-place UPDATEs (trigger-guarded). Identity columns (instance_id, node_id, token_id, entity_version, idempotency_key) are immutable after INSERT.

**Valid status transitions (enforced by `restrict_status_regression()` trigger):**

| Table                          | Valid Transitions                                                                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workflow_instances`           | `running → paused, completed, failed, cancelled` · `paused → running, cancelled` · terminal states are final                                       |
| `workflow_step_executions`     | `pending → running → completed \| failed \| skipped \| cancelled` · terminal states are final                                                      |
| `workflow_events_outbox`       | `pending → processing → completed \| failed` · `failed → pending` (retry) · `failed → dead_letter` · `dead_letter → pending` (admin override only) |
| `workflow_side_effects_outbox` | same as events outbox                                                                                                                              |

### Core Loop: `advanceWorkflow(instanceId, completedNodeId, tokenId, output)`

```
0. pg_advisory_xact_lock(hashtextextended(instance_id::text, 0))  ← WF-01: single writer (Postgres-native 64-bit)
1. Load instance + compiled definition (by pinned definition_id + version)
2. Verify compiled_hash matches (WF-07)
3. Compute idempotency_key = sha256(instance_id + node_id + token_id + entity_version)  ← WF-02
   ── WF-14: RECEIPT-FIRST GATE (steps 4-7 are strict ordering — no handler runs before receipt succeeds) ──
4. INSERT INTO workflow_step_receipts ON CONFLICT DO NOTHING   ← global dedup (non-partitioned)
5. If INSERT was no-op → return (idempotent skip)
6. INSERT step_execution row (partitioned table, same TX)
7. Verify entity version: check stable region (WF-05)
   ── WF-14 GATE PASSED — handler dispatch now permitted ──
8. DISPATCH handler (see § Handler Atomicity Rule below)
9. Resolve outgoing edgeIds from compiled.adjacency[currentNodeId]
10. Sort edges by (priority ASC, edgeId ASC) via compiled.edgesById  ← deterministic (WF-13)
11. For each edge:
    a. Evaluate condition (if any) via compiled.edgesById[edgeId].condition
    b. If condition matches → target node is "ready"; record edgeId as chosen
12. For each ready node:
    a. If parallel_join → INSERT join receipt (WF-16: join_idempotency_key)
       - ON CONFLICT DO NOTHING → second token skips join dispatch
       - ALL: wait until all tokens completed (check step_executions for all inbound tokens)
       - ANY: first receipt wins → cancel remaining tokens (append skipped/cancelled steps for audit)
    b. Dispatch node execution via NODE_HANDLER_REGISTRY
    c. If node is webhook_out/notification → write to workflow_side_effects_outbox (WF-10)
    d. Store chosen_edge_ids in step output_json (audit: "why did we branch?")
13. TOKEN MOVE: token position advances to next executable node (WF-15)
    - One step_execution per node/token per advance call
    - Token position = "next executable node" (inbound requirements satisfied)
14. INCREMENTAL projection update (from this step only — no history scan):
    - Update active_tokens, current_nodes, last_step_execution_id
15. If any current node is 'end' type → mark instance completed
```

### Handler Atomicity Rule

Every node handler must be either **TX-safe** or **enqueue-only**. No handler may perform partial state mutations that survive a crash.

| Handler Category | Atomicity Model                                                                                                                                           | Examples                                                                                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TX-safe**      | Handler executes inside the same DB transaction as the step_execution row. If handler fails, entire TX rolls back (step row + receipt + handler effects). | `action` (calls `mutate()` in same TX), `lifecycle_gate`, `policy_gate`, `condition`, `rule`, `script`                                                                            |
| **Enqueue-only** | Handler writes to an outbox table in the same TX, then returns. Actual execution happens asynchronously by a worker with its own idempotency receipts.    | `webhook_out` (→ `workflow_side_effects_outbox`), `notification` (→ `workflow_side_effects_outbox`), `wait_timer` (sets `resume_at`), `wait_event` (sets `waiting_for_event_key`) |
| **Approval**     | Hybrid: creates `approval_request` row in same TX (enqueue), then waits for external decision. Gate consumption is TX-safe when decision arrives.         | `approval`                                                                                                                                                                        |

**Rule:** If a handler crashes after receipt + step row are written but before completing its work:

- **TX-safe handlers:** entire TX rolls back — receipt, step row, and handler effects all disappear. Next retry re-inserts receipt successfully and re-runs.
- **Enqueue-only handlers:** step row is committed with `status = 'running'`, outbox row is committed. Worker picks up outbox row with its own idempotency. Step status updated to `completed` when worker confirms.

**Forbidden pattern:** A handler that directly calls an external HTTP API or sends email inside the advanceWorkflow TX. All external IO must go through `workflow_side_effects_outbox` (WF-10).

### Projection Model (keep `workflow_instances` cheap)

`workflow_instances` stores only derived/cached state. **Normal operation: incremental updates** from the step just written (no history scan). **Recovery: full rebuild** from step execution history.

| Field                    | Source                                           |
| ------------------------ | ------------------------------------------------ |
| `status`                 | Derived from step execution terminal states      |
| `active_tokens`          | Computed from non-completed/non-cancelled tokens |
| `current_nodes`          | Derived from active token positions              |
| `updated_at`             | Timestamp of last projection update              |
| `last_step_execution_id` | Monotonic cursor for incremental rebuild         |

**`rebuild_instance_projection(instance_id)`** — reads step executions in order, recomputes all projection fields, overwrites instance row. This is the "self-healing workflow" escape hatch.

### Parallel Token Lifecycle

Each token has:

```typescript
interface WorkflowToken {
  tokenId: string;
  state: 'active' | 'waiting' | 'completed' | 'cancelled';
  spawnedFromNodeId: string; // the parallel_split that created this token
  pathIndex: number; // deterministic ordering within the split
}
```

**Join modes:**

| Mode    | Behavior                                      | Loser handling                                                                                              |
| ------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **ALL** | Wait until every inbound token is `completed` | N/A — all must finish                                                                                       |
| **ANY** | First token to arrive wins                    | Remaining tokens → `cancelled`. Append `cancelled` step_execution rows for each losing token (audit trail). |

Without cancelling losers on ANY-join, you get "zombie parallel paths" that continue executing after the join has already advanced.

### Outbox Worker Query Contract

Both outbox workers (engine + IO) use the same polling pattern for horizontal scalability and crash safety:

```sql
-- Worker poll query (both outboxes use identical pattern)
SELECT id, instance_id, event_type, payload_json, attempts, ...
FROM workflow_events_outbox  -- or workflow_side_effects_outbox
WHERE status IN ('pending', 'failed')
  AND (next_retry_at IS NULL OR next_retry_at <= now())
ORDER BY created_at
LIMIT 100
FOR UPDATE SKIP LOCKED;

-- Immediately in same TX:
UPDATE workflow_events_outbox
SET status = 'processing', attempts = attempts + 1
WHERE id = ANY($1);
```

**Key properties:**

- `FOR UPDATE SKIP LOCKED` — multiple workers never contend on the same row. Scales horizontally.
- `status = 'processing'` — prevents re-poll during execution. If worker crashes, row stays `processing` until stuck-instance detector resets it.
- `ORDER BY created_at` — FIFO ordering within partition (partition-aligned index).
- `LIMIT 100` — batch size tunable per deployment.
- After handler completes: `UPDATE ... SET status = 'completed', completed_at = now()`.
- After handler fails: `UPDATE ... SET status = 'failed', error = $1, next_retry_at = now() + backoff(attempts)`.
- After max_attempts exceeded: `UPDATE ... SET status = 'dead_letter'` → ops alarm.

**Advisory lock discipline:** Keep `pg_advisory_xact_lock` transactions short. Push anything heavy (external IO, large computations) to the side-effect outbox or separate workers. The locked section should only do: load instance, verify hash, insert receipt + step, resolve edges, update projection.

### Node Handlers (extensible registry, mirrors EntityHandler pattern)

```typescript
interface WorkflowNodeHandler {
  type: WorkflowNodeType;
  execute(ctx: WorkflowStepContext): Promise<StepResult>;
  canResume?(ctx: WorkflowStepContext): Promise<boolean>;
}

interface WorkflowStepContext {
  instance: WorkflowInstance;
  node: WorkflowNode;
  tokenId: string;
  entityVersion: number;
  compiledDef: CompiledWorkflow;
  runAs: 'actor' | 'system' | 'service_account';
  actor: ActorRef;
  orgId: string;
}
```

### Resume Scheduler

Only `wait_timer` and `wait_event` nodes need background processing:

- `resume_at` (timers) or `waiting_for_event_key` (events) stored on the step_execution row
- Lightweight job (Graphile Worker / pg_cron) scans:
  ```sql
  SELECT * FROM workflow_step_executions
  WHERE status = 'pending' AND resume_at IS NOT NULL AND resume_at <= now()
  ORDER BY resume_at LIMIT 100;
  ```
- Writes outbox event → worker picks up → `advanceWorkflow()`
- Event arrival (webhook): write outbox event keyed by `waiting_for_event_key` → worker matches

### Integration Points with Existing Code

| Existing System       | Integration                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| `mutate()` pipeline   | Writes outbox event in same TX → worker creates/advances instance              |
| `entity_versions`     | Every step pins to `entity_versions.version` — version-bound approvals (WF-03) |
| `evaluateRules()`     | `rule` node type delegates to V1 engine (backward compatible)                  |
| `approval_chains`     | `approval` node wires to existing approval tables (see § Composable Approvals) |
| `enforceLifecycle()`  | `lifecycle_gate` node validates transition is legal                            |
| `workflow_executions` | V1 flat logging continues; V2 uses `workflow_step_executions`                  |
| `EntityContract`      | Default workflow auto-generated from `lifecycleTransitions`                    |

---

## Security + Governance

### A) Explicit "run-as" Model per Node

Each node declares its execution context:

| `runAs`           | Meaning                                       | Evidence                                                       |
| ----------------- | --------------------------------------------- | -------------------------------------------------------------- |
| `actor` (default) | Executes as the triggering user               | `actor_user_id` on step_execution                              |
| `system`          | Kernel-level (e.g., auto-transitions)         | Must still enforce org scope; logged as `SYSTEM_ACTOR_USER_ID` |
| `service_account` | Integration service (e.g., webhook responses) | Service account ID logged; org-scoped                          |

### B) Policy & Lifecycle Gates are Non-Negotiable

- **`lifecycle_gate`**: validates state transition before proceeding (already exists as `enforceLifecycle()`)
- **`policy_gate`**: ensures `mutate()` policy enforcement is mandatory for every action node — not just a convenience, but a gate that cannot be bypassed
- Both gates are **system nodes** that cannot be removed from the workflow definition

### C) Workflow Drift Prevention

| Risk                           | Mitigation                                                                                                                       | Invariant                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Concurrent double-advance      | `pg_advisory_xact_lock(hashtextextended(...))` — Postgres-native 64-bit, no runtime drift                                        | WF-01                      |
| Double-run on retry            | `workflow_step_receipts` PK (non-partitioned) + `ON CONFLICT DO NOTHING`                                                         | WF-02                      |
| Stale approval                 | Approval decisions record `entity_version`, consumed on use, invalidated on edit                                                 | WF-03                      |
| Definition changed mid-flight  | Published defs are immutable (DB trigger). Instances pin to version.                                                             | WF-04                      |
| Version drift in stable region | Auto-route to amendment branch or fail with `WORKFLOW_VERSION_DRIFT`                                                             | WF-05                      |
| Org breaks envelope integrity  | Custom nodes/edges scoped to declared body slots only. `usr:*` namespace enforced.                                               | WF-06                      |
| Raw body JSON executed         | Engine refuses uncompiled definitions. `compiled_hash` + `compiler_version` verified on load. Stale → `WORKFLOW_COMPILER_STALE`. | WF-07                      |
| System gate removed/reordered  | `compileEffective()` verifies all `sys:*` nodes present and in correct topo order.                                               | WF-08                      |
| Hidden side effects            | Every node dispatch writes step_execution row. `action` uses `MutationSpecRef`.                                                  | WF-09                      |
| Direct HTTP/SMTP from engine   | All cross-service side effects write to `workflow_side_effects_outbox`. IO worker executes + records evidence.                   | WF-10                      |
| Duplicate outbox event         | `workflow_outbox_receipts` PK (non-partitioned). INSERT conflict = skip. Canonical JSON hash prevents flaky dedup.               | WF-11                      |
| Non-deterministic compile      | Node/edge arrays sorted by `id` before hashing. Topo sort tie-breaks by `node_id`.                                               | WF-12 + WF-13              |
| Worker restart                 | Outbox + idempotency key = safe replay. Resume scheduler picks up where it left off.                                             | WF-01 + WF-02 + WF-11      |
| Stale instance blocks new run  | Partial UNIQUE index `WHERE status IN ('running','paused')`. Completed instances preserved for audit + history.                  | Blocker 4 fix              |
| Branch decision unexplained    | `chosen_edge_ids` stored in `output_json`. Edge-first adjacency preserves edge identity in compiled graph.                       | Patch 2 + 7                |
| Executed but receipt failed    | Receipt-first gate: receipt INSERT → step INSERT → handler dispatch. No handler runs without receipt.                            | WF-14                      |
| Amendment ambiguity            | Amendment = new entity row (`amended_from_id` FK). Old instance cancelled with reason `'amended'`.                               | B4 contract                |
| Approval two-world drift       | `approval_*` tables are authority. Step stores `approval_request_id` FK + `applied` evidence only.                               | B5 contract                |
| Invalid status regression      | `restrict_status_regression()` trigger on instances, steps, and both outboxes. Terminal states are final.                        | N1 guard                   |
| Wrong definition_kind columns  | `definition_kind` discriminator + CHECK constraints: envelope/org_patch/effective have distinct required columns.                | N2 CHECK                   |
| Zombie parallel paths          | ANY-join cancels losing tokens with audit trail                                                                                  | § Parallel Token Lifecycle |
| Projection drift from truth    | Token position derivable from DAG + step_executions alone. `rebuild_instance_projection()` must match live projection.           | WF-15                      |
| Double join fire               | Join-level receipt (`join_idempotency_key`) prevents concurrent tokens both winning. ANY-join: first receipt wins.               | WF-16                      |
| Handler crash mid-step         | TX-safe handlers roll back entirely. Enqueue-only handlers commit outbox row; worker retries with its own idempotency.           | § Handler Atomicity Rule   |
| Stuck instance (no progress)   | Stuck detector: running + no pending outbox + last step > X min + not wait node → alert + rebuild/re-enqueue/force-fail actions. | § Workflow Health          |
| Worker contention on outbox    | `FOR UPDATE SKIP LOCKED` — multiple workers never contend on same row. Scales horizontally.                                      | § Outbox Worker Contract   |
| Receipts table bloat           | Pruning job: delete receipts for completed instances > N days. Safe because new entity_version = new keys.                       | § Receipts Pruning         |

---

## Typed DSL (auditable expression language — no JS)

### Why not sandbox JS?

Sandboxed JS (vm2, isolated-vm) is fragile, hard to audit, and impossible to explain to a non-developer. Instead, ship a **typed, auditable expression language**.

### Variable Map (available in every expression)

| Namespace   | Fields                         | Example                                  |
| ----------- | ------------------------------ | ---------------------------------------- |
| `entity.*`  | All document fields            | `entity.grand_total`, `entity.vendor_id` |
| `actor.*`   | Current user info              | `actor.roles`, `actor.user_id`           |
| `org.*`     | Org-level config               | `org.currency`, `org.id`                 |
| `now`       | Current timestamp              | `now`                                    |
| `context.*` | Accumulated workflow variables | `context.approval_count`                 |

### Whitelisted Operators

```
== != > >= < <= in contains && || !
```

### Audit Trail

Every DSL evaluation stores in `output_json`:

```json
{
  "expression": "entity.grand_total > 10000 && actor.roles contains 'finance_manager'",
  "variables": {
    "entity.grand_total": 25000,
    "actor.roles": ["finance_manager", "admin"]
  },
  "result": true,
  "chosen_edge_ids": ["edge_sys_approval_gate_to_usr_slot1_review"]
}
```

`chosen_edge_ids` records **which edges fired** at this step — making branch decisions fully auditable ("why did we go down this path?"). Populated by the engine in core loop step 10b.

**Mandatory for branch nodes:** For node types that evaluate branching (`condition`, `rule`, `lifecycle_gate`), `output_json.chosen_edge_ids` MUST be present — even if empty array (no edge matched). Engine validates presence after handler returns. Missing `chosen_edge_ids` on a branch node = engine error.

### Implementation

Reuse + extend the existing `interpretCondition()` system. Add:

- `expression` condition type: parses DSL string → AST → evaluates against variable map
- Compile-time validation: reject unknown variables, type-check comparisons
- No `eval()`, no `Function()`, no dynamic code execution

### Safety Constraints (prevent pathological expressions)

| Limit                         | Default                     | Rationale                                            |
| ----------------------------- | --------------------------- | ---------------------------------------------------- |
| **Max AST depth**             | 10                          | Prevents deeply nested boolean trees that spike CPU  |
| **Max variable dereferences** | 20 per expression           | Prevents `entity.a.b.c.d.e...` chains                |
| **Forbidden ops**             | regex, string concat, loops | No heavy string ops; conditions only, not transforms |
| **Max expression length**     | 500 chars                   | UX + security guard                                  |

Enforced at **compile time** (definition save/publish). Worker never evaluates an expression that hasn't passed these checks.

### Canonical JSON Hashing (`canonicalJsonHash()`)

All hash inputs derived from JSON (`payload_hash`, `compiled_hash`, `idempotency_key` components) **MUST** use canonical serialization to prevent non-deterministic hashing (Blocker: logically identical JSON producing different hashes due to key order/whitespace).

| Rule                    | Detail                                                                                                                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stable key ordering** | Object keys sorted lexicographically, recursive                                                                                                                                                            |
| **No whitespace**       | `JSON.stringify` with no space/indent args (after key sort)                                                                                                                                                |
| **Null handling**       | `null` values preserved; `undefined` keys omitted                                                                                                                                                          |
| **Number format**       | IEEE 754 double serialization (JSON spec default). **Freeze rule:** only hash JSON-stable values. Amounts MUST be minor integers (cents). No computed floats unless stringified with fixed strategy first. |
| **Implementation**      | Recursive stable-key sort → `JSON.stringify` → `sha256(bytes)`                                                                                                                                             |

**Used by:**

- `compiled_hash` computation (WF-07, WF-12)
- `event_idempotency_key` payload component (WF-11)
- `idempotency_key` computation (WF-02)

**CI test:** `canonicalJsonHash({b:1, a:2}) === canonicalJsonHash({a:2, b:1})` must pass.

---

## Composable Approval Chains

### Two Modes (both needed in enterprise)

| Mode                | When to use                                          | How it works                                                                                                                |
| ------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Chain-backed**    | Complex multi-step approvals with org-wide templates | `approval` node references an `approval_chain_id` → delegates to existing `approval_chains/steps/requests/decisions` tables |
| **Inline approval** | Simple one-off approvals                             | Approvers declared directly on the node definition (user IDs or role names)                                                 |

### Approver Resolution Strategies (pluggable)

| Strategy        | Example                       | Implementation                                         |
| --------------- | ----------------------------- | ------------------------------------------------------ |
| **Direct user** | "Jack must approve"           | Static user_id on node                                 |
| **Role-based**  | "Any Finance Manager"         | Query users with role, round-robin or first-available  |
| **Org chart**   | "Manager of requester"        | Resolve from org hierarchy (future: `org_chart` table) |
| **Rule-based**  | "Budget owner of cost center" | DSL expression resolves approver dynamically           |

### Version-Consumptive Approval Flow

```
1. approval node creates approval_request (entity_version pinned)
2. Approver sees document AT that version (read-only snapshot)
3. Approver decides (approved/rejected/abstained)
4. Decision recorded with entity_version in step_execution
5. When lifecycle_gate consumes the decision → marks applied: true (WF-03)
6. Any subsequent entity edit → invalidates unapplied decisions
```

---

## UX Guardrails (Avoiding the "Workflow Builder Trap")

Most visual workflow builders fail because users create nonsensical graphs. Keep the builder **opinionated**:

### Template Library (ship with defaults)

- **Invoice approval** — threshold-based, parallel for high-value
- **Purchase Order approval** — budget owner + finance manager
- **Return & credit note** — requires original invoice reference
- **Amendment loop** — re-approval on version change
- **Simple fast-track** — auto-approve below threshold

### Guardrails (enforced at definition save/publish)

- System gates **cannot be removed** (lifecycle integrity)
- `parallel_join` nodes auto-configure required token count from incoming `parallel_split`
- Conditions use **typed DSL only** — no arbitrary JS (see § Typed DSL)
- DAG validator rejects cycles, unreachable nodes, missing start/end, broken system gate chains
- **Compiled artifact** must pass integrity check before publish
- Edit windows must be assigned to every non-system node

### Diff View (deterministic compiled diff)

"What changed from the default lifecycle workflow?" — show added/removed/modified nodes and edges as a visual diff. Helps auditors understand org-specific customizations at a glance.

**Implementation uses two compiled artifacts:**

- `compiled.slotMap` — `Record<string, string>` mapping `nodeId → slotId` (which slot owns this node). Envelope nodes map to `'envelope'`.
- `compiled.edgesById[edgeId].provenance` — `'envelope' | slotId` — which layer contributed this edge.

**Diff algorithm:** Compare effective compiled DAG against the bare envelope (no patches). Group changes by slot:

- **Added nodes/edges** — present in effective but not in envelope (provenance = slot)
- **Removed edges** — envelope direct edges replaced by slot attachment edges
- **Modified properties** — edit window overrides (stricter than envelope default)

This is the killer ERP audit feature: "show me exactly what this org customized, per slot, with provenance".

---

## ERP Use Cases (stress-testing the design)

### Use Case A — AP Invoice Fast Lane + Exception Lane (1M scale)

Tests: conditions, parallel, ALL-join, version pinning, amend_only edit window.

```
START → DRAFT (editable) → SUBMIT (amend_only)
  → condition:
    if entity.grand_total <= 500 AND entity.vendor_id in org.trusted_vendors
      → auto-approve (action: lifecycle_gate approve)
    else if entity.grand_total > 10000
      → parallel_split:
          ├── Finance Manager approval (role-based)
          └── Budget Owner approval (rule-based: cost center owner)
        → parallel_join (ALL)
    else
      → single approval (chain-backed)
  → Post to GL (action node)
  → ACTIVE (locked) → END

Reject at any approval → back to DRAFT with reason
Edit during approval → amend_only triggers WF-05 → amendment branch → re-approval
```

### Use Case B — Sales Order Fulfillment (ANY-join + cancellation)

Tests: ANY-join semantics, loser cancellation, conditional branch on failure.

```
SUBMIT → parallel_split:
  ├── Reserve inventory (action → mutate())
  ├── Credit check (script DSL: entity.customer.credit_available >= entity.grand_total)
  └── Notify warehouse (notification)
→ parallel_join (ANY):
    if credit_check fails → cancel other tokens → route to "Payment Required" wait_event
    else continue when inventory reserved OR backorder created
→ ACTIVE → END
```

### Use Case C — Amendment Loop (anti-fraud truth guarantee)

Tests: version-consumptive approvals (WF-03), amendment branch (WF-05), diff evidence.

```
After approval, any edit:
  1. mutate() detects amend_only edit window → writes outbox event
  2. Engine routes to lifecycle_gate(amended) → doc_status = 'amended'
  3. New approval required on new entity_version
  4. step_execution.output_json stores diff summary (v1 vs v2)
  5. Previous approval marked applied: false (invalidated)
```

Proves "contracted envelope" advantage: you can never approve old content and silently edit.

### Use Case D — Wait Event + Timeout (external confirmation)

Tests: outbox + resume scheduler + event keying + escalation branch.

```
SUBMIT → wait_event(event_key: 'delivery:pod:{entity.shipment_id}')
  on webhook arrival → advance to confirmation
  timeout (wait_timer: 72h) → escalation branch:
    → notification: "Shipment {entity.shipment_id} unconfirmed after 72h"
    → approval: logistics manager escalation
```

### Use Case E — Franchise Royalty Cycle (timer + evidence trail)

Tests: timer triggers, condition branching, webhook outbound.

```
wait_timer (monthly cron) → action: "Generate royalty statement"
  → condition: if anomalies detected → route to "Audit Required"
    → approval: franchise ops manager
  → webhook_out: send statement PDF link to franchisee portal
  → END
```

---

## Reference Systems (what to learn from each)

### ERPNext Workflow

- **Pattern:** Document states + transitions + conditions + multi-level approvals. Workflow states = lifecycle statuses for multi-stage approvals.
- **Learn:** State → transition rules, role permissions, multi-stage approval UX.
- **afenda takeaway:** Validates our lifecycle-first approach. Study their state transition UI. Our edit windows generalize their "allow edit" per-state flag.

### Odoo Automated Actions

- **Pattern:** Trigger taxonomy: "On Creation", "On Update", "Based on Time Condition", "Based on Form Modification". Condition + action pairs.
- **Learn:** Trigger taxonomy and "apply on + action to do" UX pattern. Clean separation of when/what.
- **afenda takeaway:** Our trigger types (§ Workflow Triggers) map cleanly to Odoo's model. Stay lifecycle-first, not event-first.

### SAP B1 Approval Procedures

- **Pattern:** Approval templates with originators (who triggers), approvers (who decides), criteria (document types, thresholds), and multi-stage routing.
- **Learn:** Template-based approval configuration. Threshold + hierarchy routing. Originator/approver separation.
- **afenda takeaway:** Our composable approval chains (chain-backed + inline) cover this. Study their template UX for our settings UI.

### ServiceNow Flow Designer

- **Pattern:** "Ask for Approval" action patterns + approval inbox with routing, delegation, escalation.
- **Learn:** Approval inbox UX — how approvals are presented to users, delegation workflows, escalation timers.
- **afenda takeaway:** Directly informs our approval inbox design (Phase 3) and escalation branch patterns (Use Case D).

---

## Sealed MVP V2 Scope (ship fast, prove the concept)

Define a tight MVP boundary to avoid getting stuck building a perfect visual builder too early.

### MVP Node Types

| Node                  | MVP?       | Notes                                      |
| --------------------- | ---------- | ------------------------------------------ |
| `start`, `end`        | ✅         | Always required                            |
| `lifecycle_gate`      | ✅         | Core value — lifecycle enforcement         |
| `policy_gate`         | ✅         | Core value — policy enforcement            |
| `action`              | ✅         | Calls mutate() — the whole point           |
| `approval`            | ✅         | Inline mode first, chain-backed in Phase 2 |
| `condition`           | ✅         | Typed DSL only                             |
| `rule`                | ✅         | V1 bridge — backward compatibility         |
| `wait_timer`          | ⏳ Phase 2 | Needs resume scheduler                     |
| `wait_event`          | ⏳ Phase 2 | Needs webhook inbound                      |
| `parallel_split/join` | ⏳ Phase 2 | Single token first, parallel in Phase 2    |
| `webhook_out`         | ⏳ Phase 3 | Integration — not core                     |
| `notification`        | ⏳ Phase 3 | Email/in-app — not core                    |
| `script`              | ⏳ Phase 3 | DSL already covers conditions              |

### MVP Engine Capabilities

- **Single token** (no parallel) — parallel only in Phase 2
- **Outbox-driven advancement** — decoupled from request latency from day 1
- **Version pinning enforced on approval node** (WF-03)
- **Compiled definitions required for publish** (WF-04)
- **Advisory lock on advance** (WF-01)
- **Idempotency on every step** (WF-02)
- **Edit windows enforced** (WF-05 for amend_only regions)

### MVP Deferred

- Visual DAG builder (use JSON definition API for MVP, build UI later)
- Parallel split/join (single sequential token is sufficient for 80% of workflows)
- Webhook outbound + notification nodes
- Resume scheduler (no timer/event nodes in MVP)

---

## Implementation Phases

### Ship Order (recommended sequence — won't blow up)

### Phase 1: Foundation + MVP Engine (~3 sessions)

1. **Canon types** — `WorkflowNodeType`, `WorkflowEdge`, `WorkflowNode`, `BodySlot`, `SlotGraphPatch`, `OrgWorkflowDefinition`, `CompiledWorkflow` (edge-first adjacency), `WorkflowToken`, `MutationSpecRef` types + Zod schemas
2. **`canonicalJsonHash()`** — stable key sort → `JSON.stringify` → `sha256`. Used by WF-02, WF-11, WF-12. CI test: `{b:1, a:2} === {a:2, b:1}`
3. **DB schema** — 7 new tables (definitions with `definition_kind` discriminator + CHECK constraints, instances with partial UNIQUE, step_executions with `PRIMARY KEY (created_at, id)` partition + controlled-update trigger + `restrict_status_regression()`, `workflow_events_outbox` with `entity_version` + composite PK, `workflow_side_effects_outbox` + composite PK, `workflow_step_receipts` with RLS + REVOKE, `workflow_outbox_receipts` with `source_table` in PK + RLS + REVOKE) + immutability triggers (published + default) + status regression triggers on all 4 status-bearing tables + all indexes (incl. `waiting_for_event_key` partial) + RLS + partitions
4. **Envelope generator** — `EntityContract.lifecycleTransitions` → envelope definition with `sys:*` nodes/edges + `BodySlot[]` declarations
5. **Merge compiler + DAG validator** — `compileEffective(envelope, bodyPatches)` with edge-first adjacency (`edgesById`), canonical node/edge sorting (WF-12), stable topo tie-break (WF-13), system gate integrity (WF-08), `compiler_version` + `canonicalJsonHash` → `compiled_hash`
6. **Slot validator** — validate slot graph patches (WF-06: namespace, scope, no `sys:*` targeting)
7. **Core engine** — `createWorkflowInstance()`, `advanceWorkflow()` with `hashtextextended` advisory lock (WF-01), receipt-first gate (WF-14), receipts-based dedup (WF-02), `compiled_hash` + `compiler_version` verification (WF-07), edge-first resolution + mandatory `chosen_edge_ids` for branch nodes, token move semantics (WF-15: one step per node/token per advance), join receipts (WF-16), handler atomicity (TX-safe vs enqueue-only), incremental projection update, version check (WF-05), amendment contract (B4: old instance → cancelled)
8. **`mutate()` edit-window precondition** — load instance → check `compiled.editWindows` → reject `locked` / force amendment on `amend_only` (the truth wall)
9. **Typed DSL evaluator** — extend `interpretCondition()` + safety constraints (max depth, max dereferences, forbidden ops)
10. **Node handlers (MVP set)** — start, end, lifecycle_gate, policy_gate, action (with `MutationSpecRef`), approval (inline + `approval_request_id` FK to `approval_requests`, `applied` evidence), condition, rule
11. **Outbox writer in mutate()** — write `workflow_events_outbox` row (with `entity_version` + `trace_id`) + `workflow_outbox_receipts` dedup in same TX (WF-11)
12. **Engine worker** — poll `workflow_events_outbox` using `FOR UPDATE SKIP LOCKED` + `processing` status pattern → lock → advance → complete/fail/DLQ. Propagate `trace_id` into step execution.
13. **Compiled cache** — TTL-cached compiled workflow by `(definition_id, version)`. `compiled_hash` verification catches stale entries. Same pattern as existing `db-loader.ts` TTL cache.
14. **Truth invariant tests** — CI-testable assertions for WF-01 through WF-16 + canonical hash determinism + receipts dedup + edge-first audit + status regression guards + compiler stale rejection + receipt-first gate + token determinism + join idempotency
15. **Tests** — envelope generation, slot validation, merge compilation (determinism!), engine advancement, approval flow via `approval_request_id` + snapshot, branching + mandatory `chosen_edge_ids`, idempotency via receipts, version-pin, edit windows, outbox dedup (with `source_table` in PK), partial unique restart, edge evidence, amendment contract (cancel old + start new), status regression rejection, compiler stale rejection, composite PK partition correctness, handler atomicity (TX-safe rollback + enqueue-only commit), projection rebuild matches live (WF-15), join receipt dedup (WF-16), trace_id propagation end-to-end
16. **V1 bridge** — `rule` node type wraps existing `evaluateRules()` (backward compat)

### Phase 2: Parallel + Wait + Chain Approvals (~2 sessions)

17. **Parallel split/join** — token spawning, ALL/ANY join modes, loser cancellation, join receipts (WF-16)
18. **Wait timer/event nodes** — resume scheduler (Graphile Worker / pg_cron), event matching
19. **Chain-backed approvals** — wire to existing `approval_chains/steps/requests/decisions` tables
20. **Approver resolution strategies** — direct user, role-based, rule-based
21. **Projection rebuild** — `rebuild_instance_projection()` recovery utility (incremental already in Phase 1). CI test: WF-15 projection match.
22. **IO worker** — poll `workflow_side_effects_outbox` using `FOR UPDATE SKIP LOCKED` → execute with exponential backoff → evidence → DLQ
23. **Receipts pruning job** — delete receipts for completed instances > N days (configurable, default 90). Weekly via pg_cron or Graphile Worker.

### Phase 3: User-Facing (~2 sessions)

24. **Workflow definition CRUD** — server actions for create/update/publish/archive; publish = `compileEffective()` + freeze
25. **Workflow instance viewer** — show current position in effective DAG for a document (active tokens, completed steps, slot provenance)
26. **Approval inbox** — list pending approval tasks for actor, with `snapshot_version_id` pointing to pinned version snapshot
27. **Settings UI** — slot-scoped workflow editor (list/create/edit slot patches per entity type) + template library
28. **Workflow Health admin page** — outbox pending count, stuck processing, DLQ count, oldest pending age, p95 processing latency (the 1M-scale survival dashboard). Includes **stuck instance detector**: instance `running` + no outbox events pending + last step older than X minutes + current node is not a wait node → surface alert + provide: "Rebuild projection", "Re-enqueue advance event", "Force fail instance (admin)"
29. **Webhook outbound + notification nodes** — HTTP POST with retry, email/in-app (via `workflow_side_effects_outbox`)

### Phase 4: Visual Slot Builder (~2 sessions, can be deferred)

30. **React Flow integration** — slot-scoped visual editor: left panel lists slots, canvas shows one slot at a time, system nodes shown as locked entry/exit pins (not draggable)
31. **Node palette** — sidebar with available node types (action, approval, condition, etc.) — drag into slot canvas only
32. **Edge condition editor** — inline DSL condition builder on edges within slot
33. **Publish/version management** — publish drafts, diff view (slot patches vs default envelope), rollback, version history

---

## Key Design Decisions

| Decision                     | Choice                                                                  | Rationale                                                                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core concept**             | Envelope + Body Slots = Effective Workflow                              | System envelope (immutable, Canon-derived) + slot graph patches (org-customizable) = compiled effective DAG.                                    |
| **Merge model**              | `compileEffective(envelope, bodyPatches)` at publish time               | Deterministic merge. Slot-scoped patches prevent envelope corruption by construction (WF-06).                                                   |
| **Graph storage**            | Envelope + slot patches (JSONB) → compiled effective (JSONB)            | Envelope stored once per entity type. Org defs store only slot patches + `base_ref`. Compiled on publish.                                       |
| **Execution model**          | Controlled-update, outbox-driven, token-based                           | `step_executions` = source of truth (trigger-guarded immutable identity cols). `instances` = projection. Outbox decouples from request latency. |
| **Concurrency**              | `pg_advisory_xact_lock(hashtextextended(...))` per instance             | Single writer guarantee (WF-01). Postgres-native 64-bit hash — no Node/TS runtime drift.                                                        |
| **Idempotency**              | `sha256(instance + node + token + entity_version)` via receipts         | Non-partitioned `workflow_step_receipts` PK for global dedup. Partitioned data tables for retention. Both in same TX.                           |
| **Version pinning**          | Version-consumptive approvals                                           | Decisions are consumed (applied), not replayable. Post-edit invalidation.                                                                       |
| **Definition immutability**  | DB trigger on published rows                                            | Not just app logic — DB-level enforcement (WF-04).                                                                                              |
| **Edit windows**             | Per-node edit policy in compiled definition                             | `editable`, `locked`, `amend_only` — controls document editability per workflow region.                                                         |
| **Parallel execution**       | Token lifecycle with ALL/ANY join modes                                 | ANY-join cancels losers (no zombie paths). ALL-join waits for all.                                                                              |
| **Expression language**      | Typed DSL with audit trail                                              | Variable map + whitelisted ops + result stored in `output_json`. No JS.                                                                         |
| **Approval modes**           | Chain-backed + inline (composable)                                      | Both needed in enterprise. Pluggable approver resolution strategies.                                                                            |
| **Outbox**                   | Transactional outbox in same TX as mutation                             | Guaranteed delivery. Worker handles retry + DLQ. Zero request latency impact.                                                                   |
| **Compiled definitions**     | Edge-first adjacency (`edgesById`), topo, joins, editWindows + SHA-256  | O(1) runtime. Edge identity preserved for audit (`chosen_edge_ids`). `canonicalJsonHash` for deterministic hashing.                             |
| **Wait states**              | Resume scheduler (Graphile Worker / pg_cron)                            | Only timer/event nodes need background work. No Temporal/Camunda infra.                                                                         |
| **Run-as model**             | Explicit per node (`actor` / `system` / `service_account`)              | Every execution has clear accountability + evidence.                                                                                            |
| **Default workflow**         | Auto-generated from `EntityContract`                                    | Every entity always has a workflow. No "unmanaged" documents.                                                                                   |
| **V1 compatibility**         | `rule` node type wraps existing rules                                   | Zero migration. Existing `workflow_rules` keep working as DAG nodes.                                                                            |
| **n8n integration**          | Via `webhook_out` node                                                  | Outbound HTTP to external automation. Core ERP flow stays in-house.                                                                             |
| **MVP boundary**             | Single token, 8 node types, outbox from day 1                           | Ship fast, prove the concept, add parallel + wait in Phase 2.                                                                                   |
| **Partition safety**         | Receipts tables for global dedup + time-partitioned data                | Postgres UNIQUE on partitioned tables is per-partition only. Receipts tables enforce cross-partition uniqueness.                                |
| **Instance lifecycle**       | Partial UNIQUE `WHERE status IN ('running','paused')`                   | Completed/cancelled instances preserved for audit. New runs allowed (amendment, reissue).                                                       |
| **JSON canonicalization**    | `canonicalJsonHash()`: stable key sort → stringify → sha256             | Prevents flaky dedup from key-order differences in JSON serialization. Amounts as minor integers only. Used by WF-02, WF-11, WF-12.             |
| **Partition PK**             | `PRIMARY KEY (created_at, id)` on all partitioned tables                | Postgres requires partition key in PK. Receipts tables reference by UUID only (no cross-partition FK).                                          |
| **Amendment contract**       | Amendment = new entity row (`amended_from_id` FK)                       | Old instance cancelled with reason `'amended'`. Aligns with posting contract: posted docs are immutable.                                        |
| **Approval authority**       | `approval_*` tables are truth; step stores FK + `applied` evidence      | Single source of truth. No duplicate `decision`/`reason` fields in step_executions. Avoids two-world drift.                                     |
| **Receipt-first execution**  | Receipt INSERT → step INSERT → handler dispatch (WF-14)                 | Prevents "executed but receipt write failed" split-brain. Hard invariant in core loop.                                                          |
| **Definition discriminator** | `definition_kind` + CHECK constraints on `workflow_definitions`         | Envelope/org_patch/effective have distinct required columns. DB-enforced, not just code.                                                        |
| **Status guards**            | `restrict_status_regression()` trigger on all status columns            | Terminal states are final. No `completed → running` or `dead_letter → processing` without admin override.                                       |
| **Token determinism**        | Position derivable from DAG + step_executions (WF-15)                   | `workflow_instances` is a rebuildable projection. `rebuild_instance_projection()` must match live state.                                        |
| **Join idempotency**         | Join receipt via `join_idempotency_key` in step_receipts (WF-16)        | Prevents double join fire under concurrent token arrival. ANY-join: first receipt wins.                                                         |
| **Handler atomicity**        | TX-safe (same TX) or enqueue-only (outbox). No partial mutations.       | Crash safety: TX-safe rolls back entirely; enqueue-only commits outbox for worker retry.                                                        |
| **Stable region boundary**   | Slot-driven (`stableRegion: boolean`), compiler-expanded to node set    | No inference needed at runtime. Precomputed `compiled.stableRegionNodes` lookup.                                                                |
| **Outbox worker contract**   | `FOR UPDATE SKIP LOCKED` + `processing` status                          | Horizontal scalability. No worker contention. Crash leaves row in `processing` for stuck detector.                                              |
| **Correlation tracing**      | `trace_id` on outbox rows, propagated to step_execution output_json     | End-to-end debugging: `mutate()` → outbox → worker → step. Single biggest debugging win at 1M scale.                                            |
| **Compiled cache**           | TTL-cached by `(definition_id, version)` + `compiled_hash` verification | Hot path avoids repeated large JSON reads. Same pattern as existing `db-loader.ts` TTL cache.                                                   |
| **Receipts pruning**         | Delete for completed instances > N days (weekly background job)         | Prevents hot table bloat. Safe: completed instances never re-run same idempotency key.                                                          |
| **Compiled diff**            | `slotMap` + `edgesById[].provenance` enables per-slot audit diff        | Killer ERP audit feature: "show me exactly what this org customized, per slot, with provenance".                                                |

---

## File Structure (projected)

```
packages/workflow/src/
├── engine.ts              ← existing (keep for V1 compat)
├── registry.ts            ← existing (keep)
├── conditions.ts          ← existing (reused by condition/script nodes)
├── interpreter.ts         ← existing (reused by rule/condition nodes)
├── db-loader.ts           ← existing (keep for V1 rules)
├── types.ts               ← existing (extend with V2 re-exports)
├── index.ts               ← barrel (extend with V2 exports)
│
├── v2/                    ← NEW: Contracted Workflow Envelope
│   ├── types.ts           — WorkflowNode, WorkflowEdge, WorkflowDefinition, CompiledWorkflow, WorkflowToken, StepResult
│   ├── schemas.ts         — Zod schemas for all V2 types (definition, node, edge, compiled, DSL expression)
│   ├── invariants.ts      — WF-01 through WF-16 assertion helpers (CI-testable)
│   ├── envelope-generator.ts — EntityContract → envelope definition (sys:* nodes/edges + BodySlot[] declarations)
│   ├── slot-validator.ts  — validate slot graph patches (WF-06: scope check, namespace, no sys:* targeting)
│   ├── merge-compiler.ts  — compileEffective(envelope, bodyPatches) → CompiledWorkflow (WF-07, WF-08, WF-12, WF-13)
│   ├── dag-validator.ts   — validate effective DAG (acyclic, reachable, start/end, system gate integrity)
│   ├── dsl-evaluator.ts   — typed DSL: parse → AST → evaluate against variable map → audit output
│   ├── dsl-safety.ts      — compile-time safety checks (max depth, max dereferences, forbidden ops)
│   ├── canonical-json.ts  — canonicalJsonHash(): stable key sort → JSON.stringify → sha256 (WF-02, WF-11, WF-12)
│   ├── engine.ts          — createInstance, advanceWorkflow (advisory lock, receipts dedup, version check, outbox)
│   ├── edit-window-hook.ts — mutate() precondition: load instance → check editWindows → reject/amend
│   ├── outbox-writer.ts   — write workflow_events_outbox + workflow_side_effects_outbox in mutate() TX
│   ├── compiled-cache.ts  — TTL-cached compiled workflow by (definition_id, version) + compiled_hash verification
│   ├── engine-worker.ts   — engine trigger consumer: FOR UPDATE SKIP LOCKED poll → lock → advance → complete/fail/DLQ + trace_id propagation
│   ├── io-worker.ts       — side-effect consumer: FOR UPDATE SKIP LOCKED poll → execute → evidence → DLQ + trace_id propagation
│   ├── projection.ts      — incremental projection update + rebuild_instance_projection (WF-15 recovery)
│   ├── receipts-pruner.ts — delete receipts for completed instances > N days (weekly background job)
│   ├── stuck-detector.ts  — detect stuck instances (running + no outbox + stale + not wait) → alert/rebuild/re-enqueue
│   ├── resume-scheduler.ts — scan for due wait_timer / wait_event steps → write outbox events
│   ├── node-registry.ts   — NODE_HANDLER_REGISTRY
│   ├── nodes/
│   │   ├── types.ts       — WorkflowNodeHandler interface, WorkflowStepContext
│   │   ├── action.ts      — calls mutate() (policy_gate enforced)
│   │   ├── approval.ts    — inline + chain-backed, version-consumptive (WF-03), pluggable resolver
│   │   ├── condition.ts   — evaluates typed DSL, returns branch
│   │   ├── lifecycle.ts   — lifecycle gate (validates transition, consumes approval decisions)
│   │   ├── policy.ts      — policy gate (enforces mutate() policy check)
│   │   ├── parallel.ts    — split (spawn tokens) + join (ALL/ANY, cancel losers)
│   │   ├── notification.ts
│   │   ├── rule.ts        — V1 bridge (wraps evaluateRules)
│   │   ├── script.ts      — typed DSL expression (reuses dsl-evaluator)
│   │   ├── wait.ts        — timer + event (sets resume_at / waiting_for_event_key)
│   │   └── webhook.ts     — outbound HTTP with retry
│   └── index.ts           — V2 barrel
```

---

## Dependencies & Tools (practical stack)

### A) Graph Compile + Validate

| Package                  | Purpose                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| **`@dagrejs/graphlib`**  | Cycle detection, topo sort, reachability, slot boundary validation in `dag-validator.ts` |
| **`zod`** (existing)     | Validate definitions, patches, compiled artifacts, DSL expressions                       |
| Node `crypto` (built-in) | SHA-256 hashing of compiled artifacts (`compiled_hash`)                                  |
| **`mermaid`** (dev-only) | Auto-generate diagrams from definitions for audit/debug                                  |

### B) Typed DSL (safe expression eval)

| Approach                        | Package                                     | Notes                                                                     |
| ------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| **Custom parser** (recommended) | **`peggy`** (PEG parser generator)          | AST + evaluator with type checks against Canon fields. Strictest control. |
| Alternative                     | **CEL-style** (if maintained TS impl found) | Google Common Expression Language — great for business rules              |
| ❌ Avoid                        | `vm2`, `isolated-vm`                        | Fragile, hard to audit, not ERP-grade                                     |

### C) Outbox + Background Worker

| Package                    | Fit                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| **`graphile-worker`** ✅   | Postgres-native job queue. Exactly-once-ish with idempotency keys. Consistent with Neon stack. |
| Alternative: **`pg-boss`** | Also Postgres-based. Very solid. Pick one and stay consistent.                                 |

### D) Observability (critical at 1M scale)

| Package                            | Purpose                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **`@opentelemetry/*`**             | Trace: `mutate()` → outbox → worker → `advanceWorkflow()` → node execution. The single biggest debugging win. |
| **Prometheus metrics** (or hosted) | Outbox pending count, processing latency p95, retries/DLQ count, step execution durations by node_type        |
| **Sentry**                         | Exception tracking + breadcrumbs (workflow is async — you need it)                                            |

### E) Testing + Simulation

| Package                        | Purpose                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| **`testcontainers`** (Node)    | Integration tests on real Postgres (RLS, triggers, partitions, advisory locks)              |
| **`k6`** or **`artillery`**    | Load tests: simulate 1M invoice behavior (burst + steady patterns)                          |
| **Workflow fuzzer** (internal) | Generate random slot patches → ensure compiler rejects invalid ones (WF-06/WF-08 hardening) |

### F) Visual Builder + Diff

| Package             | Purpose                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| **`reactflow`** ✅  | Slot-scoped visual editor                                                |
| **`jsondiffpatch`** | Diff view: slot patches vs default envelope, amendment diffs in evidence |

---

## Top 5 ROI Upgrades (do these first)

| #   | Upgrade                                                             | Why                                                                                     |
| --- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | **WF-10: Outbox-only side effects**                                 | Single biggest reliability win at 1M volume. No HTTP/SMTP from hot path.                |
| 2   | **`compiler_version` + recompile guard**                            | Safe compiler upgrades. Detect stale compilations on deploy.                            |
| 3   | **Partition `workflow_step_executions` + `workflow_events_outbox`** | Prevent table bloat at scale. Monthly range partitions + retention policy.              |
| 4   | **`snapshot_version_id` on approval steps**                         | Approver UI always reads pinned version snapshot, never "current doc". Trust guarantee. |
| 5   | **OpenTelemetry traces** across `mutate()` → worker → step          | Async workflow debugging at scale. Trace ID propagated through outbox.                  |

---

## Success Criteria

### Invariants (must pass CI)

- [ ] WF-01: Single writer per instance (`hashtextextended` Postgres-native advisory lock test)
- [ ] WF-02: Exactly-once step execution (idempotency key + `workflow_step_receipts` PK dedup test — non-partitioned global uniqueness)
- [ ] WF-03: Approvals version-pinned + consumptive (version mismatch rejection test)
- [ ] WF-04: Published definitions immutable (DB trigger rejection test)
- [ ] WF-05: Version drift → amendment or error (stable region edit test)
- [ ] WF-06: Body patches are slot-scoped (out-of-scope node/edge rejection test)
- [ ] WF-07: Effective workflow always compiled + compiler-current (uncompiled rejection + hash verification + `WORKFLOW_COMPILER_STALE` rejection test)
- [ ] WF-08: System envelope integrity (missing/altered system node compile failure test)
- [ ] WF-09: Every node dispatch creates step_execution row before executing (no hidden side effects)
- [ ] WF-10: All cross-service side effects to `workflow_side_effects_outbox` (no direct HTTP/SMTP from engine hot path)
- [ ] WF-11: Outbox processing idempotent per event (`workflow_outbox_receipts` PK dedup + `canonicalJsonHash` determinism test)
- [ ] WF-12: Compile output deterministic (node/edge sorted by `id` before hashing — same inputs = same hash)
- [ ] WF-13: Topological order stable (tie-break by `node_id` — identical across environments)
- [ ] WF-14: Receipt-first execution (mock receipt failure → handler must NOT execute)
- [ ] WF-15: Token position determinism (advance 10 steps, rebuild projection from step_executions + DAG, compare to live — must match)
- [ ] WF-16: Join idempotency (simulate concurrent token arrival at ANY-join → exactly one join fires, losers get cancelled step rows)

### Functional

- [ ] Every workflow step tied to a document version
- [ ] Envelope auto-generated from `EntityContract` with stable `sys:*` IDs
- [ ] Org slot patches compile correctly into effective workflow via `compileEffective()`
- [ ] `compiler_version` stored; stale compilations detected and recompiled on upgrade
- [ ] Users can customize slot body without breaking envelope integrity
- [ ] Approval chains wired and functional (inline + chain-backed)
- [ ] Approval steps store `snapshot_version_id` — approver UI reads pinned snapshot, never current doc
- [ ] Running instances track position via tokens with full audit trail
- [ ] Projection updated incrementally on each advance; full rebuild only for corruption recovery
- [ ] Step executions are source of truth with controlled updates (`restrict_step_execution_updates()` trigger test — immutable identity columns, mutable status/evidence)
- [ ] All 3 high-volume tables partitioned by `created_at` (monthly): `step_executions`, `events_outbox`, `side_effects_outbox`
- [ ] Split outbox: `workflow_events_outbox` (engine triggers) + `workflow_side_effects_outbox` (external IO)
- [ ] Outbox decouples workflow advancement from request latency
- [ ] Edit windows enforced inside `mutate()` as CRUD-SAP precondition (workflow-engine-independent)
- [ ] DSL safety constraints enforced at compile time (max AST depth, max dereferences, no regex)
- [ ] Compiled definitions make runtime O(1) lookup
- [ ] Existing V1 rules continue to work (backward compatible)
- [ ] Every workflow step goes through `mutate()` kernel (K-01 preserved)
- [ ] Explicit `runAs` model with evidence on every step
- [ ] Typed DSL expressions are auditable (expression + variables + result + `chosen_edge_ids` in output_json)
- [ ] ANY-join cancels losing tokens (no zombie parallel paths)
- [ ] Template library ships with common ERP patterns (invoice, PO, amendment)
- [ ] `canonicalJsonHash()` produces identical hashes for logically identical JSON (stable key order CI test)
- [ ] Edge-first compiled adjacency (`edgesById`) preserves edge identity — edge priority, condition, label auditable at runtime
- [ ] Partial UNIQUE on `workflow_instances` allows new workflow runs after completion (amendment cycles, reissue)
- [ ] `workflow_events_outbox` stores `entity_version` for version-scoped event dedup
- [ ] Receipts tables (`workflow_step_receipts`, `workflow_outbox_receipts`) enforce global uniqueness across time partitions
- [ ] Partitioned tables use `PRIMARY KEY (created_at, id)` — composite PK includes partition key (Postgres requirement)
- [ ] `workflow_outbox_receipts` PK includes `source_table` — no collision between engine + side-effect keys
- [ ] Amendment contract: amendment creates new entity row, old instance cancelled with reason `'amended'`
- [ ] Approval authority: `approval_*` tables are truth; step stores `approval_request_id` FK + `applied` evidence only
- [ ] `definition_kind` discriminator + CHECK constraints enforce column requirements per kind (envelope/org_patch/effective)
- [ ] `restrict_status_regression()` trigger prevents invalid status transitions on all 4 status-bearing tables
- [ ] `waiting_for_event_key` partial index enables fast webhook/event resume lookup
- [ ] `chosen_edge_ids` mandatory for branch nodes (`condition`, `rule`, `lifecycle_gate`) — engine validates presence
- [ ] RLS + REVOKE UPDATE/DELETE on both receipts tables (append-only, service role INSERT only)
- [ ] Handler atomicity: TX-safe handlers roll back entirely on crash; enqueue-only handlers commit outbox row for worker retry
- [ ] Stable region is slot-driven (`stableRegion: boolean` on BodySlot), compiler-expanded to `compiled.stableRegionNodes`
- [ ] Outbox worker uses `FOR UPDATE SKIP LOCKED` + `status = 'processing'` pattern (no worker contention)
- [ ] Stuck instance detector: running + no pending outbox + last step > X min + not wait node → alert surfaced in admin
- [ ] `trace_id` propagated from `mutate()` → outbox rows → worker → `step_execution.output_json` (end-to-end correlation)
- [ ] Compiled diff view: slotMap + edge provenance enables per-slot audit of org customizations vs envelope
- [ ] Compiled workflow cached by `(definition_id, version)` with TTL; `compiled_hash` verification catches stale cache
- [ ] Receipts pruning job: delete receipts for completed instances > N days (configurable, default 90)
- [ ] Compound outbox index `(status, next_retry_at, created_at)` for efficient worker poll ORDER BY
- [ ] Supporting btree `(org_id, entity_type, entity_id)` on instances for fast lookups alongside partial UNIQUE

### Observability

- [ ] OpenTelemetry traces: `mutate()` → outbox → worker → `advanceWorkflow()` → node execution
- [ ] Prometheus metrics: outbox pending count, processing latency p95, retries/DLQ, step durations by node_type
- [ ] Sentry integration for async workflow exception tracking

### UX (Phase 3+)

- [ ] Approval inbox shows pending tasks with document version context (reads `snapshot_version_id`)
- [ ] Workflow instance viewer shows current DAG position
- [ ] **Workflow Health admin page** — outbox pending count, stuck processing, DLQ count, oldest pending age, p95 processing latency
- [ ] Visual builder allows non-developers to design workflows (Phase 4)
- [ ] Diff view shows changes from default lifecycle workflow
