# CRUD Package Archive Recommendations

**Analysis Date:** February 19, 2026  
**CRUD Version:** v1.1-T  
**Analyst:** Architecture Audit

---

## Executive Summary

After comprehensive analysis of the CRUD package, **3 files are candidates for archival** as they have been superseded by the v1.1-T architecture implementation. All candidates are legacy implementations replaced by the unified outbox pattern (Phase 2).

**Recommendation:** Archive these files to a `_legacy/` directory to maintain clean codebase while preserving historical reference.

---

## Archive Candidates

### Category 1: Legacy Outbox Implementations (SUPERSEDED)

These files were replaced by the unified `outbox/write-outbox.ts` in Phase 2 of the v1.1-T implementation.

#### 1. `src/services/search-outbox.ts` ❌ ARCHIVE

**Status:** Superseded  
**Replaced By:** `src/outbox/write-outbox.ts`  
**Lines:** 32  
**Last Valid Use:** Phase 1 (pre-Feb 2026)

**Evidence:**
```typescript
// outbox/write-outbox.ts lines 7-9:
/**
 * Unified outbox writer — Phase 2 atomic replacement for:
 *   - services/search-outbox.ts      (enqueueSearchOutboxEvent)
 *   - services/workflow-outbox.ts    (enqueueWorkflowOutboxEvent)
 */
```

**Usage Check:** ✅ No imports found in codebase  
**Functionality:** Enqueued search index updates (now handled by unified outbox)  
**Risk:** Low - completely replaced

**Recommendation:** Archive to `src/_legacy/services/search-outbox.ts`

---

#### 2. `src/services/workflow-outbox.ts` ❌ ARCHIVE

**Status:** Superseded  
**Replaced By:** `src/outbox/write-outbox.ts`  
**Lines:** 118  
**Last Valid Use:** Phase 1 (pre-Feb 2026)

**Evidence:**
```typescript
// outbox/write-outbox.ts explicitly replaces this file
// See comment at lines 7-9
```

**Usage Check:** ✅ No imports found in codebase  
**Functionality:** Enqueued workflow trigger events (now handled by unified outbox)  
**Risk:** Low - completely replaced

**Recommendation:** Archive to `src/_legacy/services/workflow-outbox.ts`

---

#### 3. `src/services/webhook-dispatch.ts` ⚠️ REVIEW NEEDED

**Status:** Potentially Active  
**Lines:** 213  
**Usage Check:** ✅ Imported in `src/internal.ts` (2 matches)

**Analysis:**
- Contains `dispatchWebhookEvent()` - fire-and-forget webhook delivery
- Contains `verifyWebhookSignature()` - incoming webhook verification
- **NOT replaced by outbox pattern** - this is delivery logic, not intent writing
- Used in `internal.ts` which is the infrastructure barrel export

**Functionality:**
1. Dispatches webhooks to external endpoints (POST with HMAC signature)
2. Logs delivery attempts in `webhook_deliveries` table
3. Updates endpoint stats (last delivery, failure count)
4. Verifies incoming webhook signatures

**Current Architecture Role:**
- Outbox pattern writes **intents** to `webhook_outbox` table
- Outbox **workers** poll the table and call `dispatchWebhookEvent()` for delivery
- This is the **delivery layer**, not the intent layer

**Recommendation:** ✅ **KEEP** - Active delivery infrastructure

---

### Category 2: Specialized Read Functions (ACTIVE)

#### 4. `src/read-delivery-note.ts` ✅ KEEP

**Status:** Active  
**Lines:** 35  
**Usage Check:** ✅ Imported in `src/internal.ts`

**Functionality:**
- Relational read for delivery note with lines (single query)
- Uses Drizzle `query.X.findFirst({ with: { Y: true } })`
- Exported via `internal.ts` for app layer use

**Recommendation:** ✅ **KEEP** - Active infrastructure service

---

#### 5. `src/read-legacy.ts` ✅ KEEP

**Status:** Active  
**Lines:** 52  
**Usage Check:** ✅ Imported in `src/read.ts`

**Functionality:**
- Fetches legacy system references from `migration_lineage` table
- Used for data migration scenarios
- Enforces INV-LINEAGE-01 invariant (at most 1 row per afenda_id)

**Recommendation:** ✅ **KEEP** - Active migration infrastructure

---

## Archive Action Plan

### Step 1: Create Legacy Directory

```bash
mkdir -p packages/crud/src/_legacy/services
```

### Step 2: Move Files

```bash
# Move superseded outbox implementations
git mv packages/crud/src/services/search-outbox.ts packages/crud/src/_legacy/services/
git mv packages/crud/src/services/workflow-outbox.ts packages/crud/src/_legacy/services/
```

