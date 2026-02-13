Understood. Here are **ratification-grade, drop-in patchsets for BOTH DB layers** (Drizzle schema + SQL migrations) with **atomicity guarantees**, **tight SQL contracts**, **canonized writable fields**, and the **4 CI seal stamps**. Pick whichever matches your repo — you can apply either set without ambiguity.

---

# A) Drizzle-First Patchset (schema files + generated SQL migration)

## A1) DB schema: `migration_lineage` state machine + lease + constraints

### `packages/database/src/schema/migration-lineage.ts` (new or updated)

```ts
import { pgTable, text, uuid, timestamp, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const migrationLineage = pgTable(
  'migration_lineage',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    orgId: text('org_id').notNull(),
    migrationJobId: uuid('migration_job_id').notNull(),

    entityType: text('entity_type').notNull(),
    legacyId: text('legacy_id').notNull(),
    legacySystem: text('legacy_system').notNull(),

    // NOTE: must become nullable for reserved state
    afenaId: uuid('afena_id'),

    // State machine
    state: text('state').notNull().default('committed'), // 'reserved' | 'committed'
    reservedAt: timestamp('reserved_at', { withTimezone: true }),
    reservedBy: text('reserved_by'),
    committedAt: timestamp('committed_at', { withTimezone: true }),

    migratedAt: timestamp('migrated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    // Uniques (match your earlier schema intent)
    uniqLegacy: index('migration_lineage_uniq_legacy').on(
      t.orgId,
      t.entityType,
      t.legacySystem,
      t.legacyId
    ).unique(),

    uniqAfena: index('migration_lineage_uniq_afena').on(
      t.orgId,
      t.entityType,
      t.afenaId
    ).unique(),

    // Reservation scan index (partial)
    reservationsIdx: index('migration_lineage_reservations_idx')
      .on(t.orgId, t.entityType, t.legacySystem, t.reservedAt)
      .where(sql`${t.state} = 'reserved'`),

    // CHECK: state enum
    stateChk: check(
      'migration_lineage_state_chk',
      sql`${t.state} in ('reserved','committed')`
    ),

    // CHECK: reserved requires reserved_at
    reservedRequiresReservedAt: check(
      'migration_lineage_reserved_requires_reserved_at',
      sql`${t.state} <> 'reserved' OR ${t.reservedAt} IS NOT NULL`
    ),

    // CHECK: committed requires afena_id
    committedRequiresAfenaId: check(
      'migration_lineage_committed_requires_afena_id',
      sql`${t.state} <> 'committed' OR ${t.afenaId} IS NOT NULL`
    ),
  })
);
```

> Notes:
>
> * If your project currently defines `migration_lineage` elsewhere, **apply the changes**: make `afena_id` nullable + add `state/reserved_at/reserved_by/committed_at` + the 3 CHECK constraints + partial index.

---

## A2) DB schema: write-shape snapshots

### `packages/database/src/schema/migration-row-snapshots.ts` (new or updated)

```ts
import { pgTable, uuid, text, timestamp, integer, index, unique } from 'drizzle-orm/pg-core';
import { jsonb } from 'drizzle-orm/pg-core';

export const migrationRowSnapshots = pgTable(
  'migration_row_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    orgId: text('org_id').notNull(),
    migrationJobId: uuid('migration_job_id').notNull(),

    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),

    beforeWriteCore: jsonb('before_write_core').notNull(),
    beforeWriteCustom: jsonb('before_write_custom').notNull(),

    beforeVersion: integer('before_version'),

    capturedAt: timestamp('captured_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniqOneSnapshotPerRowPerJob: unique('migration_row_snapshots_uniq_job_entity_row').on(
      t.migrationJobId,
      t.entityType,
      t.entityId
    ),
    snapshotsJobIdx: index('migration_row_snapshots_job_idx').on(t.migrationJobId, t.entityType),
  })
);
```

---

