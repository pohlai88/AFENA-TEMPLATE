import { z } from 'zod';

export const StockEntryTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  purpose: z.enum(['Material Issue', 'Material Receipt', 'Material Transfer', 'Material Transfer for Manufacture', 'Material Consumption for Manufacture', 'Manufacture', 'Repack', 'Send to Subcontractor', 'Disassemble', 'Receive from Customer', 'Return Raw Material to Customer', 'Subcontracting Delivery', 'Subcontracting Return']).default('Material Issue'),
  add_to_transit: z.boolean().optional().default(false),
  is_standard: z.boolean().optional().default(false),
});

export type StockEntryType = z.infer<typeof StockEntryTypeSchema>;

export const StockEntryTypeInsertSchema = StockEntryTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockEntryTypeInsert = z.infer<typeof StockEntryTypeInsertSchema>;
