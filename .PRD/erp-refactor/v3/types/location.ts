import { z } from 'zod';

export const LocationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  location_name: z.string(),
  parent_location: z.string().optional(),
  is_container: z.boolean().optional().default(false),
  is_group: z.boolean().optional().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  area: z.number().optional(),
  area_uom: z.string().optional(),
  location: z.unknown().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type Location = z.infer<typeof LocationSchema>;

export const LocationInsertSchema = LocationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LocationInsert = z.infer<typeof LocationInsertSchema>;