## A3) Migration SQL (Drizzle migration file)

### `packages/database/src/migrations/00xx_migration_engine_ratify.sql`

```sql
-- 1) migration_lineage: add state machine columns
ALTER TABLE migration_lineage
  ADD COLUMN IF NOT EXISTS state text NOT NULL DEFAULT 'committed',
  ADD COLUMN IF NOT EXISTS reserved_at timestamptz,
  ADD COLUMN IF NOT EXISTS reserved_by text,
  ADD COLUMN IF NOT EXISTS committed_at timestamptz;

-- 2) state enum constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'migration_lineage_state_chk'
  ) THEN
    ALTER TABLE migration_lineage
      ADD CONSTRAINT migration_lineage_state_chk
      CHECK (state IN ('reserved','committed'));
  END IF;
END $$;

-- 3) afena_id becomes nullable (reserved state)
ALTER TABLE migration_lineage
  ALTER COLUMN afena_id DROP NOT NULL;

-- 4) state-dependent nullability constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'migration_lineage_reserved_requires_reserved_at'
  ) THEN
    ALTER TABLE migration_lineage
      ADD CONSTRAINT migration_lineage_reserved_requires_reserved_at
      CHECK (state <> 'reserved' OR reserved_at IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'migration_lineage_committed_requires_afena_id'
  ) THEN
    ALTER TABLE migration_lineage
      ADD CONSTRAINT migration_lineage_committed_requires_afena_id
      CHECK (state <> 'committed' OR afena_id IS NOT NULL);
  END IF;
END $$;

-- 5) reservation partial index
CREATE INDEX IF NOT EXISTS migration_lineage_reservations_idx
  ON migration_lineage (org_id, entity_type, legacy_system, reserved_at)
  WHERE state = 'reserved';

-- 6) migration_row_snapshots: create/alter to write-shape snapshots
CREATE TABLE IF NOT EXISTS migration_row_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL,
  migration_job_id uuid NOT NULL REFERENCES migration_jobs(id),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  before_write_core jsonb NOT NULL,
  before_write_custom jsonb NOT NULL,
  before_version integer,
  captured_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (migration_job_id, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS migration_row_snapshots_job_idx
  ON migration_row_snapshots (migration_job_id, entity_type);
```

---

# B) Runtime Patches (migration engine)

## B1) Canon: writable core fields (kernel-owned)

### `packages/canon/src/types/entity-writable-fields.ts`

```ts
import type { EntityType } from './entity-types';

export const ENTITY_WRITABLE_CORE_FIELDS: Record<EntityType, readonly string[]> = {
  contacts: ['name', 'email', 'phone', 'status', 'notes', 'tags'],
  companies: ['name', 'registrationNo', 'taxId', 'industry', 'status'],
  invoices: ['invoiceNumber', 'issueDate', 'dueDate', 'amount', 'status', 'vendorId'],
  products: ['sku', 'name', 'description', 'price', 'category', 'status'],
  // IMPORTANT: must be exhaustive in your codebase
} as const;
```

> Seal rule: this list must be **exhaustive** for your `EntityType` union. If TypeScript flags missing keys, that’s intended.

---

## B2) Write adapter: canon-only writable fields

### `packages/migration/src/adapters/entity-write-adapter.ts`

