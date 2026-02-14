import { z } from 'zod';

export const InstallationNoteItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  serial_and_batch_bundle: z.string().optional(),
  serial_no: z.string().optional(),
  qty: z.number(),
  description: z.string().optional(),
  prevdoc_detail_docname: z.string().optional(),
  prevdoc_docname: z.string().optional(),
  prevdoc_doctype: z.string().optional(),
});

export type InstallationNoteItem = z.infer<typeof InstallationNoteItemSchema>;

export const InstallationNoteItemInsertSchema = InstallationNoteItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type InstallationNoteItemInsert = z.infer<typeof InstallationNoteItemInsertSchema>;
