/**
 * Intercompany Agreements Table
 *
 * Master agreements governing intercompany transactions.
 * Defines terms, pricing, and applicable TP policies
 * between related entities.
 * Missing sub-ledger table — Phase 3, step 17.
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

export const icAgreements = pgTable(
  'ic_agreements',
  {
    ...erpEntityColumns,

    /** Agreement code / number */
    agreementCode: text('agreement_code').notNull(),
    /** Human-readable name */
    name: text('name').notNull(),
    /** Party A company ID */
    partyACompanyId: uuid('party_a_company_id').notNull(),
    /** Party B company ID */
    partyBCompanyId: uuid('party_b_company_id').notNull(),
    /** Agreement type: 'goods', 'services', 'loan', 'cost-sharing', 'royalty', 'management-fee' */
    agreementType: text('agreement_type').notNull(),
    /** Effective from date */
    effectiveFrom: date('effective_from').notNull(),
    /** Effective to date (null = open-ended) */
    effectiveTo: date('effective_to'),
    /** FK to tp_policies (associated transfer pricing policy) */
    tpPolicyId: uuid('tp_policy_id'),
    /** Terms and conditions (JSONB: pricing, payment terms, etc.) */
    terms: jsonb('terms')
      .notNull()
      .default(sql`'{}'::jsonb`),
    /** Whether this agreement is active */
    isActive: boolean('is_active').notNull().default(true),
    /** Notes */
    notes: text('notes'),
  },
  (table) => [
    tenantPk(table),
    index('ica_org_id_idx').on(table.orgId, table.id),
    index('ica_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by party companies
    index('ica_parties_idx').on(table.orgId, table.partyACompanyId, table.partyBCompanyId),
    // Unique agreement code
    uniqueIndex('ica_unique_code_idx').on(table.orgId, table.agreementCode),
    check('ica_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'ica_valid_type',
      sql`agreement_type IN ('goods', 'services', 'loan', 'cost-sharing', 'royalty', 'management-fee')`,
    ),
    check('ica_different_parties', sql`party_a_company_id <> party_b_company_id`),

    tenantPolicy(table),
  ],
);

export type IcAgreement = typeof icAgreements.$inferSelect;
export type NewIcAgreement = typeof icAgreements.$inferInsert;
