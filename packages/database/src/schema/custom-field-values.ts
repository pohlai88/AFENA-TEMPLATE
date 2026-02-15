import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { customFields } from './custom-fields';

/**
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const customFieldValues = pgTable(
  'custom_field_values',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    fieldId: uuid('field_id').notNull(),
    valueText: text('value_text'),
    valueInt: integer('value_int'),
    valueNumeric: numeric('value_numeric', { precision: 20, scale: 10 }),
    valueBool: boolean('value_bool'),
    valueDate: date('value_date'),
    valueTs: timestamp('value_ts', { withTimezone: true }),
    valueJson: jsonb('value_json'),
    valueUuid: uuid('value_uuid'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    updatedBy: text('updated_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    source: text('source').notNull().default('user'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    // Composite FK: prevents cross-entity field corruption
    foreignKey({
      columns: [table.orgId, table.entityType, table.fieldId],
      foreignColumns: [customFields.orgId, customFields.entityType, customFields.id],
      name: 'custom_field_values_field_fk',
    }),

    // One value per entity per field
    uniqueIndex('custom_field_values_org_entity_field_uniq').on(
      table.orgId,
      table.entityId,
      table.fieldId,
    ),

    // Hot path indexes
    index('custom_field_values_entity_lookup_idx').on(
      table.orgId,
      table.entityType,
      table.entityId,
    ),
    index('custom_field_values_field_lookup_idx').on(
      table.orgId,
      table.entityType,
      table.fieldId,
    ),

    // CHECK constraints
    check('custom_field_values_org_not_empty', sql`org_id <> ''`),
    check(
      'custom_field_values_source_chk',
      sql`source IN ('user','rule','import','system')`,
    ),
    check(
      'custom_field_values_exactly_one_typed_col',
      sql`(
        (value_text    IS NOT NULL)::int +
        (value_int     IS NOT NULL)::int +
        (value_numeric IS NOT NULL)::int +
        (value_bool    IS NOT NULL)::int +
        (value_date    IS NOT NULL)::int +
        (value_ts      IS NOT NULL)::int +
        (value_json    IS NOT NULL)::int +
        (value_uuid    IS NOT NULL)::int
        = 1
      )`,
    ),

    // RLS
    tenantPolicy(table),
  ],
);

export type CustomFieldValue = typeof customFieldValues.$inferSelect;
export type NewCustomFieldValue = typeof customFieldValues.$inferInsert;