```ts
import type { EntityType } from '@workspace/canon/src/types/entity-types';
import { ENTITY_WRITABLE_CORE_FIELDS } from '@workspace/canon/src/types/entity-writable-fields';

export interface EntityWriteAdapter {
  readonly entityType: EntityType;
  toWriteShape(rawRow: Record<string, unknown>): {
    core: Record<string, unknown>;
    custom: Record<string, unknown>;
  };
}

export class CanonEntityWriteAdapter implements EntityWriteAdapter {
  constructor(public readonly entityType: EntityType) {}

  toWriteShape(rawRow: Record<string, unknown>) {
    const core: Record<string, unknown> = {};

    for (const field of ENTITY_WRITABLE_CORE_FIELDS[this.entityType]) {
      if (Object.prototype.hasOwnProperty.call(rawRow, field)) {
        core[field] = rawRow[field];
      }
    }

    const custom =
      (rawRow['custom_data'] as Record<string, unknown> | undefined) ??
      (rawRow['customData'] as Record<string, unknown> | undefined) ??
      {};

    return { core, custom };
  }
}

export const ENTITY_WRITE_ADAPTER_REGISTRY: Record<EntityType, EntityWriteAdapter> = {
  contacts: new CanonEntityWriteAdapter('contacts'),
  companies: new CanonEntityWriteAdapter('companies'),
  invoices: new CanonEntityWriteAdapter('invoices'),
  products: new CanonEntityWriteAdapter('products'),
  // IMPORTANT: exhaustive
} as const;

export function getEntityWriteAdapter(entityType: EntityType): EntityWriteAdapter {
  const adapter = ENTITY_WRITE_ADAPTER_REGISTRY[entityType];
  if (!adapter) throw new Error(`No write adapter for entity type: ${entityType}`);
  return adapter;
}
```

---

## B3) Lineage reservation: atomic insert + atomic reclaim + guarded commit

### `packages/migration/src/pipeline/pipeline-base.ts` (add/replace these methods)

```ts
protected async reserveLineage(
  jobId: string,
  entityType: EntityType,
  legacyKey: LegacyKey
): Promise<{ isWinner: boolean; lineageId?: string }> {
  const workerId = this.context.workerId || jobId;

  const inserted = await db
    .insert(migrationLineage)
    .values({
      id: crypto.randomUUID(),
      orgId: this.context.orgId,
      migrationJobId: jobId,
      entityType,
      legacyId: legacyKey.legacyId,
      legacySystem: legacyKey.legacySystem,
      afenaId: null,
      state: 'reserved',
      reservedAt: new Date(),
      reservedBy: workerId,
    })
    .onConflictDoNothing()
    .returning({ id: migrationLineage.id });

  if (inserted.length > 0) return { isWinner: true, lineageId: inserted[0].id };

  return this.reclaimStaleReservation(jobId, entityType, legacyKey, workerId);
}

protected async reclaimStaleReservation(
  jobId: string,
  entityType: EntityType,
  legacyKey: LegacyKey,
  workerId: string
): Promise<{ isWinner: boolean; lineageId?: string }> {
  const leaseExpiryMinutes = 15;
  const expiryThreshold = new Date(Date.now() - leaseExpiryMinutes * 60 * 1000);

  // D0.1 single statement atomic winner check: winner iff RETURNING row
  const claimed = await db
    .update(migrationLineage)
    .set({
      reservedAt: new Date(),
      reservedBy: workerId,
      migrationJobId: jobId,
    })
    .where(and(
      eq(migrationLineage.orgId, this.context.orgId),
      eq(migrationLineage.entityType, entityType),
      eq(migrationLineage.legacySystem, legacyKey.legacySystem),
      eq(migrationLineage.legacyId, legacyKey.legacyId),
      eq(migrationLineage.state, 'reserved'),
      lt(migrationLineage.reservedAt, expiryThreshold),
      isNull(migrationLineage.afenaId),
    ))
    .returning({ id: migrationLineage.id });

  if (claimed.length > 0) return { isWinner: true, lineageId: claimed[0].id };
  return { isWinner: false };
}

protected async commitLineage(lineageId: string, afenaId: string): Promise<void> {
  const updated = await db
    .update(migrationLineage)
    .set({
      afenaId,
      state: 'committed',
      committedAt: new Date(),
    })
    .where(and(
      eq(migrationLineage.id, lineageId),
      eq(migrationLineage.state, 'reserved'),
    ))
    .returning({ id: migrationLineage.id });

  if (updated.length === 0) {
    throw new Error(`Lineage commit failed (not reserved): ${lineageId}`);
  }
}
```

