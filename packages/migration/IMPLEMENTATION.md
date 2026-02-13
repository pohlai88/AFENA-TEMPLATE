# Migration Engine Implementation Progress

## Status: Complete (Ratification-Grade + Fully Wired)

All 4 surgical fixes, 2 correctness nits, 4 CI seal stamps, and full crud kernel integration.

### Completed

✅ **Package Scaffolding**

- `package.json` — catalog deps, workspace refs, eslint/tsconfig configs
- `tsconfig.json` — extends `afena-typescript-config/react-library.json`, composite: true
- `tsconfig.build.json` — tsup escape hatch (composite: false)
- `tsup.config.ts` — cjs+esm, dts, sourcemap
- `eslint.config.js` — baseConfig from `afena-eslint-config/base`

✅ **Core Types** (`src/types/`)

- `cursor.ts` — Cursor discriminated union (offset, id, composite, token)
- `legacy-key.ts` — LegacyKey interface
- `migration-job.ts` — MigrationJob, MigrationContext, MigrationResult, SourceConfig, etc.
- `upsert-plan.ts` — UpsertPlan, UpsertAction, LoadResult, MergeEvidence
- `query.ts` — Query, LegacyFilter, LegacySchema, LegacyColumnKey

✅ **Fix 1: Lineage State Machine** (`src/pipeline/`)

- `pipeline-base.ts` — MigrationPipelineBase (Template Method)
  - `PipelineDb` interface — DB abstraction (no Drizzle stubs)
  - `reserveLineage()` — INSERT … ON CONFLICT DO NOTHING RETURNING
  - `reclaimStaleReservation()` — single-statement UPDATE … RETURNING (D0.1)
  - `commitLineage()` — state transition reserved → committed
  - `deleteReservation()` — by lineageId only (D0.2)

✅ **Fix 2: Structural Identifiers** (`src/adapters/query-builder.ts`)

