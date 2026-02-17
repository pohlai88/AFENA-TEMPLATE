import { desc, sql } from 'drizzle-orm';
import { check, index, numeric, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Authorization Rules — approval rule definitions.
 * Source: authorization-rules.spec.json (adopted from ERPNext Authorization Rule).
 * Master entity for approval rules based on conditions/thresholds.
 */
export const authorizationRules = pgTable(
  'authorization_rules',
  {
    ...erpEntityColumns,
    /** Document type this rule applies to (e.g., "Purchase Order", "Sales Invoice") */
    transaction: text('transaction').notNull(),
    /** Condition field to evaluate (e.g., "Grand Total", "Discount Amount") */
    basedOn: text('based_on').notNull(),
    /** Filter by specific customer or item (optional) */
    customerOrItem: text('customer_or_item'),
    /** Name of the customer/item master record */
    masterName: text('master_name'),
    /** Company this rule applies to. FK deferred: companies(id) */
    company: uuid('company'),
    /** Threshold value for approval requirement */
    value: numeric('value', { precision: 20, scale: 6 }),
    /** System role that can approve. FK deferred: roles(id) */
    systemRole: uuid('system_role'),
    /** Employee who can approve. FK deferred: employees(id) */
    toEmp: uuid('to_emp'),
    /** User who can approve. FK deferred: users(id) */
    systemUserCol: uuid('system_user_col'),
    /** Designation that can approve. FK deferred: designations(id) */
    toDesignation: uuid('to_designation'),
    /** Role that can approve. FK deferred: roles(id) */
    approvingRole: uuid('approving_role'),
    /** User that can approve. FK deferred: users(id) */
    approvingUser: uuid('approving_user'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('authorization_rules_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    // Frequently queried: find rules by transaction type
    index('authorization_rules_org_transaction_idx').on(table.orgId, table.transaction),
    // Frequently queried: find rules by company
    index('authorization_rules_org_company_idx').on(table.orgId, table.company),
    check('authorization_rules_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type AuthorizationRule = typeof authorizationRules.$inferSelect;
export type NewAuthorizationRule = typeof authorizationRules.$inferInsert;
