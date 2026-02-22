# Plan Phase

**Phase 1 of the mutation pipeline** — Reject-fast validation and planning

## Purpose

The Plan phase validates the mutation request and builds a `PreparedMutation` plan without performing any database writes. This phase is designed to fail fast if the mutation cannot proceed.

## Key Responsibilities

1. **Input Validation** — Zod schema validation
2. **Authorization** — Policy enforcement via `enforcePolicyV2()`
3. **Lifecycle Validation** — State machine checks
4. **Field Write Policy** — K-15 enforcement via `FieldPolicyEngine`
5. **Edit Window Checks** — Workflow-based edit restrictions
6. **Outbox Intent Building** — Prepare side effects (workflow, search, webhooks)

## Files

- **`build-plan.ts`** — Main orchestrator, calls all enforcement functions
- **`validate-spec.ts`** — Zod validation
- **`sanitize-input.ts`** — Strip system fields
- **`load-current.ts`** — Fetch current entity state
- **`prepared-mutation.ts`** — Internal DTO types

### enforce/

- **`policy.ts`** — Authorization + CAPABILITY_CATALOG integration
- **`lifecycle.ts`** — State machine validation
- **`field-write.ts`** — K-15 FieldPolicyEngine (immutable, writeOnce, serverOwned, computed)
- **`edit-window.ts`** — Workflow edit window enforcement
- **`governor.ts`** — Rate limiting
- **`rate-limiter.ts`** — Rate limit implementation
- **`namespace.ts`** — ActionType/EntityRef consistency

### validate/

- **`custom-fields.ts`** — Custom field validation

### outbox/

- **`build-intents.ts`** — Build outbox intents for workflow, search, webhooks
- **`intent-types.ts`** — Re-exports `OutboxIntent` from Canon

## Key Invariants

- **No database writes** — Plan phase is read-only
- **Fail fast** — Reject invalid mutations before transaction
- **Deterministic** — Same input always produces same plan
- **Idempotent** — Can be called multiple times safely

## Integration Points

- **Input:** `MutationSpec` from caller
- **Output:** `PreparedMutation` or rejection `ApiResponse`
- **Next Phase:** Commit phase (`commit/commit-plan.ts`)
