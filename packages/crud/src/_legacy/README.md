# Legacy CRUD Implementations

This directory contains superseded implementations preserved for historical reference.

---

## Archived Files

### services/search-outbox.ts
- **Archived:** February 19, 2026
- **Replaced By:** `../outbox/write-outbox.ts`
- **Reason:** Unified outbox pattern (Phase 2)
- **Lines:** 32
- **Original Function:** `enqueueSearchOutboxEvent()` - Enqueued search index updates

### services/workflow-outbox.ts
- **Archived:** February 19, 2026
- **Replaced By:** `../outbox/write-outbox.ts`
- **Reason:** Unified outbox pattern (Phase 2)
- **Lines:** 118
- **Original Function:** `enqueueWorkflowOutboxEvent()` - Enqueued workflow trigger events

---

## Do Not Use

These files are **not imported** by any active code. They are preserved for:
- Historical reference
- Understanding architecture evolution
- Rollback scenarios (emergency only)

---

## Architecture Evolution

### Phase 1 (Pre-Feb 2026)
- Separate outbox implementations for search, workflow, and webhooks
- Each service had its own enqueue function
- Scattered across `services/` directory

### Phase 2 (Feb 2026)
- **Unified outbox pattern** implemented in `outbox/write-outbox.ts`
- Single `writeOutboxIntents()` function handles all outbox types
- Atomic writes with deduplication via `intent_key`
- K-12 kernel invariant enforced (transactional outbox)

---

## If You Need Outbox Functionality

**Use:** `../outbox/write-outbox.ts`

```typescript
import { writeOutboxIntents } from '../outbox/write-outbox';

await writeOutboxIntents(tx, intents, { orgId, traceId });
```

**Do NOT** import from this `_legacy/` directory.

---

**Last Updated:** February 19, 2026  
**CRUD Version:** v1.1-T
