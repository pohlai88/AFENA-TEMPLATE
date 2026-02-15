# ERP Refactor Implementation Audit

**Date:** 2026-02-16  
**Scope:** Audit of the implementation from the plan validation report.

---

## 1. map.ts

| Item | Status | Notes |
|------|--------|-------|
| inputsHash inputs | ✅ | rawRefactor, staged, analyze, mappingTable, policiesContent, overrides, spineDenylist |
| Timestamp stripping | ✅ | stripTimestamps excludes scannedAt, transformedAt, analyzedAt, mappedAt, generatedAt |
| adapterVersion | ✅ | getAdapterVersion() uses git rev-parse HEAD |
| MONEY_POLICY | ⚠️ | **Over-conversion:** All `float` fields are converted to bigint. Exchange rates, percentages (e.g. `reporting_currency_exchange_rate`) would be incorrectly converted. Consider: only convert when `fieldType === 'currency'` OR fieldname matches `/amount|price|total|balance|credit|debit/i`. |
| RESERVED_WORD_POLICY | ✅ | Applied; reservedWordsFromTable merged with entity.dbNameMap |
| FIELD_RENAMES | ⚠️ | **Duplication:** Hardcoded constant; `mapping.table.json` has `fieldRenames` but map.ts does not use it. New renames in mapping.table won't apply. |
| Override merge | ✅ | fields (by fieldname), ui, table.reservedWordMap |
| Override fields | ⚠️ | Only merges into *existing* fields. Override fields that don't exist in the candidate are ignored (may be intentional). |

---

## 2. utils.ts

| Item | Status | Notes |
|------|--------|-------|
| getAdapterVersion | ✅ | git rev-parse HEAD, fallback "unknown" |
| buildInputsHash | ✅ | All inputs; stripTimestamps for determinism |
| loadOverrides | ✅ | Reads overrides/*.override.json; silently skips invalid JSON |
| loadOverrides error handling | ⚠️ | Invalid JSON is swallowed. Consider logging a warning. |

---

## 3. analyze.ts

| Item | Status | Notes |
|------|--------|-------|
| loadTableRegistry | ✅ | Parses _registry.ts; matches `table: 'kind'` |
| loadRouteSegments | ✅ | Lists org/[slug] dirs |
| loadNavEntityTypes | ✅ | Regex `orgEntity(slug, 'entityType')` |
| loadHandlerRegistry | ✅ | Parses HANDLER_REGISTRY block; regex `\n\s+(\w+):\s+\w+` |
| Handler block boundary | ⚠️ | Block is `slice(start, start+2000)`. If HANDLER_REGISTRY grows, could include TABLE_REGISTRY. Both use same entityType keys (contacts, companies), so no false positives today. Consider finding closing `};` for robustness. |
| Collision keys | ✅ | entityType, tableName, route, handler, spine:db, spine:db+ui |

---

## 4. ci-adapter-gates.mjs

| Item | Status | Notes |
|------|--------|-------|
| N1 | ✅ | Runs pipeline twice with --entity video-settings; compares inputsHash |
| N1 scope | ⚠️ | Only validates video-settings. Other specs (e.g. account-category) are compared but not re-generated. If account-category exists from a prior full run, its hash is compared to itself (unchanged). Acceptable. |
| N2 | ✅ | afena meta validate |
| N3 | ✅ | No adopted specs for locked entityTypes |
| N3 spine parse | ✅ | Handles missing spine-denylist.json (skips) |

---

## 5. run.ts

| Item | Status | Notes |
|------|--------|-------|
| Entity filter | ✅ | Passed to adopt only; map runs for all entities |
| Map scope | ⚠️ | Map processes *all* staged entities; adopt filters. So spec-candidates.json contains all, but only filtered entity written. Correct. |

---

## 6. Contract / Spec

| Item | Status | Notes |
|------|--------|-------|
| video-settings.spec.json | ✅ | Valid; meta block present; adapterVersion is git SHA |
| reservedWordMap in spec | ✅ | Includes global reserved words from mapping.table (status, type, etc.) even when entity has none. Harmless. |

---

## 7. docs/adapter-pipeline.md

| Item | Status | Notes |
|------|--------|-------|
| Workflow | ✅ | Spec → entity-new → schema → registries → form |
| entity-new | ✅ | Correct: table name (video_settings), --skip-schema |
| Stages table | ✅ | Matches implementation |
| Overrides | ✅ | Documented |
| CI gates | ✅ | N1, N2, N3 documented |

---

## 8. Recommendations (Addressed 2026-02-16)

| Priority | Issue | Fix | Status |
|----------|-------|-----|--------|
| Medium | map.ts: Use mappingTable.fieldRenames | Merge with DEFAULT_FIELD_RENAMES | ✅ Done |
| Medium | map.ts: Float over-conversion | Only convert when currency OR (float + money fieldname) | ✅ Done |
| Low | loadHandlerRegistry: Block boundary | Parse to closing `};` via brace counting | ✅ Done |
| Low | loadOverrides: Silent skip | Log warning on parse failure | ✅ Done |

Additional: reportByEntity Map for O(1) lookup; override can add new fields.

---

## 9. Summary

**Implemented correctly:** inputsHash, adapterVersion, policies (reserved words), overrides, route/handler collision, CI N1/N2/N3, docs.

**Minor issues:** fieldRenames not read from mapping.table; float→bigint over-conversion; handler block boundary; silent override parse errors.

**No critical bugs** — pipeline runs and gates pass.
