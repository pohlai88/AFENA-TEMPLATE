import { describe, it, expect } from 'vitest';
import { RequestForQuotationItemSchema, RequestForQuotationItemInsertSchema } from '../types/request-for-quotation-item.js';

describe('RequestForQuotationItem Zod validation', () => {
  const validSample = {
      "id": "TEST-RequestForQuotationItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "supplier_part_no": "Sample Supplier Part No",
      "item_name": "Sample Item Name",
      "schedule_date": "Today",
      "description": "Sample text for description",
      "item_group": "LINK-item_group-001",
      "brand": "LINK-brand-001",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "uom": "LINK-uom-001",
      "conversion_factor": 1,
      "stock_qty": 1,
      "warehouse": "LINK-warehouse-001",
      "material_request": "LINK-material_request-001",
      "material_request_item": "Sample Material Request Item",
      "project_name": "LINK-project_name-001",
      "page_break": "0"
  };

  it('validates a correct Request for Quotation Item object', () => {
    const result = RequestForQuotationItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RequestForQuotationItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = RequestForQuotationItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RequestForQuotationItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
