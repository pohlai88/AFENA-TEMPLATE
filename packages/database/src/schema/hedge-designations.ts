/**
 * Hedge Designations Table
 *
 * IFRS 9 section 6 hedge accounting designations.
 * Each designation links a hedging instrument to a hedged item
 * and documents the hedge relationship type and strategy.
 * IFRS P2 table — Phase 3, step 16.
 */
import { sql } from 'drizzle-orm';
import { boolean, check, date, index, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const hedgeDesignations = pgTable(
  'hedge_designations',
  {
    ...docEntityColumns,

    /** Designation reference number */
    designationNo: text('designation_no').notNull(),
    /** Hedge type: 'fair-value', 'cash-flow', 'net-investment' */
    hedgeType: text('hedge_type').notNull(),
    /** FK to financial_instruments (hedging instrument) */
    hedgingInstrumentId: uuid('hedging_instrument_id').notNull(),
    /** Description of the hedged item / risk */
    hedgedItem: text('hedged_item').notNull(),
    /** Hedged risk: 'interest-rate', 'fx', 'commodity-price', 'credit', 'equity-price' */
    hedgedRisk: text('hedged_risk').notNull(),
    /** Hedge ratio (e.g., 1.0 = fully hedged) */
    hedgeRatio: text('hedge_ratio').notNull().default('1'),
    /** Designation date */
    designationDate: date('designation_date').notNull(),
    /** De-designation date (null if still active) */
    deDesignationDate: date('de_designation_date'),
    /** Whether the hedge is currently active */
    isActive: boolean('is_active').notNull().default(true),
    /** Hedge documentation (JSON: economic relationship, risk management strategy) */
    documentation: jsonb('documentation')
      .notNull()
      .default(sql`'{}'::jsonb`),
    /** Latest effectiveness test result: 'effective', 'ineffective', 'pending' */
    effectivenessStatus: text('effectiveness_status').notNull().default('pending'),
  },
  (table) => [
    tenantPk(table),
    index('hd_org_id_idx').on(table.orgId, table.id),
    index('hd_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by hedge type
    index('hd_type_idx').on(table.orgId, table.hedgeType),
    // Lookup by hedging instrument
    index('hd_instrument_idx').on(table.orgId, table.hedgingInstrumentId),
    // Active hedges
    index('hd_active_idx').on(table.orgId, table.isActive),
    check('hd_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('hd_valid_type', sql`hedge_type IN ('fair-value', 'cash-flow', 'net-investment')`),
    check(
      'hd_valid_risk',
      sql`hedged_risk IN ('interest-rate', 'fx', 'commodity-price', 'credit', 'equity-price')`,
    ),
    check(
      'hd_valid_effectiveness',
      sql`effectiveness_status IN ('effective', 'ineffective', 'pending')`,
    ),

    tenantPolicy(table),
  ],
);

export type HedgeDesignation = typeof hedgeDesignations.$inferSelect;
export type NewHedgeDesignation = typeof hedgeDesignations.$inferInsert;
