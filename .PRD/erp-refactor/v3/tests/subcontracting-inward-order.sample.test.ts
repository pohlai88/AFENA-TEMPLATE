import { describe, it, expect } from 'vitest';
import { SubcontractingInwardOrderSchema, SubcontractingInwardOrderInsertSchema } from '../types/subcontracting-inward-order.js';

describe('SubcontractingInwardOrder Zod validation', () => {
  const validSample = {
      "id": "TEST-SubcontractingInwardOrder-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "title": "{customer_name}",
      "naming_series": "Option1",
      "sales_order": "LINK-sales_order-001",
      "customer": "LINK-customer-001",
      "customer_name": "Sample Customer Name",
      "currency": "LINK-currency-001",
      "company": "LINK-company-001",
      "transaction_date": "Today",
      "customer_warehouse": "LINK-customer_warehouse-001",
      "amended_from": "LINK-amended_from-001",
      "set_delivery_warehouse": "LINK-set_delivery_warehouse-001",
      "status": "Draft",
      "per_raw_material_received": 1,
      "per_produced": 1,
      "per_delivered": 1,
      "per_raw_material_returned": 1,
      "per_process_loss": 1,
      "per_returned": 1
  };

  it('validates a correct Subcontracting Inward Order object', () => {
    const result = SubcontractingInwardOrderSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubcontractingInwardOrderInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = SubcontractingInwardOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubcontractingInwardOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