### `loadPlan()` create branch (D0.2 safe delete-by-id only)

```ts
case 'create': {
  const reservation = await this.reserveLineage(plan.jobId, plan.entityType, action.legacyKey);

  if (!reservation.isWinner) {
    result.skipped.push({
      legacyId: action.legacyKey.legacyId,
      reason: 'Not winner (already committed or active reservation)',
    });
    continue;
  }

  try {
    const receipt = await mutate({
      action: `${plan.entityType}.create`,
      entity: { type: plan.entityType },
      data: action.data,
    }, this.context);

    await this.commitLineage(reservation.lineageId!, receipt.entityId!);

    result.created.push({ legacyId: action.legacyKey.legacyId, afenaId: receipt.entityId! });
  } catch (e) {
    // D0.2 delete only what we own (by lineageId)
    await db.delete(migrationLineage)
      .where(and(
        eq(migrationLineage.id, reservation.lineageId!),
        eq(migrationLineage.state, 'reserved')
      ));
    throw e;
  }

  break;
}
```

---

## B4) QueryBuilder: structural identifiers + legacy schema validation

### Canon types: `LegacyFilter` + `LegacySchema`

#### `packages/canon/src/types/migration-query.ts`

```ts
export type LegacyColumnKey = string;

export interface LegacyFilter {
  field: LegacyColumnKey;
  operator: '=' | '>' | '<' | '>=' | '<=' | 'IN';
  value: unknown;
}

export interface LegacySchema {
  tableName: string;
  columns: Array<{ name: string; type: string }>;
}
```

### QueryBuilder interface: schema must be set before querying

#### `packages/migration/src/adapters/query-builder.ts`

```ts
import type { EntityType } from '@workspace/canon/src/types/entity-types';
import type { LegacyFilter, LegacySchema } from '@workspace/canon/src/types/migration-query';
import type { Cursor } from '../types/cursor';

export interface Query {
  text: string;
  values: unknown[];
}

export interface QueryBuilder {
  setLegacySchema(entityType: EntityType, schema: LegacySchema): void;

  buildBatchQuery(entityType: EntityType, batchSize: number, cursor: Cursor): Query;
  buildCountQuery(entityType: EntityType): Query;
  buildSelectQuery(entityType: EntityType, filters: LegacyFilter[]): Query;

  // Nit A: prevCursor in scope for all dialects
  extractCursor(rows: unknown[], batchSize: number, prevCursor: Cursor): Cursor;
}
```

### Postgres builder example (MySQL builder similar)

#### `packages/migration/src/adapters/postgres-query-builder.ts`

