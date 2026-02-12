/* eslint-disable no-console, no-restricted-syntax */
/**
 * Entity Generator — `pnpm entity:new <name>`
 *
 * Generates 4 files from a template:
 *   1. packages/database/src/schema/<name>.ts — Drizzle table
 *   2. packages/crud/src/handlers/<name>.ts — Handler stub
 *   3. packages/crud/src/__tests__/<name>.smoke.test.ts — Test stub
 *   4. (prints instructions for manual wiring)
 *
 * Usage:
 *   npx tsx src/scripts/entity-new.ts invoices --company --site --doc-number
 *
 * Run from packages/database directory.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// ── Parse CLI args ───────────────────────────────────────

const args = process.argv.slice(2);
if (args.length === 0 || args[0]?.startsWith('-')) {
  console.error('Usage: npx tsx src/scripts/entity-new.ts <entity_name> [--company] [--site] [--doc-number]');
  process.exit(1);
}

const entityName = args[0] as string; // e.g. "invoices"
const flags = new Set(args.slice(1));
const hasDocNumber = flags.has('--doc-number');
// Reserved for future use:
// const hasCompany = flags.has('--company');
// const hasSite = flags.has('--site');

// Derive names
const singular = entityName.endsWith('s') ? entityName.slice(0, -1) : entityName;
const pascalSingular = singular.charAt(0).toUpperCase() + singular.slice(1);
const pascalPlural = entityName.charAt(0).toUpperCase() + entityName.slice(1);
const camelPlural = entityName;

// ── Paths ────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const DB_SCHEMA = path.join(ROOT, 'packages', 'database', 'src', 'schema');
const CRUD_HANDLERS = path.join(ROOT, 'packages', 'crud', 'src', 'handlers');
const CRUD_TESTS = path.join(ROOT, 'packages', 'crud', 'src', '__tests__');
const WEB_ACTIONS = path.join(ROOT, 'apps', 'web', 'app', 'actions');

// ── Template: Drizzle schema ─────────────────────────────

function generateSchema(): string {
  const imports = [
    `import { pgTable, text, jsonb } from 'drizzle-orm/pg-core';`,
    ``,
    `import { erpEntityColumns } from '../helpers/erp-entity';`,
    `import { tenantPolicy } from '../helpers/tenant-policy';`,
    `import { erpIndexes } from '../helpers/standard-indexes';`,
  ];

  if (hasDocNumber) {
    imports.push(`import { docNumber } from '../helpers/field-types';`);
    imports.push(`import { docIndexes } from '../helpers/standard-indexes';`);
  }

  imports.push(``, `import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';`);

  const columns: string[] = [
    `    ...erpEntityColumns,`,
  ];

  if (hasDocNumber) {
    columns.push(`    ...docNumber(),`);
  }

  columns.push(
    `    // TODO: Add entity-specific columns here`,
    `    description: text('description'),`,
    `    metadata: jsonb('metadata'),`,
  );

  const indexes: string[] = [
    `    ...erpIndexes(table, '${entityName}'),`,
  ];

  if (hasDocNumber) {
    indexes.push(`    ...docIndexes(table, '${entityName}'),`);
  }

  return `${imports.join('\n')}

export const ${camelPlural} = pgTable(
  '${entityName}',
  {
${columns.join('\n')}
  },
  (table) => [
${indexes.join('\n')}
    ...tenantPolicy(table),
  ],
);

export type ${pascalSingular} = InferSelectModel<typeof ${camelPlural}>;
export type New${pascalSingular} = InferInsertModel<typeof ${camelPlural}>;
`;
}

// ── Template: CRUD handler ───────────────────────────────

function generateHandler(): string {
  return `import { ${camelPlural} } from 'afena-database';
import { eq, and, sql } from 'drizzle-orm';

import type { MutationContext } from '../context';
import type { EntityHandler, HandlerResult } from './types';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * K-11: ${pascalPlural} allowlist — only these fields are accepted from input.
 */
function pickAllowed(input: Record<string, unknown>): Record<string, unknown> {
  // TODO: Update this list with entity-specific fields
  const ALLOWED = ['description', 'metadata'] as const;
  const result: Record<string, unknown> = {};
  for (const key of ALLOWED) {
    if (key in input) {
      result[key] = input[key];
    }
  }
  return result;
}

function toRecord(row: Record<string, unknown>): Record<string, unknown> {
  return { ...row };
}

