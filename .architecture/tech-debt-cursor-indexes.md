# Tech Debt: Cursor Pagination Index Optimization

**Created:** 2026-02-15  
**Priority:** P2 (Performance optimization, not correctness issue)  
**Status:** Complete — all tables done (migrations 0054_spotty_zombie, 0056_cursor_index_optimization)

---

## Problem

Cursor pagination currently works correctly but uses partial indexes that cause performance degradation at scale.

**Current indexes:**
```sql
-- contacts
CREATE INDEX contacts_org_created_idx ON contacts (org_id, created_at);

-- Other tables with cursor pagination potential
CREATE INDEX audit_logs_org_created_idx ON audit_logs (org_id, created_at);
CREATE INDEX communications_org_created_idx ON communications (org_id, created_at);
-- ... (see migration files for full list)
```

**Issue:** Missing `id` column in composite index forces Postgres to:
1. Use index for `(org_id, created_at)` lookup
2. Scan matching rows **in memory** to apply `id < cursor.id` tie-breaker
3. Performance degrades when many rows share the same `createdAt` timestamp

---

## Recommended Solution

Add `id` to all cursor-enabled indexes:

```sql
-- contacts (most critical - user-facing lists)
DROP INDEX contacts_org_created_idx;
CREATE INDEX contacts_org_created_id_idx 
  ON contacts (org_id, created_at DESC, id DESC);

-- audit_logs (admin/compliance views)
DROP INDEX audit_logs_org_created_idx;
CREATE INDEX audit_logs_org_created_id_idx 
  ON audit_logs (org_id, created_at DESC, id DESC);

-- communications (activity feeds)
DROP INDEX comms_org_created_idx;
CREATE INDEX comms_org_created_id_idx 
  ON communications (org_id, created_at DESC, id DESC);

-- Add similar for: sales_orders, purchase_orders, quotations, etc.
```

---

## Impact Assessment

**Performance impact:**
- **Without optimization:** O(n) memory scan where n = rows with same `createdAt`
- **With optimization:** O(1) index seek regardless of timestamp collisions
- **Real-world:** Matters when 10+ rows share same timestamp (bulk imports, automated processes)

**Correctness impact:**
- ✅ None - cursor pagination works correctly with or without optimized indexes
- Query results are identical, only performance differs

**Index size impact:**
- Minimal - adding UUID column to existing index
- Estimate: ~10-15% larger index size per table

---

## When to Implement

**Triggers:**
1. UI adoption shows cursor pagination is actively used (infinite scroll deployed)
2. Performance monitoring shows slow list queries (p95 > 500ms)
3. Customer reports of "slow loading" on list pages
4. Bulk data imports create timestamp collision hotspots

**Don't implement if:**
- Cursor pagination not yet used in production UI
- Tables have < 10k rows per org
- No user complaints about list performance

---

## Migration Strategy

**Phase 1: Add indexes (zero downtime)**
```sql
-- Create new index (CONCURRENTLY to avoid locks)
CREATE INDEX CONCURRENTLY contacts_org_created_id_idx 
  ON contacts (org_id, created_at DESC, id DESC);

-- Verify new index is used
EXPLAIN ANALYZE 
  SELECT * FROM contacts 
  WHERE org_id = 'test' AND created_at < NOW() 
  ORDER BY created_at DESC, id DESC 
  LIMIT 50;
```

**Phase 2: Drop old indexes (after verification)**
```sql
-- Only after confirming new index is used
DROP INDEX CONCURRENTLY contacts_org_created_idx;
```

**Rollback plan:**
- Old index remains until new index verified
- Can drop new index and keep old if issues arise

---

## Affected Tables

Tables with `(org_id, created_at)` indexes that support cursor pagination:

- [x] `contacts` - **HIGH priority** ✅ Done 2026-02-16 (contacts_org_created_id_idx)
- [x] `audit_logs` - MEDIUM priority ✅ Done 0056 (audit_logs_org_created_id_idx)
- [x] `communications` - MEDIUM priority ✅ Done 0056 (comms_org_created_id_idx)
- [x] `companies` - MEDIUM priority ✅ Done 0056 (companies_org_created_id_idx)
- [x] `advisories` - LOW priority ✅ Done 0056 (advisories_org_created_id_idx)
- [x] `advisory_evidence` - LOW priority ✅ Done 0056 (advisory_evidence_org_created_id_idx)
- [x] `sites` - LOW priority ✅ Done 0056 (sites_org_created_id_idx)
- [x] `workflow_executions` - LOW priority ✅ Done 0056 (workflow_executions_org_created_id_idx)
- [ ] `sales_orders` - Deferred (has so_org_customer_created_idx; different filter pattern)
- [ ] `purchase_orders` - Deferred (has po_org_supplier_created_idx; different filter pattern)
- [ ] `quotations` - Deferred (has qtn_org_party_created_idx; different filter pattern)

**Recommendation:** Start with `contacts` only, measure impact, then expand.

---

## Validation

After migration, verify with `EXPLAIN ANALYZE`:

```sql
-- Should show Index Scan using contacts_org_created_id_idx
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM contacts 
WHERE org_id = $1 
  AND (created_at < $2 OR (created_at = $2 AND id < $3))
ORDER BY created_at DESC, id DESC 
LIMIT 51;
```

**Success criteria:**
- Query plan uses new composite index
- No "Sort" or "Filter" steps in plan
- Execution time < 50ms for 100k rows

---

## References

- Phase 2B Implementation: `.cursor/plans/db.architecture.md` line 835
- Drizzle ORM Guide: https://orm.drizzle.team/docs/guides/cursor-based-pagination
- Cursor implementation: `packages/crud/src/cursor.ts`
- Integration tests: `packages/crud/src/__tests__/list-entities.integration.test.ts`

---

## Decision Log

**2026-02-15:** Created during Phase 2B completion. Deferred to post-UI-adoption based on:
1. Cursor pagination not yet used in production UI
2. Correctness unaffected (performance-only optimization)
3. No current performance complaints
4. Index can be added later without code changes
