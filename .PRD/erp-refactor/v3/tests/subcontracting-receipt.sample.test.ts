import { describe, it, expect } from 'vitest';
import { SubcontractingReceiptSchema, SubcontractingReceiptInsertSchema } from '../types/subcontracting-receipt.js';

describe('SubcontractingReceipt Zod validation', () => {
  const validSample = {
      "id": "TEST-SubcontractingReceipt-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "title": "{supplier_name}",
      "naming_series": "Option1",
      "supplier": "LINK-supplier-001",
      "supplier_name": "Sample Job Worker Name",
      "supplier_delivery_note": "Sample Job Worker Delivery Note",
      "company": "LINK-company-001",
      "posting_date": "Today",
      "posting_time": "Now",
      "set_posting_time": "0",
      "is_return": "0",
      "return_against": "LINK-return_against-001",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "set_warehouse": "LINK-set_warehouse-001",
      "rejected_warehouse": "LINK-rejected_warehouse-001",
      "supplier_warehouse": "LINK-supplier_warehouse-001",
      "total_qty": 1,
      "total": 100,
      "in_words": "Sample In Words",
      "bill_no": "Sample Bill No",
      "bill_date": "2024-01-15",
      "supplier_address": "LINK-supplier_address-001",
      "contact_person": "LINK-contact_person-001",
      "address_display": "Sample text for address_display",
      "contact_display": "Sample text for contact_display",
      "contact_mobile": "Sample text for contact_mobile",
      "contact_email": "Sample text for contact_email",
      "shipping_address": "LINK-shipping_address-001",
      "shipping_address_display": "Sample text for shipping_address_display",
      "billing_address": "LINK-billing_address-001",
      "billing_address_display": "Sample text for billing_address_display",
      "distribute_additional_costs_based_on": "Qty",
      "total_additional_costs": 100,
      "amended_from": "LINK-amended_from-001",
      "range": "Sample Range",
      "represents_company": "LINK-represents_company-001",
      "status": "Draft",
      "per_returned": 1,
      "auto_repeat": "LINK-auto_repeat-001",
      "letter_head": "LINK-letter_head-001",
      "language": "Sample Print Language",
      "instructions": "Sample text for instructions",
      "select_print_heading": "LINK-select_print_heading-001",
      "other_details": "Sample text for other_details",
      "remarks": "Sample text for remarks",
      "transporter_name": "Sample Transporter Name",
      "lr_no": "Sample Vehicle Number",
      "lr_date": "2024-01-15"
  };

  it('validates a correct Subcontracting Receipt object', () => {
    const result = SubcontractingReceiptSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubcontractingReceiptInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = SubcontractingReceiptSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubcontractingReceiptSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
