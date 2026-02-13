import { describe, it, expect } from 'vitest';
import { PickListSchema, PickListInsertSchema } from '../types/pick-list.js';

describe('PickList Zod validation', () => {
  const validSample = {
      "id": "TEST-PickList-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "purpose": "Material Transfer for Manufacture",
      "customer": "LINK-customer-001",
      "customer_name": "Sample Customer Name",
      "work_order": "LINK-work_order-001",
      "material_request": "LINK-material_request-001",
      "for_qty": 1,
      "parent_warehouse": "LINK-parent_warehouse-001",
      "consider_rejected_warehouses": "0",
      "pick_manually": "0",
      "ignore_pricing_rule": "0",
      "scan_barcode": "Sample Scan Barcode",
      "scan_mode": "0",
      "prompt_qty": "0",
      "amended_from": "LINK-amended_from-001",
      "group_same_items": "0",
      "status": "Draft",
      "delivery_status": "Not Delivered",
      "per_delivered": 1
  };

  it('validates a correct Pick List object', () => {
    const result = PickListSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PickListInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = PickListSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PickListSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
