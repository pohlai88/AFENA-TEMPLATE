import { sql } from 'drizzle-orm';
import { bigint, check, foreignKey, index, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Landed cost documents — captures additional costs for inventory valuation.
 *
 * RULE C-01: Landed costs are ISSUER-scoped (company incurs landed costs).
 * PRD Phase E #24 + G0.13:
 * - Allocation basis: qty, value, weight, custom
 * - Posts immediately or on bill receipt
 * - Links to purchase receipt for cost allocation
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const landedCostDocs = pgTable(
  'landed_cost_docs',
  {
    ...docEntityColumns,
    docNo: text('doc_no'),
    receiptId: uuid('receipt_id'),
    vendorId: uuid('vendor_id'),
    totalCostMinor: bigint('total_cost_minor', { mode: 'number' }).notNull().default(0),
    currencyCode: text('currency_code').notNull().default('MYR'),
    fxRate: text('fx_rate'),
    baseTotalCostMinor: bigint('base_total_cost_minor', { mode: 'number' }).notNull().default(0),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'landed_cost_docs_company_fk',
    }),
    index('lc_docs_org_id_idx').on(table.orgId, table.id),
    index('lc_docs_company_idx').on(table.orgId, table.companyId),
    index('lc_docs_receipt_idx').on(table.orgId, table.receiptId),
    check('lc_docs_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type LandedCostDoc = typeof landedCostDocs.$inferSelect;
export type NewLandedCostDoc = typeof landedCostDocs.$inferInsert;

/**
 * Landed cost allocations — per-line cost allocation to receipt lines.
 */
export const landedCostAllocations = pgTable(
  'landed_cost_allocations',
  {
    ...baseEntityColumns,
    landedCostDocId: uuid('landed_cost_doc_id').notNull(),
    receiptLineId: uuid('receipt_line_id').notNull(),
    allocationMethod: text('allocation_method').notNull().default('qty'),
    allocatedCostMinor: bigint('allocated_cost_minor', { mode: 'number' }).notNull(),
    currencyCode: text('currency_code').notNull().default('MYR'),
    baseAllocatedCostMinor: bigint('base_allocated_cost_minor', { mode: 'number' }).notNull(),
    memo: text('memo'),
  },
  (table) => [
    index('lc_alloc_org_id_idx').on(table.orgId, table.id),
    index('lc_alloc_doc_idx').on(table.orgId, table.landedCostDocId),
    index('lc_alloc_receipt_line_idx').on(table.orgId, table.receiptLineId),
    check('lc_alloc_org_not_empty', sql`org_id <> ''`),
    check('lc_alloc_method_valid', sql`allocation_method IN ('qty', 'value', 'weight', 'custom')`),
    check('lc_alloc_cost_positive', sql`allocated_cost_minor > 0`),
    tenantPolicy(table),
  ],
);

export type LandedCostAllocation = typeof landedCostAllocations.$inferSelect;
export type NewLandedCostAllocation = typeof landedCostAllocations.$inferInsert;
