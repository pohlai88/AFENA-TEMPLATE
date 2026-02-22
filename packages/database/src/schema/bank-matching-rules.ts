/**
 * Bank Matching Rules Table
 *
 * Configurable rules for automatic matching of bank statement lines
 * to GL transactions during reconciliation.
 *
 * ERPNext equivalent: "Bank Transaction Mapping" + custom matching rules.
 */
import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { erpIndexes } from '../helpers/standard-indexes';

export const bankMatchingRules = pgTable(
  'bank_matching_rules',
  {
    ...erpEntityColumns,

    /** FK to bank_accounts — null means applies to all accounts */
    bankAccountId: uuid('bank_account_id'),
    /** Human-readable rule name */
    ruleName: text('rule_name').notNull(),
    /** Lower = higher priority (evaluated in order) */
    priority: integer('priority').notNull().default(100),
    /** Which statement field to match against */
    matchField: text('match_field').notNull(),
    /** How to compare: exact, partial, regex, or range */
    matchOperator: text('match_operator').notNull(),
    /** The pattern or value to match */
    matchPattern: text('match_pattern').notNull(),
    /** Amount tolerance in minor units (0 = exact match) */
    toleranceMinor: bigint('tolerance_minor', { mode: 'number' }).notNull().default(0),
    /** Date tolerance in days (0 = same day) */
    toleranceDays: integer('tolerance_days').notNull().default(0),
    /** If true, matching lines are auto-reconciled without review */
    autoMatch: boolean('auto_match').notNull().default(false),
    /** Soft active flag */
    isActive: boolean('is_active').notNull().default(true),
  },
  (t) => [
    ...erpIndexes('bank_matching_rules', t),

    uniqueIndex('uq__bank_matching_rules__org_name').on(t.orgId, t.ruleName),

    index('idx__bank_matching_rules__bank_account').on(t.orgId, t.bankAccountId),
    index('idx__bank_matching_rules__priority').on(t.orgId, t.priority),

    check(
      'bank_matching_rules_valid_field',
      sql`match_field IN ('amount', 'description', 'reference', 'counterparty')`,
    ),
    check(
      'bank_matching_rules_valid_operator',
      sql`match_operator IN ('equals', 'contains', 'regex', 'range')`,
    ),
    check('bank_matching_rules_nonneg_tolerance', sql`tolerance_minor >= 0`),
    check('bank_matching_rules_nonneg_days', sql`tolerance_days >= 0`),
  ],
);

export type BankMatchingRule = typeof bankMatchingRules.$inferSelect;
export type NewBankMatchingRule = typeof bankMatchingRules.$inferInsert;
