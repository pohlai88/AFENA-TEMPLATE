import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { metaAssets } from './meta-assets';

export const metaLineageEdges = pgTable(
  'meta_lineage_edges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    fromAssetId: uuid('from_asset_id')
      .notNull()
      .references(() => metaAssets.id, { onDelete: 'cascade' }),
    toAssetId: uuid('to_asset_id')
      .notNull()
      .references(() => metaAssets.id, { onDelete: 'cascade' }),
    edgeType: text('edge_type').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('meta_lineage_edges_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('meta_lineage_edges_uniq').on(
      table.orgId,
      table.fromAssetId,
      table.toAssetId,
      table.edgeType,
    ),
    check('meta_lineage_edges_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type MetaLineageEdge = typeof metaLineageEdges.$inferSelect;
export type NewMetaLineageEdge = typeof metaLineageEdges.$inferInsert;
