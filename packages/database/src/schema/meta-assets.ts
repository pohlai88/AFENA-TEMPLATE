import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

export const metaAssets = pgTable(
  'meta_assets',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    assetType: text('asset_type').notNull(),
    assetKey: text('asset_key').notNull(),
    canonicalName: text('canonical_name').notNull(),
    displayName: text('display_name').notNull(),
    description: text('description'),
    ownerTeam: text('owner_team'),
    stewardUser: text('steward_user'),
    classification: text('classification'),
    qualityTier: text('quality_tier'),
    tags: text('tags')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    tenantPk(table),
    index('meta_assets_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('meta_assets_org_asset_key_uniq').on(table.orgId, table.assetKey),
    check('meta_assets_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type MetaAsset = typeof metaAssets.$inferSelect;
export type NewMetaAsset = typeof metaAssets.$inferInsert;
