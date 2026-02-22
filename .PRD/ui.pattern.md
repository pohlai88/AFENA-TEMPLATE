# Phase C — Enterprise App Shell + Action-Aware CRUD UI (Server-First, Zero-Drift)

Standardize the org-scoped app shell and build an enterprise-grade action system with **three-concept separation** (**Verb / Update Mode / Workflow Decision**), **server-side ActionResolver**, and reusable CRUD composables — **pure shadcn/ui + Tailwind v4 tokens only**, **RSC-first**, **client islands only**, **no Zustand conflict**, **Pino structured logging wired end-to-end**.

---

## 0) Executive Outcome

By the end of Phase C:

- Every org page inherits a **single shell**: sidebar, header, breadcrumbs, user menu, ⌘K.
- Every entity inherits a **single action model**:
  - **Verbs** (top-level)
  - **Update Modes** (modal under Update)
  - **Workflow Decisions** (Approve/Reject gated)

- All actions are **resolved on the server** (RBAC + SoD + lifecycle + entity contract).
- UI becomes predictable:
  - list pages ~≤ 40 lines (server fetch + render)
  - detail pages standardized (action bar + metadata sidebar)
  - forms standardized (RHF + Zod + server action submission)

- Observability is enterprise-grade:
  - every action emits **Pino logs** with correlation id
  - no `console.*` in runtime paths

---

## 1) Enterprise Principle — Three-Concept Separation

**Never mix these three concepts:**

| Concept               | What it is                     | Examples                                        | UI surface                  |
| --------------------- | ------------------------------ | ----------------------------------------------- | --------------------------- |
| **Verb**              | User-facing primary action     | Create, Update, Delete, Restore, Submit, Cancel | Top-level buttons           |
| **Update Mode**       | Routing under Update only      | Edit, Correct, Amend, Adjust, Reassign          | Modal after clicking Update |
| **Workflow Decision** | State decision with RBAC + SoD | Approve, Reject, Send Back, Escalate            | Separate gated buttons      |

Rules:

- Users see **Update** as the single entrypoint for changes → **Update Mode dialog** chooses mode.
- **Approve/Reject are never update subclasses**.
- Policy governs both layers:
  1. can user press Update?
  2. which update modes can they select?
  3. whether workflow decisions are allowed

---

## 2) Non-Negotiable Architecture Rules (Server-First)

### R0 — RSC by default

- `layout.tsx`, `page.tsx` are **Server Components**. No `use client`.

### R1 — Client islands only (leaf components)

Client components exist only for:

- Sidebar interaction (collapse, mobile sheet)
- Breadcrumbs (pathname parsing)
- Action menus/dialogs (UpdateModeDialog, ConfirmActionDialog)
- DataTable interactions (TanStack Table)
- Forms (React Hook Form controlled inputs)

### R2 — State ownership (no conflicts)

- **TanStack Table** owns table state (sorting/filter/pagination/selection)
- **React Hook Form** owns form state
- **Zustand** is reserved for **shell UX only**:
  - sidebar collapsed
  - density (compact/comfortable)
  - last selected tab / view
  - command palette UX preferences
    **Never** duplicate table/form state into Zustand.

### R3 — Actions execute on the server

- Client orchestrates UI only (open dialog → collect reason → invoke server action).
- Server does: policy check → mutation → logging → return result.

### R4 — Observability is mandatory

- Every verb/mode/decision logs:
  - start / success / error
  - orgId, userId, entityType, entityId
  - actionKind (verb/decision), updateMode (optional)
  - fromStatus/toStatus (when applicable)
  - correlation id (`clientActionId`)

- No production `console.*`. Pino only.

---

## 3) Design Constraints (No Drift)

1. **Pure Tailwind v4 + globals.css tokens** only
   Use: `bg-sidebar`, `text-muted-foreground`, `border-border`, `status-warning`, `elev-sm`, etc.
   Never: `oklch()`, `hsl()`, hex/rgb in component files.