```ts
import type { EntityType } from '@workspace/canon/src/types/entity-types';
import type { LegacyFilter, LegacySchema } from '@workspace/canon/src/types/migration-query';
import type { Cursor } from '../types/cursor';
import type { Query, QueryBuilder } from './query-builder';

export class PostgresQueryBuilder implements QueryBuilder {
  private legacySchemas = new Map<EntityType, LegacySchema>();

  setLegacySchema(entityType: EntityType, schema: LegacySchema): void {
    this.legacySchemas.set(entityType, schema);
  }

  buildBatchQuery(entityType: EntityType, batchSize: number, cursor: Cursor): Query {
    const schema = this.mustGetSchema(entityType);
    const table = this.q(schema.tableName);

    if (!cursor) {
      return {
        text: `SELECT * FROM ${table} ORDER BY "updated_at","id" LIMIT $1`,
        values: [batchSize],
      };
    }

    if (cursor.type === 'composite') {
      return {
        text: `SELECT * FROM ${table}
              WHERE ("updated_at","id") > ($1,$2)
              ORDER BY "updated_at","id"
              LIMIT $3`,
        values: [cursor.lastUpdatedAt, cursor.lastId, batchSize],
      };
    }

    throw new Error(`Unsupported cursor type: ${cursor.type}`);
  }

  buildCountQuery(entityType: EntityType): Query {
    const schema = this.mustGetSchema(entityType);
    const table = this.q(schema.tableName);
    return { text: `SELECT COUNT(*) FROM ${table}`, values: [] };
  }

  buildSelectQuery(entityType: EntityType, filters: LegacyFilter[]): Query {
    const schema = this.mustGetSchema(entityType);
    const allowed = new Set(schema.columns.map((c) => c.name));
    for (const f of filters) {
      if (!allowed.has(f.field)) {
        throw new Error(
          `Field '${f.field}' not in legacy schema for entity '${entityType}'. ` +
          `Valid fields: ${Array.from(allowed).join(', ')}`
        );
      }
    }

    const table = this.q(schema.tableName);
    const conditions: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    for (const f of filters) {
      const col = this.q(f.field);

      if (f.operator === 'IN') {
        if (!Array.isArray(f.value)) throw new Error(`IN requires array value for '${f.field}'`);
        const ph = f.value.map(() => `$${i++}`).join(',');
        conditions.push(`${col} IN (${ph})`);
        values.push(...f.value);
      } else {
        conditions.push(`${col} ${f.operator} $${i++}`);
        values.push(f.value);
      }
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return { text: `SELECT * FROM ${table} ${where}`, values };
  }

  extractCursor(rows: unknown[], batchSize: number, _prevCursor: Cursor): Cursor {
    if (rows.length < batchSize) return null;
    const last = rows[rows.length - 1] as { updated_at: string; id: string };
    return { type: 'composite', lastUpdatedAt: last.updated_at, lastId: last.id };
  }

  private mustGetSchema(entityType: EntityType): LegacySchema {
    const s = this.legacySchemas.get(entityType);
    if (!s) throw new Error(`Legacy schema not set for entity type: ${entityType}`);
    return s;
  }

  private q(ident: string): string {
    // Postgres identifier quoting
    return `"${ident.replace(/"/g, '""')}"`;
  }
}
```

### Adapter initialization must set schema before use

#### `packages/migration/src/adapters/postgres-adapter.ts`

```ts
async initialize(entityType: EntityType): Promise<void> {
  const schema = await this.schemaIntrospector.getSchema(entityType);
  this.queryBuilder.setLegacySchema(entityType, schema);
}

async extractBatch(entityType: EntityType, batchSize: number, cursor: Cursor) {
  const query = this.queryBuilder.buildBatchQuery(entityType, batchSize, cursor);
  const result = await this.pool.query(query.text, query.values);
  const nextCursor = this.queryBuilder.extractCursor(result.rows, batchSize, cursor);
  return { records: result.rows.map(r => this.mapToLegacyRecord(r)), nextCursor };
}
```

---

## B5) Conflict detection: Strategy + matchKeys + total registry

### `packages/migration/src/strategies/conflict-detector.ts`

```ts
import type { EntityType } from '@workspace/canon/src/types/entity-types';

export interface ConflictDetector {
  readonly name: string;
  readonly entityType: EntityType;
  readonly matchKeys: readonly string[];
  detectBulk(records: TransformedRecord[], ctx: DetectorContext): Promise<Conflict[]>;
}
```

### `packages/migration/src/strategies/conflict-detector-registry.ts`

```ts
export const CONFLICT_DETECTOR_REGISTRY: Record<EntityType, ConflictDetector> = {
  contacts: new ContactsConflictDetector(),
  companies: new NoConflictDetector('companies'),
  invoices: new InvoicesConflictDetector(),
  products: new NoConflictDetector('products'),
  // IMPORTANT: exhaustive
} as const;