- `QueryBuilder` interface with `setLegacySchema()`
- `PostgresQueryBuilder` — composite cursor, `$N` params, `"` quoting
- `MySqlQueryBuilder` — composite cursor, `?` params, `` ` `` quoting
- `CsvQueryBuilder` — offset cursor, Nit A: `extractCursor(rows, batchSize, prevCursor)`
- Field validation against introspected legacy schema

✅ **Fix 3: Entity-Agnostic Conflict Detection** (`src/strategies/`)

- `ConflictDetector` interface with `matchKeys` + `detectBulk()`
- `DetectorQueryFn` — injected bulk query function (no direct DB imports)
- `ContactsConflictDetector` — email(+40) + phone(+20) scoring, bulk lookup via queryFn
- `InvoicesConflictDetector` — invoiceNumber(+50) + vendorId(+40) scoring
- `ProductsConflictDetector` — SKU exact match (score 100)
- `NoConflictDetector` — fallback (lineage-only)
- `CONFLICT_DETECTOR_REGISTRY` — total, exhaustive, entity-type validated

✅ **Fix 4: Canonized Write-Shape Snapshots** (`src/adapters/entity-write-adapter.ts`)

- `ENTITY_WRITABLE_CORE_FIELDS` — kernel-owned SSOT per entity type
- `CanonEntityWriteAdapter` — `toWriteShape()` picks only canonized fields
- `ENTITY_WRITE_ADAPTER_REGISTRY` — total registry

✅ **Transforms** (`src/transforms/`)

- `TransformChain` — ordered by `step.order`, coercion always last (DET-05)
- Steps: TrimWhitespace(10), NormalizeWhitespace(20), PhoneNormalize(30), EmailNormalize(40), TypeCoercion(100)
- `buildStandardTransformChain()` factory

✅ **Gates** (`src/gates/`)

- `PreflightGateChain` / `PostflightGateChain` — distinct types, short-circuit on failure

✅ **Audit** (`src/audit/`)

- `canonicalStringify()` — deep-sorted keys, stable arrays, no whitespace (AUD-06)
- `hashCanonical()` — SHA-256 of canonical JSON
- `buildSignedReport()` — fingerprints for source schema, mappings, transforms, strategy
- Nit B: `mergeEvidenceIds` / `manualReviewIds` are job-scoped

✅ **Database Schema — Raw SQL** (`packages/database/drizzle/0008_migration_tables.sql`)

- migration_jobs, migration_lineage (state machine + constraints), migration_row_snapshots
- migration_conflicts, migration_conflict_resolutions, migration_reports
- RLS policies for tenant isolation

✅ **Database Schema — Drizzle ORM** (`packages/database/src/schema/`)

- `migration-jobs.ts` — migrationJobs table with status/strategy CHECK constraints
- `migration-lineage.ts` — migrationLineage with state machine, state-dependent nullability, partial index
- `migration-row-snapshots.ts` — migrationRowSnapshots with before_write_core/custom split
- `migration-conflicts.ts` — migrationConflicts with confidence/resolution CHECKs
- `migration-conflict-resolutions.ts` — migrationConflictResolutions with job_id denormalized (Nit B)
- `migration-reports.ts` — migrationReports with join-based RLS to migration_jobs
- All exported from `packages/database/src/schema/index.ts`

✅ **Concrete Pipeline** (`src/pipeline/`)

- `drizzle-pipeline-db.ts` — DrizzlePipelineDb implements PipelineDb using Drizzle ORM
  - insertLineageReservation → INSERT … ON CONFLICT DO NOTHING RETURNING
  - reclaimStaleReservation → single-statement UPDATE … RETURNING (D0.1)
  - commitLineage → state transition reserved → committed
  - deleteReservation → by lineageId only (D0.2)
- `sql-migration-pipeline.ts` — SqlMigrationPipeline extends MigrationPipelineBase
  - Hardening 1: Bulk lineage prefetch + bulk conflict detection (no N+1)
  - Hardening 2: Reservation-first create pattern (concurrency-safe)
  - Hardening 4: captureSnapshot via write-shape adapter (core/custom separated)
  - Transform chain integration with field data types
  - Preflight/postflight gate chains
  - **Wired**: extractBatch → LegacyAdapter (SQL/CSV)
  - **Wired**: loadPlan create → CrudBridge.mutate() with idempotencyKey
  - **Wired**: loadPlan update/merge → CrudBridge.mutate() with optimistic lock
  - **Wired**: captureSnapshot → CrudBridge.readRawRow()
  - **Wired**: merge evidence → migration_conflict_resolutions table
- `crud-bridge.ts` — CrudBridge interface (loosely coupled to afena-crud)
  - `CrudMutateFn` — simplified mutate signature for migration use
  - `ReadRawRowFn` — raw DB row reads for snapshot capture
  - `buildCrudBridge()` — factory with usage example
- `rollback-engine.ts` — RollbackEngine for restoring from write-shape snapshots
  - Phase 1: Delete newly created records (reverse lineage) via CrudBridge
  - Phase 2: Restore updated records from before_write_core + before_write_custom
  - Reads current version for optimistic lock before delete
  - Marks job as rolled_back, cleans up lineage

✅ **Legacy Source Adapters** (`src/adapters/`)

- `legacy-adapter.ts` — LegacyAdapter interface + SqlLegacyAdapter
  - Read-only connection pool with query timeouts
  - Table allowlist (prevents SQL injection)
  - Schema introspection via information_schema
  - Pluggable pool factory (`setLegacyPoolFactory()`) — no direct pg/mysql2 dep
- `csv-adapter.ts` — CsvLegacyAdapter
  - Accepts pre-parsed rows (caller handles CSV parsing)
  - Offset-based cursor pagination
  - Schema introspection from first row

✅ **Worker** (`src/worker/`)

- `job-executor.ts` — JobExecutor orchestrates full migration lifecycle
  - Mark running → extract batches → transform → plan → load → report → mark completed
  - Checkpoint cursor saved after each batch (resumable)
  - Max runtime enforcement (graceful exit)
  - Signed report generation at completion
- `rate-limiter.ts` — RateLimiter (token bucket)
  - Configurable rate per second + max burst
  - Async acquire with automatic refill

✅ **CI Seal Stamps + Tests** (8 test files, 44 assertions)

- `RES-01` — No zombie reservations (5 tests)
- `SQL-02` — QueryBuilder rejects unknown columns (4 tests)
- `DET-03` — ConflictDetector registry is total (5 tests)
- `SNAP-04` — Snapshot contains only writable fields (6 tests)
- `DET-05` — Transform steps execute in monotonic order (5 tests)
- `AUD-06` — Canonical JSON hashing + signed report fingerprints (6 tests)
- `csv-adapter` — CsvLegacyAdapter pagination + schema + health (9 tests)
- `rate-limiter` — Token bucket burst + throttle + refill (4 tests)

✅ **Integration**

- Root `tsconfig.json` references updated
- `pnpm install` — clean
- `pnpm --filter afena-migration build` — CJS + ESM + DTS (58KB CJS, 54KB ESM, 30KB DTS)
- `pnpm --filter afena-migration type-check` — clean
- `pnpm --filter afena-database type-check` — clean
- `vitest run` — 44/44 tests pass

## Design Decisions

- **D0.1**: Reclaim is a single-statement UPDATE (no SELECT+UPDATE race)
- **D0.2**: Reservations deleted only by lineageId (never by composite key)
- **PipelineDb interface**: Abstracts Drizzle behind a clean interface; DrizzlePipelineDb is concrete impl
- **Total registries**: Both conflict detectors and write adapters must cover every entity type
- **Drizzle version alignment**: migration package uses same `@neondatabase/serverless@^1.0.0` as database package to avoid duplicate drizzle-orm instances
- **Pluggable pool factory**: SqlLegacyAdapter uses `setLegacyPoolFactory()` to avoid direct pg/mysql2 dependency
- **Separated RateLimiter**: Extracted to own file to avoid DATABASE_URL requirement in unit tests
- **CrudBridge pattern**: Pipeline and RollbackEngine use injected CrudBridge (not direct afena-crud imports)
- **DetectorQueryFn injection**: Conflict detectors receive bulk query function at runtime
- **Graceful fallback**: All wired connections fall back to no-op when bridge/adapter not provided (testable without DB)