2. **Pure shadcn/ui** only
   Only import from `afenda-ui/components/*`.

3. **Enterprise action model** enforced in Canon types + UI composables.

4. **Server Components default**
   Only leaf interactive components are client.

---

## 4) Folder & File Structure (Enterprise Separation)

### 4.1 Naming conventions (enforce boundaries)

- `page.tsx`, `layout.tsx` → Server only
- `*_client.tsx` → Client only
- `*_server.ts` → Server-only module
- `server-actions.ts` → Server actions only
- `*-contract.ts` → entity contract (shared types/data only, no hooks) — co-located in `_components/`

---

## 5) Layered Architecture

## Layer 0 — Canon & CRUD Kernel Upgrades

### Goals

- Canon declares the **enterprise action model**
- CRUD lifecycle supports **approve/reject → active**
- Entity contract defines what each entity supports

### Deliverables (Canon)

```
packages/canon/src/
├── enums/
│   ├── auth-verb.ts          (ADD: approve, reject, restore)
│   ├── doc-status.ts         (ADD: active; optionally rejected)
│   └── update-mode.ts        (NEW: edit, correct, amend, adjust, reassign)
├── types/
│   ├── action-spec.ts        (NEW: ActionKind, ActionSpec, UpdateModeSpec, ConfirmSpec)
│   └── entity-contract.ts    (NEW: lifecycle + workflow + update modes + policy keys)
```

### Deliverables (CRUD lifecycle)

```
packages/crud/src/
└── lifecycle.ts              (ADD transitions for approve/reject and active)
```

**Enterprise default lifecycle (baseline)**

- `draft` → `submitted` (Submit)
- `submitted` → `active` (Approve)
- `submitted` → `draft` or `rejected` (Reject)
- `active` → `cancelled` (Cancel)
- `cancelled` → `active` or `draft` (Restore, entity-specific)
- `deleted` flag remains separate (soft delete)

> Note: Whether “rejected” is a status or a transition back to draft is your choice. Enterprise systems do both. The contract supports either.

---

## Layer 1 — Enterprise App Shell (Org-Scoped)

### Goals

- Replace flat layout with sidebar shell
- Keep layout server-first, push interactivity to client islands
- Nav config is **single source** for Sidebar + Breadcrumb labels + Command Palette entries

### Files

```
apps/web/app/(app)/org/[slug]/
├── layout.tsx                         (Server)
├── _server/
│   └── org-context_server.ts          (org + actor + nav permissions)
├── _components/
│   ├── nav-config.ts                  (data only)
│   ├── app-sidebar_client.tsx         (Sidebar UI + collapsible)
│   ├── app-header_client.tsx          (Trigger + breadcrumbs + user + search)
│   └── app-breadcrumbs_client.tsx     (usePathname() → segments → labels)
└── page.tsx                           (Server: org dashboard)
```

**Shell responsibilities**

- Server `layout.tsx` fetches:
  - org context
  - actor roles/claims
  - feature flags (optional)

- Client sidebar/header receive only what they need (labels/links, display name, etc.)

---

## Layer 2 — Enterprise Action System + CRUD Composables

### Goals

- One **server-side ActionResolver** governs all UI actions (no UI-invented actions)
- One set of composables powers list/detail/forms across all entities
- Update uses a modal to choose **Update Mode**
- Workflow decisions render separately and are strictly gated

### Folder split (server vs client)

