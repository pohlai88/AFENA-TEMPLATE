import { describe, it, expect } from 'vitest';
import { SellingSettingsSchema, SellingSettingsInsertSchema } from '../types/selling-settings.js';

describe('SellingSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-SellingSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "cust_master_name": "Customer Name",
      "customer_group": "LINK-customer_group-001",
      "territory": "LINK-territory-001",
      "selling_price_list": "LINK-selling_price_list-001",
      "maintain_same_rate_action": "Stop",
      "role_to_override_stop_action": "LINK-role_to_override_stop_action-001",
      "maintain_same_sales_rate": "0",
      "fallback_to_default_price_list": "0",
      "editable_price_list_rate": "0",
      "validate_selling_price": "0",
      "editable_bundle_item_rates": "0",
      "allow_negative_rates_for_items": "0",
      "so_required": "No",
      "dn_required": "No",
      "sales_update_frequency": "Daily",
      "blanket_order_allowance": 1,
      "enable_tracking_sales_commissions": "0",
      "allow_multiple_items": "0",
      "allow_against_multiple_purchase_orders": "0",
      "allow_sales_order_creation_for_expired_quotation": "0",
      "dont_reserve_sales_order_qty_on_sales_return": "0",
      "hide_tax_id": "0",
      "enable_discount_accounting": "0",
      "enable_cutoff_date_on_bulk_delivery_note_creation": "0",
      "allow_zero_qty_in_quotation": "0",
      "allow_zero_qty_in_sales_order": "0",
      "set_zero_rate_for_expired_batch": "0",
      "use_legacy_js_reactivity": "0",
      "allow_delivery_of_overproduced_qty": "0",
      "deliver_scrap_items": "0"
  };

  it('validates a correct Selling Settings object', () => {
    const result = SellingSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SellingSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "sales_update_frequency" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).sales_update_frequency;
    const result = SellingSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SellingSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
