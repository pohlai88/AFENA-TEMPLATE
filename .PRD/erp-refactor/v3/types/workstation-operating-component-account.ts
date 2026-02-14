import { z } from 'zod';

export const WorkstationOperatingComponentAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  expense_account: z.string().optional(),
});

export type WorkstationOperatingComponentAccount = z.infer<typeof WorkstationOperatingComponentAccountSchema>;

export const WorkstationOperatingComponentAccountInsertSchema = WorkstationOperatingComponentAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationOperatingComponentAccountInsert = z.infer<typeof WorkstationOperatingComponentAccountInsertSchema>;