```
apps/web/app/(app)/org/[slug]/_components/crud/
├── server/
│   ├── entity-registry_server.ts        (maps entityType → EntityContract)
│   ├── action-resolver_server.ts        (truth: RBAC + SoD + lifecycle)
│   └── action-logger_server.ts          (Pino wrapper: start/success/error)
└── client/
    ├── action-bar_client.tsx            (Primary + Secondary + Workflow section)
    ├── action-button_client.tsx         (renders ActionSpec)
    ├── update-mode-dialog_client.tsx    (Update → mode selection)
    ├── confirm-action-dialog_client.tsx (confirm + reason + severity)
    ├── status-badge.tsx                 (doc_status + deleted flag)
    ├── page-header.tsx                  (title + description + ActionBar slot)
    ├── entity-toolbar_client.tsx        (search/filters/column visibility)
    ├── entity-actions-cell_client.tsx   (row dropdown using resolved actions)
    ├── entity-detail-layout.tsx         (detail layout standard)
    ├── entity-form-shell_client.tsx     (form wrapper + footer)
    └── data-table_client.tsx            (wrap existing packages/ui DataTable)
```

### ActionResolver contract (server truth)

Inputs (server-computed):

- entity contract
- doc status + flags (deleted, locked)
- actor capabilities (allowed verbs, allowed update modes, workflow decisions)
- optional SoD signals (submitter vs approver)

Outputs:

- Primary verbs (CTA)
- Secondary verbs (dropdown)
- Workflow decisions section (approve/reject…)
- Allowed update modes for UpdateModeDialog
- Confirm requirements (reason/typed confirmation)

**Key rule:** client UI renders only what resolver returns.

---

## Layer 3 — Contacts as the Reference Implementation

### Goal

Contacts becomes the _template_ entity that proves the architecture: list/detail/new/edit/trash + approve/reject + update modes + logging.

```
apps/web/app/(app)/org/[slug]/contacts/
├── page.tsx                            (Server: fetch + resolve + render)
├── new/page.tsx                        (Server)
├── [id]/page.tsx                       (Server)
├── [id]/edit/page.tsx                  (Server)
├── trash/page.tsx                      (Server)
├── _server/
│   ├── contacts.query_server.ts         (data fetch)
│   ├── contacts.policy_server.ts        (allowed verbs/modes decisions)
│   └── contacts.server-actions.ts       (mutations + logging)
└── _components/
    ├── contacts-table_client.tsx        (DataTable client island)
    ├── contact-columns.ts               (Column defs using helpers)
    ├── contact-form_client.tsx          (RHF fields only)
    ├── contact-fields.ts                (Field registry)
    └── contact-contract.ts              (EntityContract)
```

**Target:** `page.tsx` files are thin: fetch + resolve + render composables.

---

## 6) Enterprise UI Standards (List / Detail / Form)

## 6.1 List Page Standard (Server + Client Table)

Server page responsibilities:

- fetch rows
- fetch actor allowed verbs/modes (policy)
- resolve actions server-side
- render PageHeader + EntityToolbar client island + DataTable client island

Client table responsibilities:

- TanStack table interactions only
- row actions use resolver output (no policy logic)
- bulk actions (optional) follow same resolver pattern

## 6.2 Detail Page Standard

Must include:

- Title + status badge + action bar
- Main info section card(s)
- Metadata sidebar card (created/updated/version/doc status/deleted)
- Optional tabs: Audit / Versions / Related

## 6.3 Form Standard (RHF + Zod + Server Actions)

- `contact-form_client.tsx` contains fields only (no layout)
- `entity-form-shell_client.tsx` provides:
  - Card wrapper
  - error summary block
  - footer with Cancel + Save (mode-dependent)

- Submission goes to server action:
  - server validates with Zod
  - server checks policy again
  - server logs via ActionLogger
  - returns success/error, page refresh or redirect

---

## 7) Observability & Logging (Pino) — Required Implementation

### 7.1 ActionLogger (server module)

Wrap every server action with:

- `action.start` log
- `action.success` log
- `action.error` log (include error class/message; avoid sensitive payloads)

Required fields:

- orgId, userId
- entityType, entityId (if exists)
- actionKind (verb/decision)
- updateMode (optional)
- fromStatus/toStatus (optional)
- clientActionId (required)
- durationMs (recommended)

### 7.2 Correlation

