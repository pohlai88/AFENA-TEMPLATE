import { z } from 'zod';

export const SellingSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  cust_master_name: z.enum(['Customer Name', 'Naming Series', 'Auto Name']).optional().default('Customer Name'),
  customer_group: z.string().optional(),
  territory: z.string().optional(),
  selling_price_list: z.string().optional(),
  maintain_same_rate_action: z.enum(['Stop', 'Warn']).optional().default('Stop'),
  role_to_override_stop_action: z.string().optional(),
  maintain_same_sales_rate: z.boolean().optional().default(false),
  fallback_to_default_price_list: z.boolean().optional().default(false),
  editable_price_list_rate: z.boolean().optional().default(false),
  validate_selling_price: z.boolean().optional().default(false),
  editable_bundle_item_rates: z.boolean().optional().default(false),
  allow_negative_rates_for_items: z.boolean().optional().default(false),
  so_required: z.enum(['No', 'Yes']).optional(),
  dn_required: z.enum(['No', 'Yes']).optional(),
  sales_update_frequency: z.enum(['Monthly', 'Each Transaction', 'Daily']).default('Daily'),
  blanket_order_allowance: z.number().optional(),
  enable_tracking_sales_commissions: z.boolean().optional().default(false),
  allow_multiple_items: z.boolean().optional().default(false),
  allow_against_multiple_purchase_orders: z.boolean().optional().default(false),
  allow_sales_order_creation_for_expired_quotation: z.boolean().optional().default(false),
  dont_reserve_sales_order_qty_on_sales_return: z.boolean().optional().default(false),
  hide_tax_id: z.boolean().optional().default(false),
  enable_discount_accounting: z.boolean().optional().default(false),
  enable_cutoff_date_on_bulk_delivery_note_creation: z.boolean().optional().default(false),
  allow_zero_qty_in_quotation: z.boolean().optional().default(false),
  allow_zero_qty_in_sales_order: z.boolean().optional().default(false),
  set_zero_rate_for_expired_batch: z.boolean().optional().default(false),
  use_legacy_js_reactivity: z.boolean().optional().default(false),
  allow_delivery_of_overproduced_qty: z.boolean().optional().default(false),
  deliver_scrap_items: z.boolean().optional().default(false),
});

export type SellingSettings = z.infer<typeof SellingSettingsSchema>;

export const SellingSettingsInsertSchema = SellingSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SellingSettingsInsert = z.infer<typeof SellingSettingsInsertSchema>;
