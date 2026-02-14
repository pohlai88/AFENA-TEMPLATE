import { z } from 'zod';

export const AssetMovementSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  purpose: z.enum(['Issue', 'Receipt', 'Transfer', 'Transfer and Issue']),
  transaction_date: z.string().default('Now'),
  assets: z.array(z.unknown()),
  reference_doctype: z.string().optional(),
  reference_name: z.string().optional(),
  amended_from: z.string().optional(),
});

export type AssetMovement = z.infer<typeof AssetMovementSchema>;

export const AssetMovementInsertSchema = AssetMovementSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMovementInsert = z.infer<typeof AssetMovementInsertSchema>;
