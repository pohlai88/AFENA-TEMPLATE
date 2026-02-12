import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole, authUid } from 'drizzle-orm/neon';
import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const r2Files = pgTable(
  'r2_files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .default(sql`(auth.user_id())`)
      .references(() => users.userId, { onDelete: 'cascade' }),
    objectKey: text('object_key').notNull().unique(),
    fileUrl: text('file_url').notNull(),
    fileName: text('file_name'),
    contentType: text('content_type'),
    sizeBytes: integer('size_bytes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('r2_files_user_id_idx').on(table.userId),
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId),
    }),
  ]
);

export type R2File = typeof r2Files.$inferSelect;
export type NewR2File = typeof r2Files.$inferInsert;
