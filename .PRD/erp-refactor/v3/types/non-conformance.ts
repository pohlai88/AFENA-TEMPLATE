import { z } from 'zod';

export const NonConformanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  subject: z.string(),
  procedure: z.string(),
  process_owner: z.string().optional(),
  full_name: z.string().optional(),
  status: z.enum(['Open', 'Resolved', 'Cancelled']),
  details: z.string().optional(),
  corrective_action: z.string().optional(),
  preventive_action: z.string().optional(),
});

export type NonConformance = z.infer<typeof NonConformanceSchema>;

export const NonConformanceInsertSchema = NonConformanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type NonConformanceInsert = z.infer<typeof NonConformanceInsertSchema>;
