import { z } from 'zod';

export const ClosedDocumentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.string(),
  closed: z.boolean().optional().default(false),
});

export type ClosedDocument = z.infer<typeof ClosedDocumentSchema>;

export const ClosedDocumentInsertSchema = ClosedDocumentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ClosedDocumentInsert = z.infer<typeof ClosedDocumentInsertSchema>;
