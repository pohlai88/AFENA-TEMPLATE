import { z } from 'zod';

export const PlantFloorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  plant_dashboard: z.string().optional(),
  stock_summary: z.string().optional(),
  floor_name: z.string().optional(),
  company: z.string().optional(),
  warehouse: z.string().optional(),
});

export type PlantFloor = z.infer<typeof PlantFloorSchema>;

export const PlantFloorInsertSchema = PlantFloorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PlantFloorInsert = z.infer<typeof PlantFloorInsertSchema>;
