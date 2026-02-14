import { z } from 'zod';

export const RoutingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  routing_name: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  operations: z.array(z.unknown()).optional(),
});

export type Routing = z.infer<typeof RoutingSchema>;

export const RoutingInsertSchema = RoutingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RoutingInsert = z.infer<typeof RoutingInsertSchema>;
