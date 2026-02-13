import { z } from 'zod';

export const QualityProcedureProcessSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  process_description: z.string().optional(),
  procedure: z.string().optional(),
});

export type QualityProcedureProcess = z.infer<typeof QualityProcedureProcessSchema>;

export const QualityProcedureProcessInsertSchema = QualityProcedureProcessSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityProcedureProcessInsert = z.infer<typeof QualityProcedureProcessInsertSchema>;
