import { describe, it, expect } from 'vitest';
import { StockSettingsSchema, StockSettingsInsertSchema } from '../types/stock-settings.js';

describe('StockSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-StockSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_naming_by": "Item Code",
      "valuation_method": "FIFO",
      "item_group": "LINK-item_group-001",
      "default_warehouse": "LINK-default_warehouse-001",
      "sample_retention_warehouse": "LINK-sample_retention_warehouse-001",
      "stock_uom": "LINK-stock_uom-001",
      "auto_insert_price_list_rate_if_missing": "0",
      "update_price_list_based_on": "Rate",
      "update_existing_price_list_rate": "0",
      "allow_to_edit_stock_uom_qty_for_sales": "0",
      "allow_to_edit_stock_uom_qty_for_purchase": "0",
      "allow_uom_with_conversion_rate_defined_in_item": "0",
      "over_delivery_receipt_allowance": 1,
      "mr_qty_allowance": 1,
      "over_picking_allowance": 1,
      "role_allowed_to_over_deliver_receive": "LINK-role_allowed_to_over_deliver_receive-001",
      "allow_negative_stock": "0",
      "show_barcode_field": "1",
      "clean_description_html": "1",
      "allow_internal_transfer_at_arms_length_price": "0",
      "validate_material_transfer_warehouses": "0",
      "allow_existing_serial_no": "1",
      "do_not_use_batchwise_valuation": "0",
      "auto_create_serial_and_batch_bundle_for_outward": "1",
      "pick_serial_and_batch_based_on": "FIFO",
      "disable_serial_no_and_batch_selector": "0",
      "use_serial_batch_fields": "1",
      "do_not_update_serial_batch_on_creation_of_auto_bundle": "1",
      "set_serial_and_batch_bundle_naming_based_on_naming_series": "0",
      "use_naming_series": "0",
      "naming_series_prefix": "BATCH-",
      "enable_stock_reservation": "0",
      "auto_reserve_stock": "0",
      "allow_partial_reservation": "1",
      "auto_reserve_stock_for_sales_order_on_purchase": "0",
      "auto_reserve_serial_and_batch": "1",
      "action_if_quality_inspection_is_not_submitted": "Stop",
      "action_if_quality_inspection_is_rejected": "Stop",
      "allow_to_make_quality_inspection_after_purchase_or_delivery": "0",
      "auto_indent": "0",
      "reorder_email_notify": "0",
      "allow_from_dn": "0",
      "allow_from_pr": "0",
      "stock_frozen_upto": "2024-01-15",
      "stock_frozen_upto_days": 1,
      "role_allowed_to_create_edit_back_dated_transactions": "LINK-role_allowed_to_create_edit_back_dated_transactions-001",
      "stock_auth_role": "LINK-stock_auth_role-001"
  };

  it('validates a correct Stock Settings object', () => {
    const result = StockSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = StockSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = StockSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
