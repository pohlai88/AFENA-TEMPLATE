# ERP Refactor Adoption Strategy — Plan Validation Report

**Plan:** `erp_refactor_adoption_strategy_5eca0f83.plan.md`  
**Date:** 2026-02-16  
**Scope:** Compare ratified plan against AFENDA-NEXUS codebase; identify gaps and improvement potential.

**Update 2026-02-16:** Implemented missing/partial items. See implementation summary at end.

---

## 1. Implemented vs Plan

| Plan Section | Status | Implementation Path |
|--------------|--------|----------------------|
| LocalEntitySpec contract (Zod + TENANCY-01, MAP-01) | ✅ | `packages/canon/src/contracts/local-entity-spec.contract.ts` |
| Specs output | ✅ | `packages/canon/src/specs/entities/<entityType>.spec.json` |
| Adapter config (mapping, policies, spine-denylist) | ✅ | `packages/canon/src/adapters/erpnext/` |
| 6-stage CLI (scan, transform, analyze, map, adopt, run, validate) | ✅ | `tools/afena-cli/src/meta/adapter/*.ts` |
| CI gates (N2 + spine-denylist) | ⚠️ Partial | `tools/ci-adapter-gates.mjs` — N1, N3, N4 deferred |
| Pilot video-settings (spec + form config) | ⚠️ Partial | Spec + form.config exist; no ENTITY_TYPES, handler, nav, pages |
| Spec meta block | ✅ | `adapterVersion`, `inputsHash`, `generatedAt`, `source.*` present |
| Local snapshot (Stage 1) | ✅ | `ENTITY_TYPES`, `TABLE_REGISTRY`, `RLS_TABLES`, spine denylist |
| Name→slug rule | ✅ | `transform.ts` uses `nameToSlug()` |
| manifest dbNameMap | ✅ | Scan reads manifest; transform uses `manifestDbNameMap` |

---

## 2. Missing Parts

### 2.1 Overrides Directory and Merge Logic

**Plan §1:** `overrides/<entityType>.override.json` in `adapters/erpnext/`.

**Reality:** No `overrides/` directory exists. `map.ts` and `adopt.ts` do not read or merge overrides.

**Impact:** Cannot override field mappings, labels, or UI config per entity without editing the pipeline.

**Recommendation:** Add `packages/canon/src/adapters/erpnext/overrides/` and merge logic in `map.ts` before emitting candidates. Include overrides in `inputsHash`.

---

### 2.2 Collision Keys: Route and Handler

**Plan §3a:** Collision types include `entityType`, `tableName`, `route`, `handler`.

**Reality:** `analyze.ts` checks only:
- `entityType` (ENTITY_TYPES)
- `tableName` (TABLE_REGISTRY)
- `spine:db` / `spine:db+ui`

**Missing:**
- **route** — `/org/[slug]/${entityType}` directory or nav config
- **handler** — HANDLER_REGISTRY binding for entityType/table

**Recommendation:** Extend `analyze.ts` to:
1. Scan `apps/web/app/(app)/org/[slug]/` for route segments.
2. Parse `packages/crud/src/mutate.ts` (or equivalent) for HANDLER_REGISTRY keys.

---

### 2.3 CI Gates N1, N3, N4

**Plan:** N1 (determinism), N2 (contract), N3 (spine lock), N4 (drift).

**Reality:** Only N2 (contract via `afena meta validate`) and spine-denylist validity are implemented.

| Gate | Plan | Implemented |
|------|------|--------------|
| N1 | Run pipeline twice, compare `inputsHash` | Deferred |
| N2 | Specs satisfy LocalEntitySpec | ✅ |
| N3 | Locked entities must not have DB/UI artifacts | Deferred |
| N4 | Drizzle schema must match spec | Deferred |

**Recommendation:** Prioritize N1 (determinism) and N3 (spine lock) before scaling adoption.

---

### 2.4 Pilot Full Definition of Done

**Plan §9:** video-settings must have:
1. Spec + validate ✅
2. ENTITY_TYPES ❌
3. HANDLER_REGISTRY + TABLE_REGISTRY ❌
4. Nav + pages ❌
5. Form (config-driven or hand-written) ⚠️ form.config exists; no page/layout

**Reality:**
- `video-settings` is not in `ENTITY_TYPES` (packages/canon/src/types/entity.ts).
- Not in `HANDLER_REGISTRY` or `TABLE_REGISTRY` (packages/crud/src/mutate.ts).
- Not in `NAV_ITEMS` (nav-config.ts).
- No `page.tsx` or `layout.tsx` under `video-settings/` — only `_components/form.config.ts`.

**Recommendation:** Either complete pilot registration (entity-new or manual) or document that pilot is “spec + form config only” until Phase 4.

