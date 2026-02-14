import { describe, it, expect } from 'vitest';
import { SubcontractingReceiptItemSchema, SubcontractingReceiptItemInsertSchema } from '../types/subcontracting-receipt-item.js';

describe('SubcontractingReceiptItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SubcontractingReceiptItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "is_scrap_item": "0",
      "description": "Sample text for description",
      "brand": "LINK-brand-001",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "received_qty": "0",
      "qty": 1,
      "rejected_qty": 1,
      "returned_qty": "0",
      "stock_uom": "LINK-stock_uom-001",
      "conversion_factor": "1",
      "rate": 100,
      "amount": 100,
      "landed_cost_voucher_amount": 100,
      "rm_cost_per_qty": "0",
      "service_cost_per_qty": "0",
      "additional_cost_per_qty": "0",
      "scrap_cost_per_qty": "0",
      "rm_supp_cost": 100,
      "warehouse": "LINK-warehouse-001",
      "subcontracting_order": "LINK-subcontracting_order-001",
      "subcontracting_order_item": "Sample Subcontracting Order Item",
      "subcontracting_receipt_item": "Sample Subcontracting Receipt Item",
      "job_card": "LINK-job_card-001",
      "rejected_warehouse": "LINK-rejected_warehouse-001",
      "bom": "LINK-bom-001",
      "include_exploded_items": "0",
      "quality_inspection": "LINK-quality_inspection-001",
      "schedule_date": "2024-01-15",
      "reference_name": "Sample Reference Name",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "use_serial_batch_fields": "0",
      "rejected_serial_and_batch_bundle": "LINK-rejected_serial_and_batch_bundle-001",
      "serial_no": "Sample text for serial_no",
      "rejected_serial_no": "Sample text for rejected_serial_no",
      "batch_no": "LINK-batch_no-001",
      "manufacturer": "LINK-manufacturer-001",
      "manufacturer_part_no": "Sample Manufacturer Part Number",
      "expense_account": "LINK-expense_account-001",
      "service_expense_account": "LINK-service_expense_account-001",
      "cost_center": ":Company",
      "project": "LINK-project-001",
      "page_break": "0",
      "purchase_order": "LINK-purchase_order-001",
      "purchase_order_item": "Sample Purchase Order Item"
  };

  it('validates a correct Subcontracting Receipt Item object', () => {
    const result = SubcontractingReceiptItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubcontractingReceiptItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = SubcontractingReceiptItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubcontractingReceiptItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
