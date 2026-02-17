import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Voice Call Settings — telephony configuration for voice calls.
 * Source: voice-call-settings.spec.json (adopted from ERPNext Voice Call Settings).
 * Singleton config entity for voice call integration.
 */
export const voiceCallSettings = pgTable(
  'voice_call_settings',
  {
    ...erpEntityColumns,
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('voice_call_settings_org_singleton').on(table.orgId),
    index('voice_call_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('voice_call_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type VoiceCallSettings = typeof voiceCallSettings.$inferSelect;
export type NewVoiceCallSettings = typeof voiceCallSettings.$inferInsert;
