/* eslint-disable no-console, no-restricted-syntax */
/**
 * Entity Generator — Zero-Drift Auto-Wiring (W1 + W3)
 *
 * Generates files AND auto-wires all registries via named markers.
 * After running, the workspace should compile, lint, and pass invariants
 * with zero manual wiring.
 *
 * Usage:
 *   npx tsx src/scripts/entity-new.ts <name> [--doc] [--skip-schema]
 *
 * Flags:
 *   --doc          Include lifecycle verbs (submit/cancel/approve/reject)
 *   --skip-schema  Skip schema generation (for existing tables like companies)
 *
 * Run from packages/database directory.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Parse CLI args ───────────────────────────────────────

const args = process.argv.slice(2);
const entityName = args[0];
if (!entityName || entityName.startsWith('-')) {
  console.error('Usage: npx tsx src/scripts/entity-new.ts <entity_name> [--doc] [--skip-schema]');
  process.exit(1);
}
const flags = new Set(args.slice(1));
const hasDoc = flags.has('--doc');
const skipSchema = flags.has('--skip-schema');

// ── Derive names ─────────────────────────────────────────

// Smarter singularization: companies→company, contacts→contact, sites→site
function singularize(name: string): string {
  if (name.endsWith('ies')) return `${name.slice(0, -3)}y`; // companies→company
  if (name.endsWith('ses') || name.endsWith('xes') || name.endsWith('zes'))
    return name.slice(0, -2); // addresses→address
  if (name.endsWith('s') && !name.endsWith('ss')) return name.slice(0, -1); // contacts→contact
  return name;
}
const singular = singularize(entityName);
const pascalSingular = singular.charAt(0).toUpperCase() + singular.slice(1);
const pascalPlural = entityName.charAt(0).toUpperCase() + entityName.slice(1);
const camelPlural = entityName;

// ── Paths ────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const DB_SCHEMA = path.join(ROOT, 'packages', 'database', 'src', 'schema');
const CANON_TYPES = path.join(ROOT, 'packages', 'canon', 'src', 'types');
const CRUD_SRC = path.join(ROOT, 'packages', 'crud', 'src');
const CRUD_HANDLERS = path.join(CRUD_SRC, 'handlers');
const CRUD_TESTS = path.join(CRUD_SRC, '__tests__');
const SEARCH_ADAPTERS = path.join(ROOT, 'packages', 'search', 'src', 'adapters');
const WEB_ENTITY = path.join(ROOT, 'apps', 'web', 'app', '(app)', 'org', '[slug]', entityName);
const NAV_CONFIG = path.join(
  ROOT,
  'apps',
  'web',
  'app',
  '(app)',
  'org',
  '[slug]',
  '_components',
  'nav-config.ts',
);

// ── Ledger tracking ──────────────────────────────────────

const ledger = {
  filesModified: [] as string[],
  filesCreated: [] as string[],
  registries: [] as string[],
  actionTypes: [] as string[],
};

// ── Helpers ──────────────────────────────────────────────

function writeIfNotExists(filePath: string, content: string, label: string): void {
  if (fs.existsSync(filePath)) {
    console.warn(`  SKIP ${label}: already exists`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  ledger.filesCreated.push(path.relative(ROOT, filePath));
}

function insertAtMarker(filePath: string, marker: string, insertion: string, label: string): void {
  const relPath = path.relative(ROOT, filePath);
  if (!fs.existsSync(filePath)) {
    console.error(`FATAL: File not found for marker insertion: ${relPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes(marker)) {
    console.error(`FATAL: Marker "${marker}" not found in ${relPath}`);
    process.exit(1);
  }
  // Dedup: check if the entity name appears in the insertion context near the marker
  // Use a line that uniquely identifies this entity (not just '{' or generic syntax)
  const dedupLines = insertion
    .trim()
    .split('\n')
    .filter((l) => l.includes(entityName));
  const dedupKey = dedupLines[0]?.trim() ?? insertion.trim().split('\n')[0]?.trim() ?? '';
  if (dedupKey && content.includes(dedupKey)) {
    console.warn(`  SKIP ${label}: already wired`);
    return;
  }
  const updated = content.replace(marker, `${insertion}\n  ${marker}`);
  fs.writeFileSync(filePath, updated, 'utf-8');
  ledger.filesModified.push(relPath);
}

function insertImportAtMarker(
  filePath: string,
  marker: string,
  importLine: string,
  _label: string,
): void {
  const relPath = path.relative(ROOT, filePath);
  if (!fs.existsSync(filePath)) {
    console.error(`FATAL: File not found for import insertion: ${relPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes(marker)) {
    console.error(`FATAL: Marker "${marker}" not found in ${relPath}`);
    process.exit(1);
  }
  if (content.includes(importLine.trim())) {
    return; // already imported
  }
  const updated = content.replace(marker, `${importLine}\n${marker}`);
  fs.writeFileSync(filePath, updated, 'utf-8');
}

// ── Action verbs ─────────────────────────────────────────

const baseVerbs = ['create', 'update', 'delete', 'restore'];
const docVerbs = ['submit', 'cancel', 'approve', 'reject'];
const allVerbs = hasDoc ? [...baseVerbs, ...docVerbs] : baseVerbs;

// ══════════════════════════════════════════════════════════
// STEP 1: Schema (if not --skip-schema)
// ══════════════════════════════════════════════════════════

if (!skipSchema) {
  const schemaContent = `import { pgTable, text, jsonb } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { erpIndexes } from '../helpers/standard-indexes';

import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const ${camelPlural} = pgTable(
  '${entityName}',
  {
    ...erpEntityColumns,
    // TODO: Add entity-specific columns here
    description: text('description'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    ...erpIndexes(table, '${entityName}'),
    ...tenantPolicy(table),
  ],
);

export type ${pascalSingular} = InferSelectModel<typeof ${camelPlural}>;
export type New${pascalSingular} = InferInsertModel<typeof ${camelPlural}>;
`;
  writeIfNotExists(path.join(DB_SCHEMA, `${entityName}.ts`), schemaContent, 'Drizzle schema');
}

// ══════════════════════════════════════════════════════════
// STEP 2: CRUD handler
// ══════════════════════════════════════════════════════════

const handlerContent = `import { ${camelPlural} } from 'afenda-database';
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
    if (key in input) result[key] = input[key];
  }
  return result;
}

function toRecord(row: Record<string, unknown>): Record<string, unknown> {
  return { ...row };
}

export const ${camelPlural}Handler: EntityHandler = {
  async create(tx: NeonHttpDatabase, input: Record<string, unknown>, ctx: MutationContext): Promise<HandlerResult> {
    const allowed = pickAllowed(input);
    const [row] = await tx.insert(${camelPlural}).values({
      ...(allowed as any),
      createdBy: ctx.actor.userId,
      updatedBy: ctx.actor.userId,
    }).returning();
    if (!row) throw new Error('Insert returned no rows');
    return { entityId: row.id, before: null, after: toRecord(row as unknown as Record<string, unknown>), versionBefore: null, versionAfter: 1 };
  },

  async update(tx: NeonHttpDatabase, entityId: string, input: Record<string, unknown>, expectedVersion: number, ctx: MutationContext): Promise<HandlerResult> {
    const [beforeRow] = await tx.select().from(${camelPlural}).where(eq(${camelPlural}.id, entityId)).limit(1);
    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');
    const allowed = pickAllowed(input);
    const [afterRow] = await tx.update(${camelPlural}).set({
      ...(allowed as any),
      updatedBy: ctx.actor.userId,
      version: sql\`\${${camelPlural}.version} + 1\`,
    }).where(and(eq(${camelPlural}.id, entityId), eq(${camelPlural}.version, expectedVersion))).returning();
    if (!afterRow) throw new Error('CONFLICT_VERSION');
    return { entityId, before: toRecord(beforeRow as unknown as Record<string, unknown>), after: toRecord(afterRow as unknown as Record<string, unknown>), versionBefore: expectedVersion, versionAfter: afterRow.version };
  },

  async delete(tx: NeonHttpDatabase, entityId: string, expectedVersion: number, ctx: MutationContext): Promise<HandlerResult> {
    const [beforeRow] = await tx.select().from(${camelPlural}).where(eq(${camelPlural}.id, entityId)).limit(1);
    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');
    const [afterRow] = await tx.update(${camelPlural}).set({
      isDeleted: true, deletedAt: sql\`now()\`, deletedBy: ctx.actor.userId, updatedBy: ctx.actor.userId,
      version: sql\`\${${camelPlural}.version} + 1\`,
    }).where(and(eq(${camelPlural}.id, entityId), eq(${camelPlural}.version, expectedVersion))).returning();
    if (!afterRow) throw new Error('CONFLICT_VERSION');
    return { entityId, before: toRecord(beforeRow as unknown as Record<string, unknown>), after: toRecord(afterRow as unknown as Record<string, unknown>), versionBefore: expectedVersion, versionAfter: afterRow.version };
  },

  async restore(tx: NeonHttpDatabase, entityId: string, expectedVersion: number, ctx: MutationContext): Promise<HandlerResult> {
    const [beforeRow] = await tx.select().from(${camelPlural}).where(eq(${camelPlural}.id, entityId)).limit(1);
    if (!beforeRow) throw new Error('NOT_FOUND');
    if (!beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');
    const [afterRow] = await tx.update(${camelPlural}).set({
      isDeleted: false, deletedAt: null, deletedBy: null, updatedBy: ctx.actor.userId,
      version: sql\`\${${camelPlural}.version} + 1\`,
    }).where(and(eq(${camelPlural}.id, entityId), eq(${camelPlural}.version, expectedVersion))).returning();
    if (!afterRow) throw new Error('CONFLICT_VERSION');
    return { entityId, before: toRecord(beforeRow as unknown as Record<string, unknown>), after: toRecord(afterRow as unknown as Record<string, unknown>), versionBefore: expectedVersion, versionAfter: afterRow.version };
  },
};
`;
writeIfNotExists(path.join(CRUD_HANDLERS, `${entityName}.ts`), handlerContent, 'CRUD handler');

// ══════════════════════════════════════════════════════════
// STEP 3: Smoke test
// ══════════════════════════════════════════════════════════

const testContent = `import { describe, it, expect } from 'vitest';

import { ENTITY_TYPES, ACTION_TYPES } from 'afenda-canon';

describe('${pascalPlural} entity registration', () => {
  it('${entityName} is in ENTITY_TYPES', () => {
    expect(ENTITY_TYPES).toContain('${entityName}');
  });

${allVerbs
  .map(
    (v) => `  it('${entityName}.${v} is in ACTION_TYPES', () => {
    expect(ACTION_TYPES).toContain('${entityName}.${v}');
  });`,
  )
  .join('\n\n')}
});
`;
writeIfNotExists(path.join(CRUD_TESTS, `${entityName}.smoke.test.ts`), testContent, 'Smoke test');

// ══════════════════════════════════════════════════════════
// STEP 4: Search adapter stub
// ══════════════════════════════════════════════════════════

const searchContent = `import { dbRo, ${camelPlural}, and, sql, ilike, isNull, or, desc } from 'afenda-database';

import { ftsRank, ftsWhere } from '../fts';

import type { SearchResult } from '../types';

/**
 * ${pascalPlural} search adapter.
 * Uses tsvector FTS for queries >= 3 chars, ILIKE fallback otherwise.
 * TODO: Customize FTS columns and ILIKE patterns for this entity.
 */
