import { z } from 'zod';

export const TelephonyCallTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  call_type: z.string(),
  amended_from: z.string().optional(),
});

export type TelephonyCallType = z.infer<typeof TelephonyCallTypeSchema>;

export const TelephonyCallTypeInsertSchema = TelephonyCallTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TelephonyCallTypeInsert = z.infer<typeof TelephonyCallTypeInsertSchema>;
