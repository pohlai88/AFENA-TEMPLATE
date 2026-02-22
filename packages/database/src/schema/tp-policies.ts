/**
 * Transfer Pricing Policies Table
 *
 * Arm's-length pricing policies for intercompany transactions.
 * Each policy defines the TP method, tested party, and profit-level
 * indicators (PLIs) for a specific transaction type.
 * Transfer Pricing spine table — Phase 3, step 15.
 */
import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  date,
  index,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const tpPolicies = pgTable(
  'tp_policies',
  {
    ...erpEntityColumns,

    /** Policy code (e.g., 'TP-MGMT-FEES-2025') */
    policyCode: text('policy_code').notNull(),
    /** Human-readable name */
    name: text('name').notNull(),
    /** TP method: 'cup', 'rpm', 'cpm', 'tnmm', 'psm' */
    tpMethod: text('tp_method').notNull(),
    /** Transaction type (e.g., 'management-fees', 'royalties', 'goods', 'services') */
    transactionType: text('transaction_type').notNull(),
    /** Tested party entity ID */
    testedPartyId: uuid('tested_party_id'),
    /** Counterparty entity ID */
    counterpartyId: uuid('counterparty_id'),
    /** Profit level indicators configuration (JSON) */
    pliConfig: jsonb('pli_config')
      .notNull()
      .default(sql`'{}'::jsonb`),
    /** Arm's-length range (JSON: { low, median, high }) */
    armLengthRange: jsonb('arm_length_range')
      .notNull()
      .default(sql`'{}'::jsonb`),
    /** Effective from date */
    effectiveFrom: date('effective_from').notNull(),
    /** Effective to date */
    effectiveTo: date('effective_to'),
    /** Whether this policy is active */
    isActive: boolean('is_active').notNull().default(true),
    /** Description / notes */
    description: text('description'),
  },
  (table) => [
    tenantPk(table),
    index('tpp_org_id_idx').on(table.orgId, table.id),
    index('tpp_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by transaction type
    index('tpp_tx_type_idx').on(table.orgId, table.transactionType),
    // Lookup by tested party
    index('tpp_tested_party_idx').on(table.orgId, table.testedPartyId),
    // Unique policy code per company
    uniqueIndex('tpp_unique_code_idx').on(table.orgId, table.companyId, table.policyCode),
    check('tpp_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('tpp_valid_method', sql`tp_method IN ('cup', 'rpm', 'cpm', 'tnmm', 'psm')`),

    tenantPolicy(table),
  ],
);

export type TpPolicy = typeof tpPolicies.$inferSelect;
export type NewTpPolicy = typeof tpPolicies.$inferInsert;
