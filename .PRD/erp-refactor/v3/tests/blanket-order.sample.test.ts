import { describe, it, expect } from 'vitest';
import { BlanketOrderSchema, BlanketOrderInsertSchema } from '../types/blanket-order.js';

describe('BlanketOrder Zod validation', () => {
  const validSample = {
      "id": "TEST-BlanketOrder-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "blanket_order_type": "Selling",
      "customer": "LINK-customer-001",
      "customer_name": "Sample Customer Name",
      "supplier": "LINK-supplier-001",
      "supplier_name": "Sample Supplier Name",
      "order_no": "Sample Order No",
      "order_date": "2024-01-15",
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "company": "LINK-company-001",
      "amended_from": "LINK-amended_from-001",
      "tc_name": "LINK-tc_name-001",
      "terms": "Sample text for terms"
  };

  it('validates a correct Blanket Order object', () => {
    const result = BlanketOrderSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BlanketOrderInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = BlanketOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BlanketOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
