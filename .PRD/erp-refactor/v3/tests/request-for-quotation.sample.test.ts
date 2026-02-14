import { describe, it, expect } from 'vitest';
import { RequestForQuotationSchema, RequestForQuotationInsertSchema } from '../types/request-for-quotation.js';

describe('RequestForQuotation Zod validation', () => {
  const validSample = {
      "id": "TEST-RequestForQuotation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "billing_address": "LINK-billing_address-001",
      "billing_address_display": "Sample text for billing_address_display",
      "vendor": "LINK-vendor-001",
      "transaction_date": "Today",
      "schedule_date": "2024-01-15",
      "status": "Draft",
      "has_unit_price_items": "0",
      "amended_from": "LINK-amended_from-001",
      "email_template": "LINK-email_template-001",
      "html_llwp": "Sample text for html_llwp",
      "send_attached_files": "1",
      "send_document_print": "0",
      "subject": "Request for Quotation",
      "message_for_supplier": "Please supply the specified items at the best possible rates",
      "incoterm": "LINK-incoterm-001",
      "named_place": "Sample Named Place",
      "tc_name": "LINK-tc_name-001",
      "terms": "Sample text for terms",
      "select_print_heading": "LINK-select_print_heading-001",
      "letter_head": "LINK-letter_head-001",
      "opportunity": "LINK-opportunity-001"
  };

  it('validates a correct Request for Quotation object', () => {
    const result = RequestForQuotationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RequestForQuotationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = RequestForQuotationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RequestForQuotationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
