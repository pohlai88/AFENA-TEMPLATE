import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Support Settings — org-level config for support/helpdesk.
 * Source: support-settings.spec.json (adopted from ERPNext Support Settings).
 */
export const supportSettings = pgTable(
  'support_settings',
  {
    ...erpEntityColumns,
    trackServiceLevelAgreement: boolean('track_service_level_agreement').default(false),
    allowResettingSla: boolean('allow_resetting_sla').default(false),
    closeIssueAfterDays: integer('close_issue_after_days'),
    getInvolvedInReply: boolean('get_involved_in_reply').default(false),
    sendFeedbackRequest: boolean('send_feedback_request').default(false),
  },
  (table) => [
    index('support_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('support_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type SupportSetting = typeof supportSettings.$inferSelect;
export type NewSupportSetting = typeof supportSettings.$inferInsert;
