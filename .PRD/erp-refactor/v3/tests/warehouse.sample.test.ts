import { describe, it, expect } from 'vitest';
import { WarehouseSchema, WarehouseInsertSchema } from '../types/warehouse.js';

describe('Warehouse Zod validation', () => {
  const validSample = {
      "id": "TEST-Warehouse-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "disabled": "0",
      "warehouse_name": "Sample Warehouse Name",
      "company": "LINK-company-001",
      "is_rejected_warehouse": "0",
      "account": "LINK-account-001",
      "parent_warehouse": "LINK-parent_warehouse-001",
      "is_group": "0",
      "customer": "LINK-customer-001",
      "address_html": "Sample text for address_html",
      "contact_html": "Sample text for contact_html",
      "email_id": "Sample Email Address",
      "phone_no": "+1-555-0100",
      "mobile_no": "+1-555-0100",
      "address_line_1": "Sample Address Line 1",
      "address_line_2": "Sample Address Line 2",
      "city": "Sample City",
      "state": "Sample State/Province",
      "pin": "Sample PIN",
      "warehouse_type": "LINK-warehouse_type-001",
      "default_in_transit_warehouse": "LINK-default_in_transit_warehouse-001",
      "lft": 1,
      "rgt": 1,
      "old_parent": "LINK-old_parent-001"
  };

  it('validates a correct Warehouse object', () => {
    const result = WarehouseSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WarehouseInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "warehouse_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).warehouse_name;
    const result = WarehouseSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WarehouseSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