export function getConflictDetector(entityType: EntityType): ConflictDetector {
  const detector = CONFLICT_DETECTOR_REGISTRY[entityType];
  if (!detector) throw new Error(`No conflict detector for entity type: ${entityType}`);
  if (detector.entityType !== entityType) {
    throw new Error(`Detector entity type mismatch: expected ${entityType}, got ${detector.entityType}`);
  }
  return detector;
}
```

---

## B6) Snapshot capture: write-shape only

### `packages/migration/src/pipeline/pipeline-base.ts` (replace `captureSnapshot`)

```ts
protected async captureSnapshot(jobId: string, entityType: EntityType, entityId: string): Promise<void> {
  const rawRow = await this.readRawRow(entityType, entityId);

  const adapter = getEntityWriteAdapter(entityType);
  const { core, custom } = adapter.toWriteShape(rawRow);

  await db.insert(migrationRowSnapshots).values({
    orgId: this.context.orgId,
    migrationJobId: jobId,
    entityType,
    entityId,
    beforeWriteCore: core,
    beforeWriteCustom: custom,
    beforeVersion: typeof rawRow.version === 'number' ? rawRow.version : null,
  }).onConflictDoNothing();
}
```

---

## B7) Nit B: Signed report evidence queries (job-scoped join safe)

### `packages/migration/src/audit/signed-report.ts`

```ts
const mergeEvidenceIds = await db
  .select({ id: migrationConflictResolutions.id })
  .from(migrationConflictResolutions)
  .innerJoin(migrationConflicts, eq(migrationConflictResolutions.conflictId, migrationConflicts.id))
  .where(and(
    eq(migrationConflicts.orgId, job.orgId),
    eq(migrationConflicts.migrationJobId, job.id),
    eq(migrationConflictResolutions.decision, 'merged'),
  ));

const manualReviewIds = await db
  .select({ id: migrationConflicts.id })
  .from(migrationConflicts)
  .where(and(
    eq(migrationConflicts.orgId, job.orgId),
    eq(migrationConflicts.migrationJobId, job.id),
    eq(migrationConflicts.resolution, 'manual_review'),
  ));
