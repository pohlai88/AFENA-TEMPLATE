import { z } from 'zod';

export const UomConversionDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  uom: z.string().optional(),
  conversion_factor: z.number().optional(),
});

export type UomConversionDetail = z.infer<typeof UomConversionDetailSchema>;

export const UomConversionDetailInsertSchema = UomConversionDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UomConversionDetailInsert = z.infer<typeof UomConversionDetailInsertSchema>;
