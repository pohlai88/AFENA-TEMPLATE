import { z } from 'zod';

export const ItemBarcodeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  barcode: z.string(),
  barcode_type: z.enum(['EAN', 'UPC-A', 'CODE-39', 'EAN-13', 'EAN-8', 'GS1', 'GTIN', 'GTIN-14', 'ISBN', 'ISBN-10', 'ISBN-13', 'ISSN', 'JAN', 'PZN', 'UPC']).optional(),
  uom: z.string().optional(),
});

export type ItemBarcode = z.infer<typeof ItemBarcodeSchema>;

export const ItemBarcodeInsertSchema = ItemBarcodeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemBarcodeInsert = z.infer<typeof ItemBarcodeInsertSchema>;
