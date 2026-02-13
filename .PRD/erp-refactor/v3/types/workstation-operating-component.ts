import { z } from 'zod';

export const WorkstationOperatingComponentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  component_name: z.string(),
  accounts: z.array(z.unknown()).optional(),
});

export type WorkstationOperatingComponent = z.infer<typeof WorkstationOperatingComponentSchema>;

export const WorkstationOperatingComponentInsertSchema = WorkstationOperatingComponentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationOperatingComponentInsert = z.infer<typeof WorkstationOperatingComponentInsertSchema>;
