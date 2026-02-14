import { z } from 'zod';

export const BuyingSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supp_master_name: z.enum(['Supplier Name', 'Naming Series', 'Auto Name']).optional().default('Supplier Name'),
  supplier_group: z.string().optional(),
  buying_price_list: z.string().optional(),
  maintain_same_rate_action: z.enum(['Stop', 'Warn']).optional().default('Stop'),
  role_to_override_stop_action: z.string().optional(),
  po_required: z.enum(['No', 'Yes']).optional(),
  blanket_order_allowance: z.number().optional().default(0),
  pr_required: z.enum(['No', 'Yes']).optional(),
  project_update_frequency: z.enum(['Each Transaction', 'Manual']).optional().default('Each Transaction'),
  set_landed_cost_based_on_purchase_invoice_rate: z.boolean().optional().default(false),
  allow_zero_qty_in_supplier_quotation: z.boolean().optional().default(false),
  use_transaction_date_exchange_rate: z.boolean().optional().default(false),
  allow_zero_qty_in_request_for_quotation: z.boolean().optional().default(false),
  maintain_same_rate: z.boolean().optional().default(false),
  allow_multiple_items: z.boolean().optional().default(false),
  bill_for_rejected_quantity_in_purchase_invoice: z.boolean().optional().default(true),
  set_valuation_rate_for_rejected_materials: z.boolean().optional().default(false),
  disable_last_purchase_rate: z.boolean().optional().default(false),
  show_pay_button: z.boolean().optional().default(true),
  allow_zero_qty_in_purchase_order: z.boolean().optional().default(false),
  backflush_raw_materials_of_subcontract_based_on: z.enum(['BOM', 'Material Transferred for Subcontract']).optional().default('BOM'),
  over_transfer_allowance: z.number().optional(),
  validate_consumed_qty: z.boolean().optional().default(false),
  auto_create_subcontracting_order: z.boolean().optional().default(false),
  auto_create_purchase_receipt: z.boolean().optional().default(false),
  fixed_email: z.string().optional(),
});

export type BuyingSettings = z.infer<typeof BuyingSettingsSchema>;

export const BuyingSettingsInsertSchema = BuyingSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BuyingSettingsInsert = z.infer<typeof BuyingSettingsInsertSchema>;