### Step 3: Add Archive Notice

Create `packages/crud/src/_legacy/README.md`:

```markdown
# Legacy CRUD Implementations

This directory contains superseded implementations preserved for historical reference.

## Archived Files

### services/search-outbox.ts
- **Archived:** February 19, 2026
- **Replaced By:** `outbox/write-outbox.ts`
- **Reason:** Unified outbox pattern (Phase 2)

### services/workflow-outbox.ts
- **Archived:** February 19, 2026
- **Replaced By:** `outbox/write-outbox.ts`
- **Reason:** Unified outbox pattern (Phase 2)

## Do Not Use

These files are **not imported** by any active code. They are preserved for:
- Historical reference
- Understanding architecture evolution
- Rollback scenarios (emergency only)

If you need outbox functionality, use `outbox/write-outbox.ts`.
```

### Step 4: Verify No Imports

```bash
# Verify no active imports (should return empty)
grep -r "search-outbox" packages/crud/src --exclude-dir=_legacy
grep -r "workflow-outbox" packages/crud/src --exclude-dir=_legacy
```

### Step 5: Update services/ Directory

After archival, `src/services/` will contain only:
- `webhook-dispatch.ts` (active delivery infrastructure)

Consider renaming to `src/delivery/` for clarity:
```bash
git mv packages/crud/src/services packages/crud/src/delivery
```

---

## Impact Assessment

### Files to Archive: 2
- `services/search-outbox.ts`
- `services/workflow-outbox.ts`

### Lines Removed from Active Codebase: 150

### Risk Level: ✅ **ZERO RISK**
- No active imports
- Completely superseded by unified implementation
- Functionality preserved in `outbox/write-outbox.ts`

### Build Impact: ✅ **NONE**
- Files not imported, not in build
- No TypeScript errors expected
- No test failures expected

### Documentation Impact: ✅ **MINIMAL**
- Add legacy README
- Update architecture docs to note archival (optional)

---

## Additional Cleanup Opportunities

### Opportunity 1: Rename services/ → delivery/

**Current:**
```
src/services/
└── webhook-dispatch.ts  (only remaining file)
```

**Proposed:**
```
src/delivery/
└── webhook-dispatch.ts
```

**Rationale:**
- More accurate naming (this is delivery layer, not generic services)
- Aligns with Plan → Commit → **Deliver** phase naming
- Clearer separation of concerns

**Effort:** 5 minutes (git mv + update import in internal.ts)

### Opportunity 2: Consolidate util/ Files

**Current:**
```
src/util/
├── cursor.ts       (3968 bytes - pagination)
├── envelope.ts     (888 bytes - ok/err helpers)
└── stable-hash.ts  (1475 bytes - outbox dedup)
```

**Analysis:**
- All files are actively used
- Small, focused utilities
- No consolidation needed

**Recommendation:** ✅ **KEEP AS IS**

---

## Files Analyzed (Summary)

| File | Status | Action | Reason |
|------|--------|--------|--------|
| `services/search-outbox.ts` | ❌ Superseded | Archive | Replaced by unified outbox |
| `services/workflow-outbox.ts` | ❌ Superseded | Archive | Replaced by unified outbox |
| `services/webhook-dispatch.ts` | ✅ Active | Keep | Delivery infrastructure |
| `read-delivery-note.ts` | ✅ Active | Keep | Relational read helper |
| `read-legacy.ts` | ✅ Active | Keep | Migration infrastructure |
| `util/cursor.ts` | ✅ Active | Keep | Pagination utility |
| `util/envelope.ts` | ✅ Active | Keep | Response helpers |
| `util/stable-hash.ts` | ✅ Active | Keep | Outbox dedup |

---

## Verification Checklist

Before archiving, verify:

- [ ] Run `grep -r "search-outbox" packages/crud/src` → No results
- [ ] Run `grep -r "workflow-outbox" packages/crud/src` → No results
- [ ] Run `pnpm --filter afenda-crud build` → Success
- [ ] Run `pnpm --filter afenda-crud test` → All passing
- [ ] Run `pnpm --filter ci-gates test` → All passing
- [ ] Create `_legacy/README.md` with archive notice
- [ ] Git commit with message: "chore(crud): archive superseded outbox implementations"

---

## Conclusion

**2 files ready for immediate archival** with zero risk:
1. `services/search-outbox.ts`
2. `services/workflow-outbox.ts`

Both files were superseded by the unified outbox pattern in Phase 2 (February 2026) and have no active imports in the codebase.

**Recommendation:** Execute archive action plan to maintain clean, production-ready codebase.

**Estimated Effort:** 10 minutes  
**Risk:** Zero  
**Benefit:** Cleaner codebase, clearer architecture
