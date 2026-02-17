import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Video Settings — org-level config for YouTube tracking.
 * Source: video-settings.spec.json (adopted from ERPNext Video Settings).
 */
export const videoSettings = pgTable(
  'video_settings',
  {
    ...erpEntityColumns,
    enableYoutubeTracking: boolean('enable_youtube_tracking').default(false),
    apiKey: text('api_key'),
    frequency: text('frequency'), // enum: '30 mins' | '1 hr' | '6 hrs' | 'Daily'
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('video_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('video_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type VideoSetting = typeof videoSettings.$inferSelect;
export type NewVideoSetting = typeof videoSettings.$inferInsert;
