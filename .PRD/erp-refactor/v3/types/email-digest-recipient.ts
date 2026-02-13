import { z } from 'zod';

export const EmailDigestRecipientSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  recipient: z.string(),
});

export type EmailDigestRecipient = z.infer<typeof EmailDigestRecipientSchema>;

export const EmailDigestRecipientInsertSchema = EmailDigestRecipientSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmailDigestRecipientInsert = z.infer<typeof EmailDigestRecipientInsertSchema>;
