import { sql } from 'drizzle-orm';
import { authenticatedRole, crudPolicy } from 'drizzle-orm/neon';
import {
    boolean,
    check,
    jsonb,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';

/**
 * Video Settings — per-org video/media configuration.
 *
 * One row per org. Used for media platform credentials, CDN configuration,
 * and video processing settings.
 */
export const videoSettings = pgTable(
  'video_settings',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
    /** Video platform provider (e.g. 'mux', 'cloudflare', 'bunny') */
    provider: text('provider'),
    /** Encrypted credentials blob */
    credentials: jsonb('credentials'),
    /** CDN base URL for delivery */
    cdnBaseUrl: text('cdn_base_url'),
    isEnabled: boolean('is_enabled').notNull().default(false),
    maxFileSizeMb: text('max_file_size_mb').notNull().default('500'),
    allowedFormats: jsonb('allowed_formats').default(sql`'["mp4","webm","mov"]'::jsonb`),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // One settings row per org
    uniqueIndex('video_settings_org_unique_idx').on(table.orgId),
    check('video_settings_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id()::uuid = ${table.orgId})`,
      modify: sql`(select auth.org_id()::uuid = ${table.orgId})`,
    }),
  ],
);

export type VideoSettings = typeof videoSettings.$inferSelect;
export type NewVideoSettings = typeof videoSettings.$inferInsert;