---

### 2.5 policies.ts Not Used in Map

**Plan:** Stage 5 applies mapping table + policies.

**Reality:** `map.ts` uses `mapping.table.json` and hardcoded `FIELD_RENAMES`. It does not import or apply `policies.ts` (TENANCY_POLICY, MONEY_POLICY, DOCSTATUS_POLICY, NAMING_POLICY, RESERVED_WORD_POLICY).

**Impact:** Policy changes (e.g. money→bigint) are not enforced by the pipeline; they are only documented.

**Recommendation:** Import policies in `map.ts` and apply them (e.g. money fields → bigint, reserved words → suffix).

---

### 2.6 inputsHash Incomplete

**Plan §9a:** `inputsHash` = hash of canon + manifest + mapping + policies + overrides + denylist.

**Reality:** `map.ts` hashes only `{ staged, analyze, mappingTable }`. It omits:
- Raw canon files
- manifest
- policies
- overrides
- spine-denylist

**Impact:** `inputsHash` does not change when policies or denylist change; Gate N1/N4 would be unreliable.

**Recommendation:** Extend hash to include all inputs listed in plan §9a.

---

### 2.7 adapterVersion = "stub"

**Plan §9a:** `adapterVersion` = Git SHA or semver.

**Reality:** Hardcoded `"stub"` in `map.ts`.

**Recommendation:** Use `git rev-parse HEAD` or package version at build/run time.

---

### 2.8 entity-new Integration

**Plan §4:** After adopt, run `entity-new` with table name; `--skip-schema` exists for manual schema.

**Reality:** `entity-new.ts` supports `--skip-schema`. No documented workflow linking spec adoption → entity-new. Plan says entity-new expects **table name** (snake plural), not entityType.

**Recommendation:** Add a short doc or script that: 1) adopt writes spec, 2) run `pnpm db:entity-new video_settings --skip-schema` (or equivalent), 3) align schema manually if needed.

---

### 2.9 FormConfigRenderer / Config-Driven Form

**Plan §5:** Phase 4 = FormConfigRenderer or extended EntityFormShell that consumes form config.

**Reality:** `form.config.ts` exists for video-settings. No `FormConfigRenderer` or EntityFormShell extension that reads this config. Plan allows hand-written form for pilot.

**Recommendation:** Track as Phase 4; pilot can remain hand-written until config-driven renderer exists.

---

## 3. Improvement Opportunities

| Area | Current | Improvement |
|------|---------|--------------|
| **Error handling** | Pipeline throws on missing files | Add clear error messages with suggested fix (e.g. "Run afena meta scan first") |
| **Determinism** | inputsHash excludes key inputs | Include canon, manifest, mapping, policies, overrides, denylist |
| **Spine lock enforcement** | N3 deferred | Add check: locked entityTypes must not appear in TABLE_REGISTRY or route dirs |
| **Route collision** | Not checked | Scan `org/[slug]/` dirs and nav config |
| **Handler collision** | Not checked | Parse HANDLER_REGISTRY from crud |
| **Override support** | None | Add overrides dir + merge in map |
| **Policy application** | policies.ts unused | Apply in map (money, reserved words, etc.) |
| **adapterVersion** | "stub" | Use git SHA or semver |
| **Documentation** | Scattered | Add `docs/adapter-pipeline.md` with workflow and entity-new integration |

---

## 4. Summary

| Category | Count |
|----------|-------|
| Fully implemented | 9 |
| Partially implemented | 3 |
| Missing | 9 |

**Critical gaps:** Overrides, route/handler collision checks, N1/N3/N4 gates, pilot full DoD, policies application, complete inputsHash.

**Quick wins:** Extend inputsHash, use git SHA for adapterVersion, apply policies in map, add overrides directory (even if empty initially).

---

## 5. Implementation Summary (2026-02-16)

| Gap | Status |
|-----|--------|
| inputsHash extended | ✅ Includes rawRefactor, staged, analyze, mappingTable, policiesContent, overrides, spineDenylist; timestamps stripped for determinism |
| adapterVersion | ✅ Uses git SHA via `getAdapterVersion()` |
| policies.ts in map | ✅ MONEY_POLICY (currency→bigint), RESERVED_WORD_POLICY (reserved words) applied |
| overrides/ + merge | ✅ `packages/canon/src/adapters/erpnext/overrides/`; map merges fields, ui, table.reservedWordMap |
| route + handler collision | ✅ analyze.ts checks route segments, nav entityTypes, HANDLER_REGISTRY |
| CI N1, N3 | ✅ N1: run pipeline twice (video-settings), compare inputsHash; N3: no adopted specs for locked entityTypes |
| entity-new workflow | ✅ `docs/adapter-pipeline.md` |
