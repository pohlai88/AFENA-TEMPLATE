import { relations } from 'drizzle-orm';

import { r2Files } from './r2-files';
import { users } from './users';

export const usersRelations = relations(users, ({ many }) => ({
  r2Files: many(r2Files),
}));

export const r2FilesRelations = relations(r2Files, ({ one }) => ({
  uploader: one(users, {
    fields: [r2Files.uploadedBy],
    references: [users.userId],
  }),
}));
