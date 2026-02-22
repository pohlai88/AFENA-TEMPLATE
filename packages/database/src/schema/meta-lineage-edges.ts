import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { metaAssets } from './meta-assets';
import { tenantPk, tenantFk, tenantFkIndex} from '../helpers/base-entity';

export const metaLineageEdges = pgTable(
  'meta_lineage_edges',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
    fromAssetId: uuid('from_asset_id')
      .notNull(),
    toAssetId: uuid('to_asset_id')
      .notNull(),
    edgeType: text('edge_type').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    tenantPk(table),
    tenantFk(table, 'to_asset', table.toAssetId, metaAssets, 'cascade'),
    tenantFkIndex(table, 'to_asset', table.toAssetId),
    tenantFk(table, 'from_asset', table.fromAssetId, metaAssets, 'cascade'),
    tenantFkIndex(table, 'from_asset', table.fromAssetId),
    index('meta_lineage_edges_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('meta_lineage_edges_uniq').on(
      table.orgId,
      table.fromAssetId,
      table.toAssetId,
      table.edgeType,
    ),
    check('meta_lineage_edges_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    tenantPolicy(table),
  ],
);

export type MetaLineageEdge = typeof metaLineageEdges.$inferSelect;
export type NewMetaLineageEdge = typeof metaLineageEdges.$inferInsert;