export async function search${pascalPlural}(
  query: string,
  limit: number,
): Promise<SearchResult[]> {
  const normalized = query.trim().replace(/\\s+/g, ' ');
  if (!normalized) return [];

  const useFts = normalized.length >= 3 && !normalized.includes('@');

  if (useFts) {
    const tsvec = sql\`"${entityName}"."search_vector"\`;
    const where = ftsWhere(tsvec, normalized);
    if (!where) return [];
    const rank = ftsRank(tsvec, normalized);
    const rows = await dbRo
      .select({ id: ${camelPlural}.id, rank })
      .from(${camelPlural})
      .where(and(isNull(${camelPlural}.deletedAt), where))
      .orderBy(desc(rank))
      .limit(limit);
    return rows.map((row) => ({
      id: row.id,
      type: '${entityName}',
      title: row.id, // TODO: replace with display column
      subtitle: null,
      score: typeof row.rank === 'number' ? row.rank : 0,
    }));
  }

  // ILIKE fallback
  const pattern = \`%\${normalized}%\`;
  const rows = await dbRo
    .select({ id: ${camelPlural}.id })
    .from(${camelPlural})
    .where(and(isNull(${camelPlural}.deletedAt), ilike(${camelPlural}.id, pattern)))
    .limit(limit);
  return rows.map((row, idx) => ({
    id: row.id,
    type: '${entityName}',
    title: row.id, // TODO: replace with display column
    subtitle: null,
    score: 1 - idx * 0.01,
  }));
}
`;
writeIfNotExists(path.join(SEARCH_ADAPTERS, `${entityName}.ts`), searchContent, 'Search adapter');

// ══════════════════════════════════════════════════════════
// STEP 5–10: Auto-wiring via markers
// ══════════════════════════════════════════════════════════

// 5a. Schema barrel
insertAtMarker(
  path.join(DB_SCHEMA, 'index.ts'),
  '// @entity-gen:schema-barrel',
  `export { ${camelPlural} } from './${entityName}';\nexport type { ${pascalSingular}, New${pascalSingular} } from './${entityName}';`,
  'Schema barrel',
);
ledger.registries.push('schema barrel');

// 5b. ENTITY_TYPES
insertAtMarker(
  path.join(CANON_TYPES, 'entity.ts'),
  '// @entity-gen:entity-types',
  `'${entityName}',`,
  'ENTITY_TYPES',
);
ledger.registries.push('ENTITY_TYPES');

// 5c. ACTION_TYPES
const actionTypeEntries = allVerbs.map((v) => `'${entityName}.${v}',`).join('\n  ');
insertAtMarker(
  path.join(CANON_TYPES, 'action.ts'),
  '// @entity-gen:action-types',
  actionTypeEntries,
  'ACTION_TYPES',
);
ledger.actionTypes = allVerbs.map((v) => `${entityName}.${v}`);
ledger.registries.push('ACTION_TYPES');

// 5d. CAPABILITY_CATALOG
const capEntries = [
  `'${entityName}.create': { key: '${entityName}.create', intent: 'Create a new ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['${entityName}'] },`,
  `'${entityName}.update': { key: '${entityName}.update', intent: 'Update an existing ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['${entityName}'] },`,
  `'${entityName}.delete': { key: '${entityName}.delete', intent: 'Soft-delete a ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['${entityName}'], risks: ['irreversible'] },`,
  `'${entityName}.restore': { key: '${entityName}.restore', intent: 'Restore a soft-deleted ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['${entityName}'] },`,
  `'${entityName}.read': { key: '${entityName}.read', intent: 'Read a single ${singular}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['${entityName}'] },`,
  `'${entityName}.list': { key: '${entityName}.list', intent: 'List ${entityName}', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['${entityName}'] },`,
  `'${entityName}.versions': { key: '${entityName}.versions', intent: 'View version history', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['${entityName}', 'audit'] },`,
  `'${entityName}.audit': { key: '${entityName}.audit', intent: 'View audit trail', scope: 'org', status: 'active', entities: ['${entityName}'], tags: ['${entityName}', 'audit'] },`,
].join('\n  ');
insertAtMarker(
  path.join(CANON_TYPES, 'capability.ts'),
  '// @entity-gen:capability-catalog',
  capEntries,
  'CAPABILITY_CATALOG',
);
ledger.registries.push('CAPABILITY_CATALOG');

// 5e. HANDLER_REGISTRY (mutate.ts) — import + registry entry
const mutateFile = path.join(CRUD_SRC, 'mutate.ts');
insertImportAtMarker(
  mutateFile,
  '// @entity-gen:handler-import',
  `import { ${camelPlural}Handler } from './handlers/${entityName}';`,
  'Handler import',
);
insertAtMarker(
  mutateFile,
  '// @entity-gen:handler-registry',
  `${entityName}: ${camelPlural}Handler,`,
  'HANDLER_REGISTRY',
);
ledger.registries.push('HANDLER_REGISTRY');

// 5f. TABLE_REGISTRY (mutate.ts)
insertAtMarker(
  mutateFile,
  '// @entity-gen:table-registry-mutate',
  `${entityName}: ${camelPlural},`,
  'TABLE_REGISTRY (mutate)',
);
ledger.registries.push('TABLE_REGISTRY (mutate)');

// 5g. TABLE_REGISTRY (read.ts) — import + registry entry
const readFile = path.join(CRUD_SRC, 'read.ts');
insertImportAtMarker(
  readFile,
  '// @entity-gen:read-import',
  `import { ${camelPlural} } from 'afenda-database';`,
  'Read import',
);

// For read.ts, the table is already imported via afenda-database barrel for contacts.
// For new entities, we need to add it to the destructured import or add a separate import.
// The insertImportAtMarker handles this — but we also need to add to TABLE_REGISTRY.
insertAtMarker(
  readFile,
  '// @entity-gen:table-registry-read',
  `${entityName}: ${camelPlural},`,
  'TABLE_REGISTRY (read)',
);
ledger.registries.push('TABLE_REGISTRY (read)');

// 5h. Handler metadata (handler-meta.ts)
const handlerMetaFile = path.join(CRUD_SRC, 'handler-meta.ts');
if (fs.existsSync(handlerMetaFile)) {
  const verbList = allVerbs.map((v) => `'${v}'`).join(', ');
  insertAtMarker(
    handlerMetaFile,
    '// @entity-gen:handler-meta',
    `${entityName}: [${verbList}],`,
    'Handler meta',
  );
  ledger.registries.push('HANDLER_META');
}

// 5i. Nav config
insertAtMarker(
  NAV_CONFIG,
  '// @entity-gen:nav-items',
  `{
    label: '${pascalPlural}',
    href: (slug) => \`/org/\${slug}/${entityName}\`,
    icon: Users,
    group: 'main',
    commandPaletteAction: 'Open ${pascalPlural}',
  },`,
  'NAV_ITEMS',
);
ledger.registries.push('NAV_ITEMS');

// ══════════════════════════════════════════════════════════
// STEP 11: UI scaffold (W3 templates)
// ══════════════════════════════════════════════════════════

// Contract
const contractContent = `import type { EntityContract } from 'afenda-canon';

export const ${entityName.toUpperCase()}_CONTRACT: EntityContract = {
  entityType: '${entityName}',
  label: '${pascalSingular}',
  labelPlural: '${pascalPlural}',
  hasLifecycle: ${hasDoc},
  hasSoftDelete: true,
  transitions: [${
    hasDoc
      ? `
    { from: 'draft', allowed: ['update', 'delete', 'submit'] },
    { from: 'submitted', allowed: ['approve', 'reject', 'cancel'] },
    { from: 'active', allowed: ['update', 'cancel', 'delete'] },
    { from: 'cancelled', allowed: ['restore'] },`
      : `
    // No lifecycle transitions — spine entity`
  }
  ],
  updateModes: ['edit', 'correct'],
  reasonRequired: [${hasDoc ? `'reject', 'cancel'` : ''}],
  workflowDecisions: [${hasDoc ? `'approve', 'reject'` : ''}],
  primaryVerbs: ['update', 'delete'],
  secondaryVerbs: ['restore'],
};
`;
writeIfNotExists(
  path.join(WEB_ENTITY, '_components', `${singular}-contract.ts`),
  contractContent,
  'Entity contract',
);

// Columns
const columnsContent = `import { textColumn, dateColumn } from '../../_components/crud/client/entity-columns';

