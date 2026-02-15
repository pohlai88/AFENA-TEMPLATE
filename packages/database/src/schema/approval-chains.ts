import { sql } from 'drizzle-orm';
import { boolean, check, foreignKey, index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Approval chains — multi-step approval workflow definitions.
 *
 * PRD Phase D #16:
 * - Defines approval requirements per entity type + company
 * - Sequential or parallel steps
 * - "requires N of M approvers" per step
 * - company_id nullable for org-wide chains
 */
export const approvalChains = pgTable(
  'approval_chains',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id'),
    entityType: text('entity_type').notNull(),
    name: text('name').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    description: text('description'),
  },
  (table) => [
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'approval_chains_company_fk',
    }).onDelete('set null'),
    index('approval_chains_org_id_idx').on(table.orgId, table.id),
    index('approval_chains_org_entity_idx').on(table.orgId, table.entityType),
    uniqueIndex('approval_chains_org_company_entity_uniq').on(
      table.orgId,
      table.companyId,
      table.entityType,
    ),
    check('approval_chains_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ApprovalChain = typeof approvalChains.$inferSelect;
export type NewApprovalChain = typeof approvalChains.$inferInsert;

/**
 * Approval steps — individual steps within an approval chain.
 *
 * - step_order: execution sequence (1, 2, 3...)
 * - approval_mode: 'any' (1 of N) or 'all' (N of N) or 'threshold' (M of N)
 * - required_count: for threshold mode, how many approvers needed
 */
export const approvalSteps = pgTable(
  'approval_steps',
  {
    ...baseEntityColumns,
    chainId: uuid('chain_id').notNull(),
    stepOrder: integer('step_order').notNull(),
    name: text('name').notNull(),
    approvalMode: text('approval_mode').notNull().default('any'),
    requiredCount: integer('required_count').notNull().default(1),
    approverRoleId: uuid('approver_role_id'),
    approverUserId: text('approver_user_id'),
    timeoutHours: integer('timeout_hours'),
    description: text('description'),
  },
  (table) => [
    index('approval_steps_org_id_idx').on(table.orgId, table.id),
    index('approval_steps_chain_idx').on(table.orgId, table.chainId),
    uniqueIndex('approval_steps_chain_order_uniq').on(
      table.orgId,
      table.chainId,
      table.stepOrder,
    ),
    check('approval_steps_org_not_empty', sql`org_id <> ''`),
    check('approval_steps_mode_valid', sql`approval_mode IN ('any', 'all', 'threshold')`),
    check('approval_steps_count_positive', sql`required_count > 0`),
    tenantPolicy(table),
  ],
);

export type ApprovalStep = typeof approvalSteps.$inferSelect;
export type NewApprovalStep = typeof approvalSteps.$inferInsert;

/**
 * Approval requests — runtime instances of approval for a specific document.
 *
 * - Links to a specific entity (entity_type + entity_id)
 * - Tracks current step and overall status
 */
export const approvalRequests = pgTable(
  'approval_requests',
  {
    ...baseEntityColumns,
    chainId: uuid('chain_id').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    currentStepOrder: integer('current_step_order').notNull().default(1),
    status: text('status').notNull().default('pending'),
    requestedBy: text('requested_by').notNull(),
    requestedAt: timestamp('requested_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    memo: text('memo'),
  },
  (table) => [
    index('approval_req_org_id_idx').on(table.orgId, table.id),
    index('approval_req_entity_idx').on(table.orgId, table.entityType, table.entityId),
    index('approval_req_chain_idx').on(table.orgId, table.chainId),
    index('approval_req_status_idx').on(table.orgId, table.status),
    check('approval_req_org_not_empty', sql`org_id <> ''`),
    check('approval_req_status_valid', sql`status IN ('pending', 'approved', 'rejected', 'cancelled', 'timed_out')`),
    tenantPolicy(table),
  ],
);

export type ApprovalRequest = typeof approvalRequests.$inferSelect;
export type NewApprovalRequest = typeof approvalRequests.$inferInsert;

/**
 * Approval decisions — individual approver decisions per step.
 *
 * - Append-only evidence (who approved/rejected, when, why)
 */
export const approvalDecisions = pgTable(
  'approval_decisions',
  {
    ...baseEntityColumns,
    requestId: uuid('request_id').notNull(),
    stepId: uuid('step_id').notNull(),
    decision: text('decision').notNull(),
    decidedBy: text('decided_by').notNull(),
    decidedAt: timestamp('decided_at', { withTimezone: true }).notNull().defaultNow(),
    reason: text('reason'),
    delegatedFrom: text('delegated_from'),
  },
  (table) => [
    index('approval_dec_org_id_idx').on(table.orgId, table.id),
    index('approval_dec_request_idx').on(table.orgId, table.requestId),
    index('approval_dec_step_idx').on(table.orgId, table.stepId),
    check('approval_dec_org_not_empty', sql`org_id <> ''`),
    check('approval_dec_decision_valid', sql`decision IN ('approved', 'rejected', 'abstained')`),
    tenantPolicy(table),
  ],
);

export type ApprovalDecision = typeof approvalDecisions.$inferSelect;
export type NewApprovalDecision = typeof approvalDecisions.$inferInsert;
