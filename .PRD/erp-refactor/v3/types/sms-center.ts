import { z } from 'zod';

export const SmsCenterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  send_to: z.enum(['All Contact', 'All Customer Contact', 'All Supplier Contact', 'All Sales Partner Contact', 'All Lead (Open)', 'All Employee (Active)', 'All Sales Person']).optional(),
  customer: z.string().optional(),
  supplier: z.string().optional(),
  sales_partner: z.string().optional(),
  department: z.string().optional(),
  branch: z.string().optional(),
  receiver_list: z.string().optional(),
  message: z.string(),
  total_characters: z.number().int().optional(),
  total_messages: z.number().int().optional(),
});

export type SmsCenter = z.infer<typeof SmsCenterSchema>;

export const SmsCenterInsertSchema = SmsCenterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SmsCenterInsert = z.infer<typeof SmsCenterInsertSchema>;