```

(Optional denorm is fine; your earlier SQL is correct.)

---

# C) CI Seal Stamps (4 invariant tests)

## C1) RES-01 No zombie reservations

### `packages/migration/src/__tests__/invariants/res-01-no-zombies.test.ts`

```ts
describe('RES-01: No zombie reservations', () => {
  it('reclaims stale reservations (winner iff row returned)', async () => {
    const staleId = crypto.randomUUID();

    await db.insert(migrationLineage).values({
      id: staleId,
      orgId: 'test-org',
      migrationJobId: 'old-job',
      entityType: 'contacts',
      legacyId: '12345',
      legacySystem: 'legacy',
      afenaId: null,
      state: 'reserved',
      reservedAt: new Date(Date.now() - 20 * 60 * 1000),
      reservedBy: 'old-worker',
    });

    const pipeline = new SqlMigrationPipeline(job, { ...context, orgId: 'test-org', workerId: 'w2' });

    const won = await pipeline.reserveLineage('new-job', 'contacts', { legacySystem: 'legacy', legacyId: '12345' });

    expect(won.isWinner).toBe(true);
    expect(won.lineageId).toBeDefined();

    const row = await db.select().from(migrationLineage).where(eq(migrationLineage.id, won.lineageId!)).limit(1);
    expect(row[0].migrationJobId).toBe('new-job');
    expect(row[0].state).toBe('reserved');
  });

  it('commit requires reserved -> committed transition', async () => {
    const pipeline = new SqlMigrationPipeline(job, context);

    const r = await db.insert(migrationLineage).values({
      id: crypto.randomUUID(),
      orgId: context.orgId,
      migrationJobId: job.id,
      entityType: 'contacts',
      legacyId: 'L1',
      legacySystem: 'legacy',
      afenaId: null,
      state: 'reserved',
      reservedAt: new Date(),
      reservedBy: 'w1',
    }).returning({ id: migrationLineage.id });

    await pipeline.commitLineage(r[0].id, crypto.randomUUID());

    await expect(pipeline.commitLineage(r[0].id, crypto.randomUUID()))
      .rejects.toThrow('Lineage commit failed (not reserved)');
  });
});
```

---

## C2) SQL-02 QueryBuilder rejects unknown legacy columns

### `packages/migration/src/__tests__/invariants/sql-02-reject-unknown-columns.test.ts`

```ts
describe('SQL-02: QueryBuilder rejects unknown legacy columns', () => {
  it('requires schema set before querying', () => {
    const b = new PostgresQueryBuilder();
    expect(() => b.buildBatchQuery('contacts', 100, null)).toThrow('Legacy schema not set');
  });

  it('rejects unknown legacy fields', () => {
    const b = new PostgresQueryBuilder();
    b.setLegacySchema('contacts', {
      tableName: 'customers',
      columns: [{ name: 'id', type: 'varchar' }, { name: 'email', type: 'varchar' }],
    });

    expect(() =>
      b.buildSelectQuery('contacts', [{ field: 'DROP_TABLE', operator: '=', value: 'x' }])
    ).toThrow("Field 'DROP_TABLE' not in legacy schema");
  });
});
```

---

## C3) DET-03 ConflictDetector registry is total

### `packages/migration/src/__tests__/invariants/det-03-registry-total.test.ts`

```ts
describe('DET-03: ConflictDetector registry is total', () => {
  it('has detector for every entity type', () => {
    for (const t of ENTITY_TYPES as EntityType[]) {
      const d = CONFLICT_DETECTOR_REGISTRY[t];
      expect(d).toBeDefined();
      expect(d.entityType).toBe(t);
      expect(typeof d.name).toBe('string');
      expect(Array.isArray(d.matchKeys)).toBe(true);
    }
  });
});
```

---

## C4) SNAP-04 Snapshot contains only writable fields

### `packages/migration/src/__tests__/invariants/snap-04-writable-only.test.ts`

```ts
describe('SNAP-04: Snapshot contains only writable fields', () => {
  it('write adapter emits only canonized writable fields', () => {
    const adapter = getEntityWriteAdapter('contacts');

    const raw = {
      id: 'uuid',
      org_id: 'org',
      name: 'John',
      email: 'john@example.com',
      phone: '+1',
      status: 'active',
      created_at: new Date(),
      version: 7,
      is_deleted: false,
      custom_data: { x: 1 },
      injected: 'nope',
    };

    const { core, custom } = adapter.toWriteShape(raw);

    for (const k of Object.keys(core)) {
      expect(ENTITY_WRITABLE_CORE_FIELDS.contacts).toContain(k);
    }
    expect(core).not.toHaveProperty('id');
    expect(core).not.toHaveProperty('org_id');
    expect(core).not.toHaveProperty('created_at');
    expect(core).not.toHaveProperty('version');
    expect(core).not.toHaveProperty('is_deleted');
    expect(core).not.toHaveProperty('injected');

    expect(custom).toEqual({ x: 1 });
  });
});
```

---

# D) Raw SQL-Only Patchset (if you don’t want Drizzle schema files)

If your repo uses only SQL migrations, apply **A3** as your migration, and **skip** A1/A2. Everything else (runtime + tests) stays identical.

---

# E) One tiny but important seal you should keep

In `migration_lineage` you already have unique `(org_id, entity_type, legacy_system, legacy_id)`. With the state machine, this means:

* A committed row prevents any future reservation for that key (correct).
* An active reservation prevents another reservation (correct).
* Only stale reservations become reclaimable (correct).

So the uniqueness stays **exactly right**.

---

If you want the next output to be a *single ordered patch bundle* (like “Patchset 01–07” with exact file paths matching your monorepo conventions), paste your current paths for:

* `migration_lineage` drizzle schema file (if it exists)
* where `EntityType` union lives
* where your query builders are implemented (postgres/mysql)

…and I’ll align names/imports to your exact structure without changing the sealed logic.