import type { ColumnDef } from '@tanstack/react-table';

export interface ${pascalSingular}Row {
  id: string;
  // TODO: Add entity-specific columns
  description: string | null;
  version: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const ${singular}Columns: ColumnDef<${pascalSingular}Row, unknown>[] = [
  // TODO: Add entity-specific column defs
  textColumn<${pascalSingular}Row>('description', 'Description'),
  dateColumn<${pascalSingular}Row>('created_at', 'Created'),
];
`;
writeIfNotExists(
  path.join(WEB_ENTITY, '_components', `${singular}-columns.ts`),
  columnsContent,
  'Column defs',
);

// Fields
const fieldsContent = `import { z } from 'zod';

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

export const ${entityName.toUpperCase()}_FIELDS: FieldDef[] = [
  // TODO: Add entity-specific fields
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description...' },
];

export const ${singular}FormSchema = z.object({
  // TODO: Add entity-specific validation
  description: z.string().max(2000).optional(),
});

export type ${pascalSingular}FormValues = z.infer<typeof ${singular}FormSchema>;
`;
writeIfNotExists(
  path.join(WEB_ENTITY, '_components', `${singular}-fields.ts`),
  fieldsContent,
  'Field defs',
);

// Query server
const queryContent = `import { cache } from 'react';

import { get${pascalSingular}, get${pascalPlural}, getDeleted${pascalPlural} } from '@/app/actions/${entityName}';

import type { ${pascalSingular}Row } from '../_components/${singular}-columns';

export const list${pascalPlural} = cache(async (): Promise<${pascalSingular}Row[]> => {
  const response = await get${pascalPlural}({ limit: 100 });
  if (!response.ok) return [];
  return response.data as ${pascalSingular}Row[];
});

export const read${pascalSingular} = cache(async (id: string): Promise<${pascalSingular}Row | null> => {
  const response = await get${pascalSingular}(id);
  if (!response.ok) return null;
  return response.data as ${pascalSingular}Row;
});

export const listTrashed${pascalPlural} = cache(async (): Promise<${pascalSingular}Row[]> => {
  const response = await getDeleted${pascalPlural}({ limit: 100 });
  if (!response.ok) return [];
  return (response.data as ${pascalSingular}Row[]).filter((r) => r.is_deleted);
});
`;
writeIfNotExists(
  path.join(WEB_ENTITY, '_server', `${entityName}.query_server.ts`),
  queryContent,
  'Query server',
);

// Policy server
const policyContent = `import { resolveActions } from '../../_components/crud/server/action-resolver_server';
import { ${entityName.toUpperCase()}_CONTRACT } from '../_components/${singular}-contract';

import type { OrgContext } from '../../_server/org-context_server';
import type { ResolvedActions } from 'afenda-canon';

export function resolve${pascalSingular}Actions(
  ctx: OrgContext,
  entity: { docStatus?: string | null; isDeleted: boolean },
): ResolvedActions {
  return resolveActions({
    contract: ${entityName.toUpperCase()}_CONTRACT,
    docStatus: (entity.docStatus as any) ?? null,
    isDeleted: entity.isDeleted,
    isLocked: false,
    actor: { userId: ctx.actor.userId, roles: ctx.actor.roles, orgRole: ctx.actor.orgRole },
  });
}
`;
writeIfNotExists(
  path.join(WEB_ENTITY, '_server', `${entityName}.policy_server.ts`),
  policyContent,
  'Policy server',
);

// Server actions (sealed dispatcher contract)
const serverActionsContent = `'use server';

import { randomUUID } from 'crypto';

import { revalidatePath } from 'next/cache';

import {
  create${pascalSingular},
  delete${pascalSingular},
  restore${pascalSingular},
  update${pascalSingular},
} from '@/app/actions/${entityName}';
import { auth } from '@/lib/auth/server';

import {
  logActionError,
  logActionStart,
  logActionSuccess,
} from '../../_components/crud/server/action-logger_server';

import type { ActionEnvelope, ApiResponse, ErrorCode, JsonValue } from 'afenda-canon';

function errorResponse(code: ErrorCode, message: string): ApiResponse {
  return { ok: false, error: { code, message }, meta: { requestId: randomUUID() } };
}

export async function executeEntityAction(
  envelope: ActionEnvelope,
  extra: { expectedVersion?: number; input?: JsonValue; orgSlug?: string },
): Promise<ApiResponse> {
  const start = Date.now();
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? '';
  if (!userId) return errorResponse('POLICY_DENIED', 'No active session');

  logActionStart(envelope, { userId });

  try {
    let result: ApiResponse;
    switch (envelope.kind) {
      case 'create':
        result = await create${pascalSingular}(extra.input ?? {});
        break;
      case 'update':
        if (!envelope.entityId || extra.expectedVersion === undefined)
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        result = await update${pascalSingular}(envelope.entityId, extra.expectedVersion, extra.input ?? {});
        break;
      case 'delete':
        if (!envelope.entityId || extra.expectedVersion === undefined)
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        result = await delete${pascalSingular}(envelope.entityId, extra.expectedVersion);
        break;
      case 'restore':
        if (!envelope.entityId || extra.expectedVersion === undefined)
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        result = await restore${pascalSingular}(envelope.entityId, extra.expectedVersion);
        break;
      default:
        return errorResponse('VALIDATION_FAILED', \`Unsupported action kind: \${envelope.kind}\`);
    }

    const durationMs = Date.now() - start;
    if (result.ok) {
      logActionSuccess(envelope, { userId, durationMs });
      const slug = extra.orgSlug ?? envelope.orgId;
      revalidatePath(\`/org/\${slug}/${entityName}\`);
      if (envelope.entityId) revalidatePath(\`/org/\${slug}/${entityName}/\${envelope.entityId}\`);
      revalidatePath(\`/org/\${slug}/${entityName}/trash\`);
    } else {
      logActionError(envelope, result.error, { userId, durationMs });
    }
    return result;
  } catch (error) {
    const durationMs = Date.now() - start;
    logActionError(envelope, error, { userId, durationMs });
    return errorResponse('INTERNAL_ERROR', 'Unexpected error');
  }
}
`;
writeIfNotExists(
  path.join(WEB_ENTITY, '_server', `${entityName}.server-actions.ts`),
  serverActionsContent,
  'Server actions',
);

// Server action (legacy actions file for query loaders)
const legacyActionsContent = `'use server';

import { generateEntityActions } from '@/lib/actions/entity-actions';

import type { ApiResponse, JsonValue } from 'afenda-canon';

const actions = generateEntityActions('${entityName}');

export async function create${pascalSingular}(input: JsonValue): Promise<ApiResponse> { return actions.create(input); }
export async function update${pascalSingular}(id: string, expectedVersion: number, input: JsonValue): Promise<ApiResponse> { return actions.update(id, expectedVersion, input); }
export async function delete${pascalSingular}(id: string, expectedVersion: number): Promise<ApiResponse> { return actions.remove(id, expectedVersion); }
export async function restore${pascalSingular}(id: string, expectedVersion: number): Promise<ApiResponse> { return actions.restore(id, expectedVersion); }
export async function get${pascalSingular}(id: string): Promise<ApiResponse> { return actions.read(id); }
export async function get${pascalPlural}(options?: { includeDeleted?: boolean; limit?: number; offset?: number }): Promise<ApiResponse> { return actions.list(options); }
export async function getDeleted${pascalPlural}(options?: { limit?: number }): Promise<ApiResponse> { return actions.list({ ...options, includeDeleted: true }); }
export async function get${pascalSingular}Versions(id: string): Promise<ApiResponse> { return actions.getVersions(id); }
export async function get${pascalSingular}AuditLogs(id: string): Promise<ApiResponse> { return actions.getAuditLogs(id); }
`;
writeIfNotExists(
  path.join(ROOT, 'apps', 'web', 'app', 'actions', `${entityName}.ts`),
  legacyActionsContent,
  'Legacy actions',
);

// ── Surface files ────────────────────────────────────────

const surfaces: Array<{ dir: string; surfaceId: string; page: string; exposes: string[] }> = [
  {
    dir: '',
    surfaceId: `web.${entityName}.list.page`,
    page: `/org/[slug]/${entityName}`,
    exposes: [`${entityName}.list`, `${entityName}.create`, `${entityName}.delete`],
  },
  {
    dir: '[id]',
    surfaceId: `web.${entityName}.detail.page`,
    page: `/org/[slug]/${entityName}/[id]`,
    exposes: [`${entityName}.read`, `${entityName}.update`, `${entityName}.delete`],
  },
  {
    dir: 'new',
    surfaceId: `web.${entityName}.new.page`,
    page: `/org/[slug]/${entityName}/new`,
    exposes: [`${entityName}.create`],
  },
  {
    dir: '[id]/edit',
    surfaceId: `web.${entityName}.edit.page`,
    page: `/org/[slug]/${entityName}/[id]/edit`,
    exposes: [`${entityName}.update`],
  },
  {
    dir: '[id]/versions',
    surfaceId: `web.${entityName}.versions.page`,
    page: `/org/[slug]/${entityName}/[id]/versions`,
    exposes: [`${entityName}.versions`],
  },
  {
    dir: '[id]/audit',
    surfaceId: `web.${entityName}.audit.page`,
    page: `/org/[slug]/${entityName}/[id]/audit`,
    exposes: [`${entityName}.audit`],
  },
  {
    dir: 'trash',
    surfaceId: `web.${entityName}.trash.page`,
    page: `/org/[slug]/${entityName}/trash`,
    exposes: [`${entityName}.list`, `${entityName}.restore`],
  },
];

for (const s of surfaces) {
  const surfaceContent = `export const SURFACE = {
  surfaceId: '${s.surfaceId}',
  page: '${s.page}',
  exposes: [${s.exposes.map((e) => `'${e}'`).join(', ')}],
} as const;
`;
  const dir = s.dir ? path.join(WEB_ENTITY, s.dir) : WEB_ENTITY;
  writeIfNotExists(path.join(dir, 'surface.ts'), surfaceContent, `Surface: ${s.surfaceId}`);
}

// ── Page stubs (list, detail, new, edit, versions, audit, trash) ──

const listPageContent = `import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from 'afenda-ui/components/button';
import { Plus, Trash2 } from 'lucide-react';

import { PageHeader } from '../_components/crud/client/page-header';
import { getOrgContext } from '../_server/org-context_server';

import { list${pascalPlural} } from './_server/${entityName}.query_server';

export default async function ${pascalPlural}ListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [rows, ctx] = await Promise.all([list${pascalPlural}(), getOrgContext(slug)]);
  if (!ctx) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="${pascalPlural}" description="Manage your organization's ${entityName}">
        <Button variant="outline" size="sm" asChild>
          <Link href={\`/org/\${slug}/${entityName}/trash\`}><Trash2 className="mr-2 h-4 w-4" />Trash</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={\`/org/\${slug}/${entityName}/new\`}><Plus className="mr-2 h-4 w-4" />New ${pascalSingular}</Link>
        </Button>
      </PageHeader>
      <pre className="text-xs">{JSON.stringify(rows.slice(0, 5), null, 2)}</pre>
    </div>
  );
}
`;
writeIfNotExists(path.join(WEB_ENTITY, 'page.tsx'), listPageContent, 'List page');

const detailPageContent = `import { notFound } from 'next/navigation';

import { Badge } from 'afenda-ui/components/badge';

import { EntityDetailLayout, MetadataCard } from '../../_components/crud/client/entity-detail-layout';
import { PageHeader } from '../../_components/crud/client/page-header';
import { getOrgContext } from '../../_server/org-context_server';

import { read${pascalSingular} } from '../_server/${entityName}.query_server';

export default async function ${pascalSingular}DetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const [row, ctx] = await Promise.all([read${pascalSingular}(id), getOrgContext(slug)]);
  if (!row || !ctx) notFound();

  return (
    <EntityDetailLayout
      header={
        <PageHeader title={row.id}>
          <Badge variant="secondary" className="text-xs">v{row.version}</Badge>
        </PageHeader>
      }
      main={<pre className="text-xs">{JSON.stringify(row, null, 2)}</pre>}
      sidebar={<MetadataCard><p className="text-xs text-muted-foreground">Created: {row.created_at}</p></MetadataCard>}
    />
  );
}
`;
writeIfNotExists(path.join(WEB_ENTITY, '[id]', 'page.tsx'), detailPageContent, 'Detail page');

const newPageContent = `import { notFound } from 'next/navigation';

import { PageHeader } from '../../_components/crud/client/page-header';
import { getOrgContext } from '../../_server/org-context_server';

export default async function New${pascalSingular}Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ctx = await getOrgContext(slug);
  if (!ctx) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="New ${pascalSingular}" description="Create a new ${singular}." />
      <p className="text-sm text-muted-foreground">TODO: Add ${singular} form</p>
    </div>
  );
}
`;
writeIfNotExists(path.join(WEB_ENTITY, 'new', 'page.tsx'), newPageContent, 'New page');

const editPageContent = `import { notFound } from 'next/navigation';

import { PageHeader } from '../../../_components/crud/client/page-header';
import { getOrgContext } from '../../../_server/org-context_server';

import { read${pascalSingular} } from '../../_server/${entityName}.query_server';

export default async function Edit${pascalSingular}Page({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const [row, ctx] = await Promise.all([read${pascalSingular}(id), getOrgContext(slug)]);
  if (!row || !ctx) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Edit ${pascalSingular}" description="Update ${singular} information." />
      <p className="text-sm text-muted-foreground">TODO: Add ${singular} form (prefilled)</p>
    </div>
  );
}
`;
writeIfNotExists(path.join(WEB_ENTITY, '[id]', 'edit', 'page.tsx'), editPageContent, 'Edit page');

const versionsPageContent = `import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Card, CardContent } from 'afenda-ui/components/card';
import { Separator } from 'afenda-ui/components/separator';
import { ArrowLeft, GitBranch } from 'lucide-react';

import { get${pascalSingular}, get${pascalSingular}Versions } from '@/app/actions/${entityName}';

import { getOrgContext } from '../../../_server/org-context_server';

export default async function ${pascalSingular}VersionsPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const [entityRes, versionsRes, ctx] = await Promise.all([
    get${pascalSingular}(id), get${pascalSingular}Versions(id), getOrgContext(slug),
  ]);
  if (!entityRes.ok || !ctx) notFound();

  const versions = versionsRes.ok ? (versionsRes.data as any[]) : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link href={\`/org/\${slug}/${entityName}/\${id}\`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />Back to detail
      </Link>
      <div className="flex items-center gap-3">
        <GitBranch className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">Version History</h1>
      </div>
      <Separator className="my-6" />
      {versions.length === 0 && (
        <Card><CardContent className="py-16 text-center"><p className="text-sm text-muted-foreground">No versions recorded.</p></CardContent></Card>
      )}
      {versions.length > 0 && <pre className="text-xs">{JSON.stringify(versions, null, 2)}</pre>}
    </div>
  );
}
`;
writeIfNotExists(
  path.join(WEB_ENTITY, '[id]', 'versions', 'page.tsx'),
  versionsPageContent,
  'Versions page',
);

const auditPageContent = `import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Card, CardContent } from 'afenda-ui/components/card';
import { Separator } from 'afenda-ui/components/separator';
import { ArrowLeft, FileText } from 'lucide-react';

import { get${pascalSingular}, get${pascalSingular}AuditLogs } from '@/app/actions/${entityName}';

export default async function ${pascalSingular}AuditPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const [entityRes, auditRes] = await Promise.all([get${pascalSingular}(id), get${pascalSingular}AuditLogs(id)]);
  if (!entityRes.ok) notFound();

  const logs = auditRes.ok ? (auditRes.data as any[]) : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link href={\`/org/\${slug}/${entityName}/\${id}\`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />Back to detail
      </Link>
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">Audit Trail</h1>
      </div>
      <Separator className="my-6" />
      {logs.length === 0 && (
        <Card><CardContent className="py-16 text-center"><p className="text-sm text-muted-foreground">No audit entries.</p></CardContent></Card>
      )}
      {logs.length > 0 && <pre className="text-xs">{JSON.stringify(logs, null, 2)}</pre>}
    </div>
  );
}
`;
writeIfNotExists(
  path.join(WEB_ENTITY, '[id]', 'audit', 'page.tsx'),
  auditPageContent,
  'Audit page',
);

const trashPageContent = `import { notFound } from 'next/navigation';

import { Card, CardContent } from 'afenda-ui/components/card';
import { Trash2 } from 'lucide-react';

import { PageHeader } from '../../_components/crud/client/page-header';
import { getOrgContext } from '../../_server/org-context_server';

import { listTrashed${pascalPlural} } from '../_server/${entityName}.query_server';

export default async function ${pascalPlural}TrashPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [rows, ctx] = await Promise.all([listTrashed${pascalPlural}(), getOrgContext(slug)]);
  if (!ctx) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Trash" description="Soft-deleted ${entityName} that can be restored." />
      {rows.length === 0 && (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Trash2 className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-medium">Trash is empty</h3>
        </CardContent></Card>
      )}
      {rows.length > 0 && <pre className="text-xs">{JSON.stringify(rows, null, 2)}</pre>}
    </div>
  );
}
`;
writeIfNotExists(path.join(WEB_ENTITY, 'trash', 'page.tsx'), trashPageContent, 'Trash page');

// ══════════════════════════════════════════════════════════
// LEDGER PRINTOUT
// ══════════════════════════════════════════════════════════

console.log(`
╔══════════════════════════════════════════════════════════╗
║  Entity Generator — Wiring Ledger: ${entityName.padEnd(22)}║
╠══════════════════════════════════════════════════════════╣`);

if (ledger.filesModified.length > 0) {
  console.log('║  Files modified:');
  for (const f of ledger.filesModified) console.log(`║    ✓ ${f}`);
}
if (ledger.filesCreated.length > 0) {
  console.log('║  Files created:');
  for (const f of ledger.filesCreated) console.log(`║    + ${f}`);
}
if (ledger.registries.length > 0) {
  console.log('║  Registries appended:');
  for (const r of ledger.registries) console.log(`║    ← ${r}`);
}
if (ledger.actionTypes.length > 0) {
  console.log('║  ActionTypes added:');
  console.log(`║    ${ledger.actionTypes.join(', ')}`);
}

console.log(`╠══════════════════════════════════════════════════════════╣
║  Manual steps remaining:                                 ║
║    1. pnpm db:generate && pnpm db:push                   ║
║    2. Seed meta_assets (if needed)                       ║
║    3. Customize stubs (columns, fields, handler allowlist)║
╚══════════════════════════════════════════════════════════╝
`);
