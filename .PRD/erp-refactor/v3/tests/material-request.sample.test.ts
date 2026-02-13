import { describe, it, expect } from 'vitest';
import { MaterialRequestSchema, MaterialRequestInsertSchema } from '../types/material-request.js';

describe('MaterialRequest Zod validation', () => {
  const validSample = {
      "id": "TEST-MaterialRequest-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "title": "{material_request_type}",
      "material_request_type": "Purchase",
      "customer": "LINK-customer-001",
      "company": "LINK-company-001",
      "auto_created_via_reorder": "0",
      "transaction_date": "Today",
      "schedule_date": "2024-01-15",
      "buying_price_list": "LINK-buying_price_list-001",
      "amended_from": "LINK-amended_from-001",
      "scan_barcode": "Sample Scan Barcode",
      "last_scanned_warehouse": "Sample Last Scanned Warehouse",
      "set_from_warehouse": "LINK-set_from_warehouse-001",
      "set_warehouse": "LINK-set_warehouse-001",
      "tc_name": "LINK-tc_name-001",
      "terms": "Sample text for terms",
      "status": "Draft",
      "per_ordered": 1,
      "transfer_status": "Not Started",
      "per_received": 1,
      "letter_head": "LINK-letter_head-001",
      "select_print_heading": "LINK-select_print_heading-001",
      "job_card": "LINK-job_card-001",
      "work_order": "LINK-work_order-001"
  };

  it('validates a correct Material Request object', () => {
    const result = MaterialRequestSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MaterialRequestInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = MaterialRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MaterialRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
