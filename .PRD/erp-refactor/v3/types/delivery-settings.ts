import { z } from 'zod';

export const DeliverySettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  dispatch_template: z.string().optional(),
  dispatch_attachment: z.string().optional(),
  send_with_attachment: z.boolean().optional().default(false),
  stop_delay: z.number().int().optional(),
});

export type DeliverySettings = z.infer<typeof DeliverySettingsSchema>;

export const DeliverySettingsInsertSchema = DeliverySettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DeliverySettingsInsert = z.infer<typeof DeliverySettingsInsertSchema>;
