# Bulk Insert Audit

Phase 2C: Audit of handlers that insert records in loops. Candidates for batch insert optimization.

---

## Candidate Files

### 1. `packages/crud/src/services/revenue-recognition.ts` ✅ Done 2026-02-16

| Field | Value |
|-------|-------|
| **Pattern** | ~~Loop insert~~ → Batch: `tx.insert(revenueScheduleLines).values(schedule.lines.map(...))` |
| **Location** | `createRevenueSchedule()` |
| **Table** | `revenue_schedule_lines` |
| **Typical volume** | 1–60 lines per schedule (monthly recognition over contract term) |
| **Impact** | Medium — N round-trips → 1 for multi-period schedules |

---

### 2. `packages/crud/src/services/landed-cost-engine.ts` ✅ Done 2026-02-16

| Field | Value |
|-------|-------|
| **Pattern** | ~~Loop insert~~ → Batch: `tx.insert(landedCostAllocations).values(batch)` |
| **Location** | `allocateLandedCost()` |
| **Table** | `landed_cost_allocations` |
| **Typical volume** | 5–50 lines per receipt (depends on PO line count) |
| **Impact** | Medium — single insert for typical receipts |

---

### 3. `packages/crud/src/services/custom-field-sync.ts` ✅ Done 2026-02-16

| Field | Value |
|-------|-------|
| **Pattern** | ~~Loop upsert~~ → Batch delete + batch upsert |
| **Location** | `syncCustomFieldValues()` |
| **Table** | `custom_field_values` |
| **Typical volume** | 5–30 fields per entity |
| **Impact** | Low–Medium — single delete + single upsert per entity |

---

### 4. `packages/crud/src/services/depreciation-engine.ts`

| Field | Value |
|-------|-------|
| **Pattern** | Single insert per call; caller may invoke in loop for multiple assets |
| **Location** | `calculateDepreciation()` line 236 |
| **Table** | `depreciation_schedules` |
| **Typical volume** | 1 insert per asset per fiscal period; batch jobs may process 100+ assets |
| **Proposed batch shape** | If a batch depreciation job exists, collect `(assetId, fiscalPeriodId, ...)` for all assets, then `tx.insert(depreciationSchedules).values(batch)`. Requires refactoring the caller (e.g. fiscal-close job) to batch. |
| **Estimated impact** | Low — single insert per asset is acceptable; batch only if fiscal-close processes many assets |

---

### 5. `packages/crud/src/services/intercompany.ts`

| Field | Value |
|-------|-------|
| **Pattern** | `generateEliminationEntries()` returns in-memory entries; caller journals. No loop insert in this file. |
| **Location** | N/A |
| **Note** | `createIntercompanyTransaction` is single insert. `markEliminated` uses batch update. No change needed. |

---

### 6. `packages/crud/src/metering.ts`

| Field | Value |
|-------|-------|
| **Pattern** | Multiple single inserts: `meterApiRequest`, `meterJobRun`, etc. each do one insert to `org_usage_daily` |
| **Location** | Lines 29, 52, 75, 98 |
| **Table** | `org_usage_daily` |
| **Typical volume** | 1 insert per meter event; high throughput possible |
| **Proposed batch shape** | Buffer events in memory, flush every N seconds or N events. Single `insert(orgUsageDaily).values(batch)` per flush. |
| **Estimated impact** | Medium — reduces write load under high API traffic |

---

## Summary

| Priority | File | Effort | Impact | Status |
|----------|------|--------|--------|--------|
| 1 | revenue-recognition.ts | Low | Medium | ✅ Done |
| 2 | landed-cost-engine.ts | Low | Medium | ✅ Done |
| 3 | custom-field-sync.ts | Medium | Low–Medium | ✅ Done |
| 4 | metering.ts | Medium | Medium (high traffic) | Deferred |
| 5 | depreciation-engine.ts | Low (caller change) | Low | Deferred |

---

## Next Steps

1. Implement batch insert in `revenue-recognition.ts` (highest ROI, low effort).
2. Implement batch insert in `landed-cost-engine.ts`.
3. Evaluate metering buffer if API traffic grows.
4. Defer depreciation-engine until batch fiscal-close exists.
