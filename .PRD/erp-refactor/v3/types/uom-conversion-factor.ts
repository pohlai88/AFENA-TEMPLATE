import { z } from 'zod';

export const UomConversionFactorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  category: z.string(),
  from_uom: z.string(),
  to_uom: z.string(),
  value: z.number(),
});

export type UomConversionFactor = z.infer<typeof UomConversionFactorSchema>;

export const UomConversionFactorInsertSchema = UomConversionFactorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UomConversionFactorInsert = z.infer<typeof UomConversionFactorInsertSchema>;
