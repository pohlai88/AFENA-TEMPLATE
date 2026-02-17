# ERP Refactor Adapter Pipeline

Adopt ERP doctypes from `.PRD/erp-refactor/v3/canon/` into LocalEntitySpec and wire entities.

## Workflow: Spec → Entity

1. **Adopt spec** — Run the pipeline for the target entity:
   ```bash
   pnpm afenda:dev meta run --entity video-settings
   ```
   This writes `packages/canon/src/specs/entities/video-settings.spec.json`.

2. **Scaffold entity** — Use `entity-new` with the **table name** (snake plural):
   ```bash
   cd packages/database && npx tsx src/scripts/entity-new.ts video_settings --skip-schema
   ```
   - `entity-new` expects the table name (`video_settings`), not the entityType (`video-settings`).
   - `--skip-schema` skips Drizzle schema generation when the table already exists or you will align schema manually from the spec.

3. **Align schema** — If using `--skip-schema`, create or update the schema file to match the spec:
   - Use `table.name` from spec (e.g. `video_settings`).
   - Add columns per `spec.fields` with `dbName` and `fieldType`.
   - Ensure `org_id`, `id`, `created_at`, `updated_at`, `version`, `is_deleted` (TENANCY-01).

4. **Wire registries** — `entity-new` auto-wires:
   - `ENTITY_TYPES` (canon)
   - `HANDLER_REGISTRY` (crud)
   - `TABLE_REGISTRY` (crud)
   - Nav items and pages (web)

5. **Form config** — Add `form.config.ts` under `apps/web/app/(app)/org/[slug]/<entityType>/_components/` to match spec `ui.order` and field defs.

## Naming Convention

- **entityType:** Plural slug (`sales-orders`, `video-settings`). Doctype "Sales Order" → `sales-orders`.
- **tableName:** Snake plural (`sales_orders`, `video_settings`). Derived from entityType.
- **fieldName:** Snake (`enable_youtube_tracking`).

Words like `settings`, `defaults`, `config` are not pluralized.

## Pipeline Stages

| Stage | Command | Output |
|-------|---------|--------|
| 1 | `afenda meta scan` | `.afenda/meta/raw/refactor.entities.json`, `local.contract.snapshot.json` |
| 2 | `afenda meta transform` | `.afenda/meta/staged/transformed.entities.json` |
| 3 | `afenda meta analyze` | `.afenda/meta/reports/analyze.json` |
| 5 | `afenda meta map` | `.afenda/meta/staged/spec-candidates.json` |
| 6 | `afenda meta adopt` | `packages/canon/src/specs/entities/*.spec.json` |

Full pipeline: `afenda meta run [--entity <entityType>] [--dry-run]`

Use `--dry-run` to run through map only (no spec writes). Outputs: `.afenda/meta/reports/analyze.json`, `.afenda/meta/staged/spec-candidates.json`. See `.afenda/meta/DRY-RUN-REPORT.md` for analysis.

## Overrides

Place `packages/canon/src/adapters/erpnext/overrides/<entityType>.override.json` to override:
- `fields` — per-field overrides (label, dbName, etc.)
- `ui` — groups, order, dependsOn
- `table.reservedWordMap` — additional column mappings

## CI Gates

- **N1** — Spec determinism (run pipeline twice, compare `inputsHash`)
- **N2** — Contract compliance (`afenda meta validate`)
- **N3** — Spine lock (no adopted specs for locked entityTypes)
