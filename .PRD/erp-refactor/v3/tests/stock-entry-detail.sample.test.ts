import { describe, it, expect } from 'vitest';
import { StockEntryDetailSchema, StockEntryDetailInsertSchema } from '../types/stock-entry-detail.js';

describe('StockEntryDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-StockEntryDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "barcode": "Sample Barcode",
      "has_item_scanned": "0",
      "s_warehouse": "LINK-s_warehouse-001",
      "t_warehouse": "LINK-t_warehouse-001",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "is_finished_item": "0",
      "is_scrap_item": "0",
      "quality_inspection": "LINK-quality_inspection-001",
      "subcontracted_item": "LINK-subcontracted_item-001",
      "against_fg": "LINK-against_fg-001",
      "description": "Sample text for description",
      "item_group": "Sample Item Group",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "qty": 1,
      "transfer_qty": 1,
      "retain_sample": "0",
      "uom": "LINK-uom-001",
      "stock_uom": "LINK-stock_uom-001",
      "conversion_factor": 1,
      "sample_quantity": 1,
      "basic_rate": 100,
      "customer_provided_item_cost": 100,
      "additional_cost": 100,
      "landed_cost_voucher_amount": 100,
      "valuation_rate": 100,
      "allow_zero_valuation_rate": "0",
      "set_basic_rate_manually": "0",
      "basic_amount": 100,
      "amount": 100,
      "use_serial_batch_fields": "0",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "serial_no": "Sample text for serial_no",
      "batch_no": "LINK-batch_no-001",
      "expense_account": "LINK-expense_account-001",
      "cost_center": ":Company",
      "project": "LINK-project-001",
      "actual_qty": 1,
      "transferred_qty": 1,
      "bom_no": "LINK-bom_no-001",
      "allow_alternative_item": "0",
      "material_request": "LINK-material_request-001",
      "material_request_item": "LINK-material_request_item-001",
      "original_item": "LINK-original_item-001",
      "against_stock_entry": "LINK-against_stock_entry-001",
      "ste_detail": "Sample Stock Entry Child",
      "po_detail": "Sample PO Supplied Item",
      "sco_rm_detail": "Sample SCO Supplied Item",
      "scio_detail": "Sample SCIO Detail",
      "putaway_rule": "LINK-putaway_rule-001",
      "reference_purchase_receipt": "LINK-reference_purchase_receipt-001",
      "job_card_item": "Sample Job Card Item"
  };

  it('validates a correct Stock Entry Detail object', () => {
    const result = StockEntryDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = StockEntryDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = StockEntryDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = StockEntryDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
