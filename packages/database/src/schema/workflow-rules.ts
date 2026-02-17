import { sql } from 'drizzle-orm';
import { boolean, check, index, integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Workflow Rules — per-org customizable rules stored in DB.
 * Loaded by the workflow engine at mutation time (TTL-cached).
 * JSON condition/action fields are interpreted into ConditionFn/ActionFn at load.
 */
export const workflowRules = pgTable(
  'workflow_rules',
  {
    ...baseEntityColumns,
    name: text('name').notNull(),
    description: text('description'),
    timing: text('timing').notNull(),
    entityTypes: text('entity_types').array().notNull().default(sql`'{}'::text[]`),
    verbs: text('verbs').array().notNull().default(sql`'{}'::text[]`),
    priority: integer('priority').notNull().default(100),
    enabled: boolean('enabled').notNull().default(true),
    conditionJson: jsonb('condition_json').notNull(),
    actionJson: jsonb('action_json').notNull(),
  },
  (table) => [
    index('workflow_rules_org_id_idx').on(table.orgId, table.id),
    index('workflow_rules_org_enabled_idx').on(table.orgId, table.enabled),
    check('workflow_rules_org_not_empty', sql`org_id <> ''`),
    check('workflow_rules_timing_check', sql`timing in ('before', 'after')`),
    tenantPolicy(table),
  ]
);

export type WorkflowRuleRow = typeof workflowRules.$inferSelect;
export type NewWorkflowRuleRow = typeof workflowRules.$inferInsert;
