import { describe, it, expect } from 'vitest';
import { SubcontractingInwardOrderReceivedItemSchema, SubcontractingInwardOrderReceivedItemInsertSchema } from '../types/subcontracting-inward-order-received-item.js';

describe('SubcontractingInwardOrderReceivedItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SubcontractingInwardOrderReceivedItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "main_item_code": "LINK-main_item_code-001",
      "rm_item_code": "LINK-rm_item_code-001",
      "is_customer_provided_item": "0",
      "is_additional_item": "0",
      "stock_uom": "LINK-stock_uom-001",
      "warehouse": "LINK-warehouse-001",
      "bom_detail_no": "Sample BOM Detail No",
      "reference_name": "Sample Reference Name",
      "required_qty": "0",
      "billed_qty": "0",
      "received_qty": "0",
      "consumed_qty": "0",
      "work_order_qty": "0",
      "returned_qty": "0",
      "rate": "0"
  };

  it('validates a correct Subcontracting Inward Order Received Item object', () => {
    const result = SubcontractingInwardOrderReceivedItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubcontractingInwardOrderReceivedItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "main_item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).main_item_code;
    const result = SubcontractingInwardOrderReceivedItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubcontractingInwardOrderReceivedItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
