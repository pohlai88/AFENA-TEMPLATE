import { z } from 'zod';

export const WarehouseTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  description: z.string().optional(),
});

export type WarehouseType = z.infer<typeof WarehouseTypeSchema>;

export const WarehouseTypeInsertSchema = WarehouseTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WarehouseTypeInsert = z.infer<typeof WarehouseTypeInsertSchema>;
