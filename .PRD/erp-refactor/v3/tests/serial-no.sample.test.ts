import { describe, it, expect } from 'vitest';
import { SerialNoSchema, SerialNoInsertSchema } from '../types/serial-no.js';

describe('SerialNo Zod validation', () => {
  const validSample = {
      "id": "TEST-SerialNo-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "serial_no": "Sample Serial No",
      "item_code": "LINK-item_code-001",
      "batch_no": "LINK-batch_no-001",
      "warehouse": "LINK-warehouse-001",
      "purchase_rate": 1,
      "customer": "LINK-customer-001",
      "status": "Active",
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "item_group": "LINK-item_group-001",
      "brand": "LINK-brand-001",
      "asset": "LINK-asset-001",
      "asset_status": "Issue",
      "location": "LINK-location-001",
      "employee": "LINK-employee-001",
      "warranty_expiry_date": "2024-01-15",
      "amc_expiry_date": "2024-01-15",
      "maintenance_status": "Under Warranty",
      "warranty_period": 1,
      "company": "LINK-company-001",
      "work_order": "LINK-work_order-001",
      "reference_doctype": "LINK-reference_doctype-001",
      "posting_date": "2024-01-15",
      "reference_name": "LINK-reference_name-001"
  };

  it('validates a correct Serial No object', () => {
    const result = SerialNoSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SerialNoInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "serial_no" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).serial_no;
    const result = SerialNoSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SerialNoSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
