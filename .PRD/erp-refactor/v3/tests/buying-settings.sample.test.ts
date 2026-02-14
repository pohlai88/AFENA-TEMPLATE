import { describe, it, expect } from 'vitest';
import { BuyingSettingsSchema, BuyingSettingsInsertSchema } from '../types/buying-settings.js';

describe('BuyingSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-BuyingSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "supp_master_name": "Supplier Name",
      "supplier_group": "LINK-supplier_group-001",
      "buying_price_list": "LINK-buying_price_list-001",
      "maintain_same_rate_action": "Stop",
      "role_to_override_stop_action": "LINK-role_to_override_stop_action-001",
      "po_required": "No",
      "blanket_order_allowance": "0",
      "pr_required": "No",
      "project_update_frequency": "Each Transaction",
      "set_landed_cost_based_on_purchase_invoice_rate": "0",
      "allow_zero_qty_in_supplier_quotation": "0",
      "use_transaction_date_exchange_rate": "0",
      "allow_zero_qty_in_request_for_quotation": "0",
      "maintain_same_rate": "0",
      "allow_multiple_items": "0",
      "bill_for_rejected_quantity_in_purchase_invoice": "1",
      "set_valuation_rate_for_rejected_materials": "0",
      "disable_last_purchase_rate": "0",
      "show_pay_button": "1",
      "allow_zero_qty_in_purchase_order": "0",
      "backflush_raw_materials_of_subcontract_based_on": "BOM",
      "over_transfer_allowance": 1,
      "validate_consumed_qty": "0",
      "auto_create_subcontracting_order": "0",
      "auto_create_purchase_receipt": "0",
      "fixed_email": "LINK-fixed_email-001"
  };

  it('validates a correct Buying Settings object', () => {
    const result = BuyingSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BuyingSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BuyingSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