Client generates `clientActionId` (UUID) per action attempt and passes it to server action. This makes support and audit investigations sane.

---

## 8) Zustand / TanStack / RHF Policy (No Conflicts)

### Allowed in Zustand

- sidebar collapsed state
- density preference
- last selected detail tab
- command palette UI preference

### Not allowed in Zustand

- table filters/sorts/pagination/selection
- form values
- action pending states (keep local to client component)

**Rationale:** avoids two sources of truth and “fighting state machines.”

---

## 9) Implementation Steps (Phased Execution)

## Step A — Canon + Lifecycle (foundation)

1. Add `approve`, `reject`, `restore` to `AUTH_VERBS`
2. Add `active` to `DOC_STATUSES` (and optional `rejected`)
3. Add `update-mode.ts` enum
4. Add `action-spec.ts` + `entity-contract.ts`
5. Update `packages/crud/src/lifecycle.ts` with approve/reject transitions

## Step B — Shell upgrade (org layout)

6. Implement `org-context_server.ts` (org + actor + nav perms)
7. Implement `nav-config.ts` as SSOT for sidebar + breadcrumbs + ⌘K items
8. Replace org layout with SidebarProvider + AppSidebar + AppHeader

## Step C — Action System (server truth + client UI)

9. Implement `entity-registry_server.ts` (contacts first)
10. Implement `action-resolver_server.ts`
11. Implement `action-logger_server.ts` (Pino wrapper)
12. Implement client composables:
    - ActionBar, ActionButton
    - UpdateModeDialog
    - ConfirmActionDialog
    - StatusBadge
    - EntityToolbar, EntityActionsCell
    - DataTable wrapper

## Step D — Contacts refactor (reference entity)

13. Rewrite contacts list/detail/new/edit/trash using composables
14. Replace manual `useState` form with RHF
15. Implement server actions with logging:
    - create/update (with update mode)
    - submit/cancel
    - approve/reject
    - delete/restore

## Step E — Enterprise gates (CI invariants)

16. CI check: no `use client` in pages/layouts
17. CI check: no `console.*` in apps/web
18. CI check: no hardcoded colors
19. CI check: ActionResolver required for entity action surfaces

---

## 10) Verification Checklist (Enterprise Acceptance)

- ✅ `next build` passes
- ✅ `tsc --noEmit` passes
- ✅ Sidebar + breadcrumbs work on desktop + mobile
- ✅ Contacts list has sorting/filter/pagination/row actions via DataTable
- ✅ Update opens UpdateModeDialog; modes vary by role/status
- ✅ Approve/Reject appear only when submitted and actor allowed
- ✅ Every action logs start/success/error via Pino with clientActionId
- ✅ No Zustand conflict (table/form state not mirrored)
- ✅ No hardcoded colors; tokens only

---

## 11) File Count Summary (expected)

- Canon: ~3 new, ~4–6 modified
- CRUD lifecycle: 1 modified
- Shell: ~4 new, 1 modified
- CRUD composables: ~3 server files, ~10–12 client files
- Contacts: ~3–5 new files, ~5–7 modified pages/components

---

## 12) “Zero Drift” Commit Sequence (recommended)

1. **Commit C0:** Canon + lifecycle upgrades
2. **Commit C1:** Shell layout + nav registry
3. **Commit C2:** ActionResolver + ActionLogger (server)
4. **Commit C3:** CRUD client composables (ActionBar/Dialog/Confirm)
5. **Commit C4:** Contacts refactor (list → detail → forms → trash)
6. **Commit C5:** CI invariants + lint gates

---

If you want the next step, paste (or upload) your current:

- `packages/crud/src/lifecycle.ts`
- one contacts page (`contacts/page.tsx`)
- your current server mutation entrypoint (where CRUD-SAP executes)

…and I’ll translate this Phase C spec into a **file-by-file patch plan** with exact component APIs and what each page shrinks to (still token-only, shadcn-only, server-first).
