import { sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

/**
 * API keys for external integrations.
 * Keys are stored as SHA-256 hashes — the raw key is shown once at creation.
 * Scoped to an organization via org_id + RLS.
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const apiKeys = pgTable(
  'api_keys',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    label: text('label').notNull(),
    keyHash: text('key_hash').notNull(),
    keyPrefix: text('key_prefix').notNull(),
    scopes: text('scopes').array().notNull().default(sql`'{}'::text[]`),
    createdBy: text('created_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('api_keys_org_idx').on(table.orgId),
    index('api_keys_hash_idx').on(table.keyHash),
    check('api_keys_org_not_empty', sql`org_id <> ''`),
    check('api_keys_label_not_empty', sql`label <> ''`),
    tenantPolicy(table),
  ],
);

export type ApiKey = InferSelectModel<typeof apiKeys>;
export type NewApiKey = InferInsertModel<typeof apiKeys>;