export const ${camelPlural}Handler: EntityHandler = {
  async create(
    tx: NeonHttpDatabase,
    input: Record<string, unknown>,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    const allowed = pickAllowed(input);

    const [row] = await tx
      .insert(${camelPlural})
      .values({
        ...(allowed as any),
        createdBy: ctx.actor.userId,
        updatedBy: ctx.actor.userId,
      })
      .returning();

    if (!row) throw new Error('Insert returned no rows');

    return {
      entityId: row.id,
      before: null,
      after: toRecord(row as unknown as Record<string, unknown>),
      versionBefore: null,
      versionAfter: 1,
    };
  },

  async update(
    tx: NeonHttpDatabase,
    entityId: string,
    input: Record<string, unknown>,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    const [beforeRow] = await tx
      .select()
      .from(${camelPlural})
      .where(eq(${camelPlural}.id, entityId))
      .limit(1);

    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');

    const allowed = pickAllowed(input);

    const [afterRow] = await tx
      .update(${camelPlural})
      .set({
        ...(allowed as any),
        updatedBy: ctx.actor.userId,
        version: sql\`\${${camelPlural}.version} + 1\`,
      })
      .where(
        and(
          eq(${camelPlural}.id, entityId),
          eq(${camelPlural}.version, expectedVersion),
        ),
      )
      .returning();

    if (!afterRow) throw new Error('CONFLICT_VERSION');

    return {
      entityId,
      before: toRecord(beforeRow as unknown as Record<string, unknown>),
      after: toRecord(afterRow as unknown as Record<string, unknown>),
      versionBefore: expectedVersion,
      versionAfter: afterRow.version,
    };
  },

  async delete(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    const [beforeRow] = await tx
      .select()
      .from(${camelPlural})
      .where(eq(${camelPlural}.id, entityId))
      .limit(1);

    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');

    const [afterRow] = await tx
      .update(${camelPlural})
      .set({
        isDeleted: true,
        deletedAt: sql\`now()\`,
        deletedBy: ctx.actor.userId,
        updatedBy: ctx.actor.userId,
        version: sql\`\${${camelPlural}.version} + 1\`,
      })
      .where(
        and(
          eq(${camelPlural}.id, entityId),
          eq(${camelPlural}.version, expectedVersion),
        ),
      )
      .returning();

    if (!afterRow) throw new Error('CONFLICT_VERSION');

    return {
      entityId,
      before: toRecord(beforeRow as unknown as Record<string, unknown>),
      after: toRecord(afterRow as unknown as Record<string, unknown>),
      versionBefore: expectedVersion,
      versionAfter: afterRow.version,
    };
  },

  async restore(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    const [beforeRow] = await tx
      .select()
      .from(${camelPlural})
      .where(eq(${camelPlural}.id, entityId))
      .limit(1);

    if (!beforeRow) throw new Error('NOT_FOUND');
    if (!beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');

    const [afterRow] = await tx
      .update(${camelPlural})
      .set({
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedBy: ctx.actor.userId,
        version: sql\`\${${camelPlural}.version} + 1\`,
      })
      .where(
        and(
          eq(${camelPlural}.id, entityId),
          eq(${camelPlural}.version, expectedVersion),
        ),
      )
      .returning();

    if (!afterRow) throw new Error('CONFLICT_VERSION');

    return {
      entityId,
      before: toRecord(beforeRow as unknown as Record<string, unknown>),
      after: toRecord(afterRow as unknown as Record<string, unknown>),
      versionBefore: expectedVersion,
      versionAfter: afterRow.version,
    };
  },
};
`;
}

// ── Template: Server action ──────────────────────────────

function generateServerAction(): string {
  return `'use server';

import { generateEntityActions } from '@/lib/actions/entity-actions';

import type { ApiResponse } from 'afena-canon';

export const CAPABILITIES = [
  '${entityName}.create',
  '${entityName}.update',
  '${entityName}.delete',
  '${entityName}.restore',
  '${entityName}.read',
  '${entityName}.list',
  '${entityName}.versions',
  '${entityName}.audit',
] as const;

const actions = generateEntityActions('${entityName}');

// ── Create ──────────────────────────────────────────────────

export async function create${pascalSingular}(input: {
  // TODO: Add entity-specific input fields
  description?: string;
}): Promise<ApiResponse> {
  return actions.create(input);
}

// ── Update ──────────────────────────────────────────────────

export async function update${pascalSingular}(
  id: string,
  expectedVersion: number,
  input: {
    // TODO: Add entity-specific input fields
    description?: string;
  },
): Promise<ApiResponse> {
  return actions.update(id, expectedVersion, input);
}

// ── Delete (soft) ───────────────────────────────────────────

export async function delete${pascalSingular}(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  return actions.remove(id, expectedVersion);
}

// ── Restore ─────────────────────────────────────────────────

export async function restore${pascalSingular}(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  return actions.restore(id, expectedVersion);
}

// ── Read ────────────────────────────────────────────────────

export async function get${pascalSingular}(id: string): Promise<ApiResponse> {
  return actions.read(id);
}

export async function get${pascalPlural}(options?: {
  includeDeleted?: boolean;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse> {
  return actions.list(options);
}

// ── Version History ─────────────────────────────────────────

export async function get${pascalSingular}Versions(${singular}Id: string): Promise<ApiResponse> {
  return actions.getVersions(${singular}Id);
}

// ── Audit Logs ──────────────────────────────────────────────

export async function get${pascalSingular}AuditLogs(${singular}Id: string): Promise<ApiResponse> {
  return actions.getAuditLogs(${singular}Id);
}
`;
}

// ── Template: Smoke test ─────────────────────────────────

function generateTest(): string {
  return `/**
 * ${pascalPlural} Smoke Tests — auto-generated by entity:new
 *
 * TODO: Add entity-specific test cases.
 */

import { describe, it, expect } from 'vitest';

import { ENTITY_TYPES, ACTION_TYPES } from 'afena-canon';

describe('${pascalPlural} entity registration', () => {
  it('${entityName} is in ENTITY_TYPES', () => {
    expect(ENTITY_TYPES).toContain('${entityName}');
  });

  it('${entityName}.create is in ACTION_TYPES', () => {
    expect(ACTION_TYPES).toContain('${entityName}.create');
  });

  it('${entityName}.update is in ACTION_TYPES', () => {
    expect(ACTION_TYPES).toContain('${entityName}.update');
  });

  it('${entityName}.delete is in ACTION_TYPES', () => {
    expect(ACTION_TYPES).toContain('${entityName}.delete');
  });

  it('${entityName}.restore is in ACTION_TYPES', () => {
    expect(ACTION_TYPES).toContain('${entityName}.restore');
  });
});
`;
}

// ── Write files ──────────────────────────────────────────

function writeIfNotExists(filePath: string, content: string, label: string): void {
  if (fs.existsSync(filePath)) {
    console.warn(`⚠️  SKIP ${label}: ${filePath} already exists`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Created ${label}: ${filePath}`);
}

// 1. Schema
writeIfNotExists(
  path.join(DB_SCHEMA, `${entityName}.ts`),
  generateSchema(),
  'Drizzle schema',
);

// 2. Handler
writeIfNotExists(
  path.join(CRUD_HANDLERS, `${entityName}.ts`),
  generateHandler(),
  'CRUD handler',
);

// 3. Test
writeIfNotExists(
  path.join(CRUD_TESTS, `${entityName}.smoke.test.ts`),
  generateTest(),
  'Smoke test',
);

// 4. Server action
writeIfNotExists(
  path.join(WEB_ACTIONS, `${entityName}.ts`),
  generateServerAction(),
  'Server action',
);

// ── Print manual wiring instructions ─────────────────────

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Manual wiring required:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. packages/database/src/schema/index.ts — add:
   export { ${camelPlural} } from './${entityName}';
   export type { ${pascalSingular}, New${pascalSingular} } from './${entityName}';

2. packages/canon/src/types/entity.ts — add '${entityName}' to ENTITY_TYPES

3. packages/canon/src/types/action.ts — add to ACTION_TYPES:
   '${entityName}.create',
   '${entityName}.update',
   '${entityName}.delete',
   '${entityName}.restore',

4. packages/canon/src/types/capability.ts — add to CAPABILITY_CATALOG:
   '${entityName}.create': { key: '${entityName}.create', intent: 'Create a new ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['TODO'] },
   '${entityName}.update': { key: '${entityName}.update', intent: 'Update an existing ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['TODO'] },
   '${entityName}.delete': { key: '${entityName}.delete', intent: 'Soft-delete a ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['TODO'], risks: ['irreversible'] },
   '${entityName}.restore': { key: '${entityName}.restore', intent: 'Restore a soft-deleted ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['TODO'] },
   '${entityName}.read': { key: '${entityName}.read', intent: 'Read a single ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['TODO'] },
   '${entityName}.list': { key: '${entityName}.list', intent: 'List ${entityName} with filtering', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['TODO'] },
   '${entityName}.versions': { key: '${entityName}.versions', intent: 'View version history of a ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['TODO', 'audit'] },
   '${entityName}.audit': { key: '${entityName}.audit', intent: 'View audit trail for a ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['TODO', 'audit'] },

5. packages/crud/src/mutate.ts — add to HANDLER_REGISTRY:
   import { ${camelPlural}Handler } from './handlers/${entityName}';
   // then in HANDLER_REGISTRY:
   ${entityName}: ${camelPlural}Handler,

6. Generate migration:
   cd packages/database && npx drizzle-kit generate

7. Apply migration:
   cd packages/database && npx drizzle-kit migrate

8. Run capability checks:
   cd tools/afena-cli && node dist/index.js meta check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
