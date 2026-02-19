# Deliver Phase

**Phase 3 of the mutation pipeline** — Best-effort side effects

## Purpose

The Deliver phase executes non-critical side effects after the mutation has been successfully committed. All operations in this phase are best-effort and never throw errors to the caller.

## Key Responsibilities

1. **Signal Workers** — Notify outbox processors (workflow, search)
2. **Cache Invalidation** — Clear cached entity lists
3. **Metering** — Record API usage metrics

## Files

- **`deliver-effects.ts`** — Main orchestrator, coordinates all side effects
- **`signal-workers.ts`** — Notify outbox workers to process intents
- **`invalidate-cache.ts`** — Clear cached entity lists
- **`best-effort-metering.ts`** — Record usage metrics

## Key Invariants

- **Never throws** — All operations wrapped in `.catch(() => {})`
- **Time-bounded** — All external calls have timeouts
- **Non-blocking** — Caller doesn't wait for completion
- **Idempotent** — Safe to retry

## Execution Pattern

```typescript
export async function deliverEffects(
  plan: PreparedMutation,
  commitResult: CommitResult,
  ctx: MutationContext,
): Promise<void> {
  // Fire-and-forget: individual error isolation
  signalWorkers(plan.outboxIntents).catch(() => {});
  invalidateCache(plan.entityRef).catch(() => {});
  bestEffortMetering(plan, commitResult.receipt, ctx).catch(() => {});
  
  // Returns immediately, doesn't wait for completion
}
```

## Why Best-Effort?

- **Mutation already committed** — Entity change is durable
- **Outbox intents persisted** — Workers will eventually process
- **Cache is optimization** — Stale cache is acceptable
- **Metering is non-critical** — Missing metrics don't break functionality

## Integration Points

- **Input:** `PreparedMutation` + `CommitResult` from Commit phase
- **Output:** None (fire-and-forget)
- **Workers:** Workflow engine, search indexer, webhook dispatcher

## Error Handling

All errors are caught and ignored. If a side effect fails:

- **Outbox intents** — Workers retry from database
- **Cache invalidation** — Next read fetches fresh data
- **Metering** — Metric is lost (acceptable)
