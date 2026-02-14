import { z } from 'zod';

export const QualityProcedureSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  quality_procedure_name: z.string(),
  process_owner: z.string().optional(),
  process_owner_full_name: z.string().optional(),
  processes: z.array(z.unknown()).optional(),
  parent_quality_procedure: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  rgt: z.number().int().optional(),
  lft: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type QualityProcedure = z.infer<typeof QualityProcedureSchema>;

export const QualityProcedureInsertSchema = QualityProcedureSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityProcedureInsert = z.infer<typeof QualityProcedureInsertSchema>;
