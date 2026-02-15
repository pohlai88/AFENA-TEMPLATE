# Bulk Insert Audit

Phase 2C: Audit of handlers that insert records in loops. Candidates for batch insert optimization.

---

## Candidate Files

### 1. `packages/crud/src/services/revenue-recognition.ts`

| Field | Value |
|-------|-------|
| **Pattern** | Loop insert: `for (const line of schedule.lines) { await tx.insert(revenueScheduleLines).values(...) }` |
| **Location** | `createRevenueSchedule()` lines 153–163 |
| **Table** | `revenue_schedule_lines` |
| **Typical volume** | 1–60 lines per schedule (monthly recognition over contract term) |
| **Proposed batch shape** | `tx.insert(revenueScheduleLines).values(schedule.lines.map(l => ({ orgId, scheduleId: header.id, periodDate: l.periodDate, amountMinor: l.amountMinor, status: 'pending' })))` |
| **Estimated impact** | Medium — reduces N round-trips to 1 for multi-period schedules |

---

### 2. `packages/crud/src/services/landed-cost-engine.ts`

| Field | Value |
|-------|-------|
| **Pattern** | Loop insert: `for (const [receiptLineId, allocatedCostMinor] of allocationMap) { await tx.insert(landedCostAllocations).values(...) }` |
| **Location** | `allocateLandedCost()` lines 169–184 |
| **Table** | `landed_cost_allocations` |
| **Typical volume** | 5–50 lines per receipt (depends on PO line count) |
| **Proposed batch shape** | `tx.insert(landedCostAllocations).values([...allocationMap.entries()].filter(([, amt]) => amt > 0).map(([receiptLineId, allocatedCostMinor]) => ({ orgId, landedCostDocId, receiptLineId, allocationMethod: method, allocatedCostMinor, currencyCode, baseAllocatedCostMinor: Math.round(allocatedCostMinor * fxRate) })))` |
| **Estimated impact** | Medium — single insert for typical receipts |

---

### 3. `packages/crud/src/services/custom-field-sync.ts`

| Field | Value |
|-------|-------|
| **Pattern** | Loop upsert: `for (const def of fieldDefs) { await db.insert(customFieldValues).values(...).onConflictDoUpdate(...) }` |
| **Location** | `syncCustomFieldValues()` lines 40–91 |
| **Table** | `custom_field_values` |
| **Typical volume** | 5–30 fields per entity |
| **Proposed batch shape** | Use `db.insert(customFieldValues).values(batch).onConflictDoUpdate(...)` — Drizzle supports multi-row upsert. Build batch from fieldDefs, then single upsert. |
| **Estimated impact** | Low–Medium — entities with many custom fields benefit |

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

| Priority | File | Effort | Impact |
|----------|------|--------|--------|
| 1 | revenue-recognition.ts | Low | Medium |
| 2 | landed-cost-engine.ts | Low | Medium |
| 3 | custom-field-sync.ts | Medium | Low–Medium |
| 4 | metering.ts | Medium | Medium (high traffic) |
| 5 | depreciation-engine.ts | Low (caller change) | Low |

---

## Next Steps

1. Implement batch insert in `revenue-recognition.ts` (highest ROI, low effort).
2. Implement batch insert in `landed-cost-engine.ts`.
3. Evaluate metering buffer if API traffic grows.
4. Defer depreciation-engine until batch fiscal-close exists.
