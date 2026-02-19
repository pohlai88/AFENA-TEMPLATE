# Commit Phase

**Phase 2 of the mutation pipeline** — Atomic database transaction

## Purpose

The Commit phase executes the mutation within a single database transaction, writing the entity change along with all required audit trails, version snapshots, and outbox intents.

## Key Responsibilities

1. **Entity Write** — INSERT/UPDATE/soft-delete/restore
2. **Audit Logging** — K-03 requirement
3. **Version Snapshots** — K-03 requirement
4. **Outbox Writes** — K-12 atomic side effects
5. **Idempotency Records** — K-10 deduplication
6. **Handler Hooks** — Custom post-write logic

## Files

- **`commit-plan.ts`** — Main orchestrator, wraps everything in single transaction
- **`session.ts`** — DbSession wrappers (`withMutationTransaction`, `withReadSession`)
- **`apply-entity.ts`** — Generic entity writer (INSERT/UPDATE/DELETE)
- **`write-audit.ts`** — Audit log writer
- **`write-version.ts`** — Version snapshot writer
- **`write-idempotency.ts`** — K-10 idempotency key persistence
- **`compute-diff.ts`** — JSON patch generation
- **`allocate-doc-number.ts`** — Sequential document numbering
- **`sync-custom-fields.ts`** — Custom field synchronization

## Key Invariants

- **Single transaction** — K-02, all writes succeed or all fail
- **No external I/O** — Enforced by CI gate G-CRUD-02
- **Atomic outbox** — K-12, no try/catch around outbox writes
- **DbSession only** — No direct `db` imports (enforced by G-CRUD-03)

## Transaction Flow

```typescript
await withMutationTransaction(ctx, async (tx) => {
  // 1. Apply entity change
  const written = await applyEntity(tx, plan);
  
  // 2. Write audit log (K-03)
  await writeAuditLog(tx, plan, written, diff, ctx);
  
  // 3. Write version snapshot (K-03)
  await writeVersionSnapshot(tx, plan, written, diff, ctx);
  
  // 4. Write outbox intents (K-12 atomic)
  await writeOutboxIntents(tx, plan.outboxIntents, meta);
  
  // 5. Write idempotency record (K-10, create only)
  if (plan.idempotencyKey) {
    await writeIdempotencyKey(tx, plan);
  }
  
  // 6. Handler commit hooks (optional)
  await handler.commitAfterEntityWrite?.(tx, plan, written);
  
  return buildReceipt(plan, written);
});
```

## Integration Points

- **Input:** `PreparedMutation` from Plan phase
- **Output:** `MutationReceipt` (ok/rejected/error)
- **Next Phase:** Deliver phase (`deliver/deliver-effects.ts`)

## Error Handling

- **Transient errors** (deadlock, timeout) → Retry via `withDbRetry()`
- **Permanent errors** (constraint violation) → Return error receipt
- **All errors** → Transaction rolls back automatically
