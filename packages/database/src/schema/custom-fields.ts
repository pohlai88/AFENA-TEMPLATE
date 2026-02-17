import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

export const customFields = pgTable(
  'custom_fields',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    entityType: text('entity_type').notNull(),
    fieldName: text('field_name').notNull(),
    fieldLabel: text('field_label').notNull(),
    fieldType: text('field_type').notNull(),
    typeConfig: jsonb('type_config')
      .notNull()
      .default(sql`'{}'::jsonb`),
    storageMode: text('storage_mode').notNull().default('jsonb_only'),
    defaultValue: jsonb('default_value'),
    isRequired: boolean('is_required').notNull().default(false),
    isSearchable: boolean('is_searchable').notNull().default(false),
    isFilterable: boolean('is_filterable').notNull().default(false),
    isSortable: boolean('is_sortable').notNull().default(false),
    displayOrder: integer('display_order').notNull().default(0),
    section: text('section'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    updatedBy: text('updated_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    isActive: boolean('is_active').notNull().default(true),
    isLocked: boolean('is_locked').notNull().default(false),
    isDeprecated: boolean('is_deprecated').notNull().default(false),
    isUnique: boolean('is_unique').notNull().default(false),
    schemaHash: text('schema_hash').notNull(),
  },
  (table) => [
    // Indexes
    index('custom_fields_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('custom_fields_org_entity_field_name_uniq').on(
      table.orgId,
      table.entityType,
      table.fieldName,
    ),
    uniqueIndex('custom_fields_org_entity_id_uniq').on(
      table.orgId,
      table.entityType,
      table.id,
    ),

    // CHECK constraints
    check('custom_fields_org_not_empty', sql`org_id <> ''`),
    check(
      'custom_fields_field_name_snake',
      sql`field_name ~ '^[a-z][a-z0-9_]*$'`,
    ),
    check(
      'custom_fields_storage_mode_chk',
      sql`storage_mode IN ('jsonb_only','indexed')`,
    ),
    check(
      'custom_fields_required_needs_default',
      sql`is_required = false OR default_value IS NOT NULL`,
    ),
    check(
      'custom_fields_type_config_is_object',
      sql`jsonb_typeof(type_config) = 'object'`,
    ),
    check(
      'custom_fields_type_config_enum_choices',
      sql`field_type NOT IN ('enum','multi_enum') OR (type_config ? 'choices')`,
    ),
    check(
      'custom_fields_type_config_short_text_maxlen',
      sql`field_type <> 'short_text' OR (type_config ? 'maxLength')`,
    ),
    check(
      'custom_fields_type_config_entity_ref_target',
      sql`field_type <> 'entity_ref' OR (type_config ? 'targetEntity')`,
    ),

    // RLS
    tenantPolicy(table),
  ],
);

export type CustomField = typeof customFields.$inferSelect;
export type NewCustomField = typeof customFields.$inferInsert;
