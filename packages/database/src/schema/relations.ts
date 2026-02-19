import { relations } from 'drizzle-orm';

import { deliveryNoteLines } from './delivery-note-lines';
import { deliveryNotes } from './delivery-notes';
import { r2Files } from './r2-files';
import { users } from './users';

export const usersRelations = relations(users, ({ many }) => ({
  r2Files: many(r2Files),
}));

export const r2FilesRelations = relations(r2Files, ({ one }) => ({
  user: one(users, {
    fields: [r2Files.userId],
    references: [users.userId],
  }),
}));

export const deliveryNotesRelations = relations(deliveryNotes, ({ many }) => ({
  lines: many(deliveryNoteLines),
}));

export const deliveryNoteLinesRelations = relations(deliveryNoteLines, ({ one }) => ({
  deliveryNote: one(deliveryNotes, {
    fields: [deliveryNoteLines.deliveryNoteId, deliveryNoteLines.orgId],
    references: [deliveryNotes.id, deliveryNotes.orgId],
  }),
}));
