import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { boolean, check, index, jsonb, pgTable, text, timestamp, integer, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

/**
 * Workflow V2 Definitions — envelope, org_patch, or compiled effective.
 *
 * definition_kind discriminator with CHECK constraints:
 * - 'envelope': nodes_json + edges_json + slots_json required
 * - 'org_patch': body_patches_json + base_ref required
 * - 'effective': compiled_json + compiled_hash + nodes_json + edges_json required
 *
 * Triggers (from migration 0040):
 * - reject_published_definition_mutation: WF-04 immutability
 * - reject_default_definition_mutation: system envelopes immutable
 * - set_updated_at
 */
export const workflowDefinitions = pgTable(
  'workflow_definitions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id').notNull().default(sql`(auth.require_org_id())`),
    entityType: text('entity_type').notNull(),
    name: text('name').notNull(),
    version: integer('version').notNull().default(1),
    status: text('status').notNull().default('draft'),
    isDefault: boolean('is_default').notNull().default(false),
    definitionKind: text('definition_kind').notNull(),

    // Envelope fields (definition_kind='envelope')
    nodesJson: jsonb('nodes_json'),
    edgesJson: jsonb('edges_json'),
    slotsJson: jsonb('slots_json'),

    // Org patch fields (definition_kind='org_patch')
    baseRef: jsonb('base_ref'),
    bodyPatchesJson: jsonb('body_patches_json'),

    // Compiled effective fields (definition_kind='effective')
    compiledJson: jsonb('compiled_json'),
    compiledHash: text('compiled_hash'),
    compilerVersion: text('compiler_version'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Constraints
    check('wf_def_org_not_empty', sql`org_id <> ''`),
    check('wf_def_status_valid', sql`status IN ('draft', 'published', 'archived')`),
    check('wf_def_kind_valid', sql`definition_kind IN ('envelope', 'org_patch', 'effective')`),
    check('wf_def_envelope_check', sql`
      definition_kind <> 'envelope' OR (
        nodes_json IS NOT NULL AND edges_json IS NOT NULL AND slots_json IS NOT NULL
        AND body_patches_json IS NULL
      )
    `),
    check('wf_def_org_patch_check', sql`
      definition_kind <> 'org_patch' OR (
        body_patches_json IS NOT NULL AND base_ref IS NOT NULL
        AND nodes_json IS NULL AND edges_json IS NULL
      )
    `),
    check('wf_def_effective_check', sql`
      definition_kind <> 'effective' OR (
        compiled_json IS NOT NULL AND compiled_hash IS NOT NULL
        AND nodes_json IS NOT NULL AND edges_json IS NOT NULL
      )
    `),

    // Indexes
    uniqueIndex('wf_def_org_entity_version_uniq').on(table.orgId, table.entityType, table.version),
    index('wf_def_org_entity_status_idx').on(table.orgId, table.entityType, table.status),

    // RLS
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ]
);

export type WorkflowDefinitionRow = typeof workflowDefinitions.$inferSelect;
export type NewWorkflowDefinitionRow = typeof workflowDefinitions.$inferInsert;
