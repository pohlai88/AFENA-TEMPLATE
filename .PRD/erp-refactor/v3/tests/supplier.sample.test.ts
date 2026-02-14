import { describe, it, expect } from 'vitest';
import { SupplierSchema, SupplierInsertSchema } from '../types/supplier.js';

describe('Supplier Zod validation', () => {
  const validSample = {
      "id": "TEST-Supplier-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "Option1",
      "supplier_name": "Sample Supplier Name",
      "supplier_type": "Company",
      "gender": "LINK-gender-001",
      "supplier_group": "LINK-supplier_group-001",
      "country": "LINK-country-001",
      "is_transporter": "0",
      "image": "/files/sample.png",
      "default_currency": "LINK-default_currency-001",
      "default_bank_account": "LINK-default_bank_account-001",
      "default_price_list": "LINK-default_price_list-001",
      "is_internal_supplier": "0",
      "represents_company": "LINK-represents_company-001",
      "supplier_details": "Sample text for supplier_details",
      "website": "Sample Website",
      "language": "LINK-language-001",
      "tax_id": "Sample Tax ID",
      "tax_category": "LINK-tax_category-001",
      "tax_withholding_category": "LINK-tax_withholding_category-001",
      "tax_withholding_group": "LINK-tax_withholding_group-001",
      "address_html": "Sample text for address_html",
      "contact_html": "Sample text for contact_html",
      "supplier_primary_address": "LINK-supplier_primary_address-001",
      "primary_address": "Sample text for primary_address",
      "supplier_primary_contact": "LINK-supplier_primary_contact-001",
      "mobile_no": "Read Only Value",
      "email_id": "Read Only Value",
      "payment_terms": "LINK-payment_terms-001",
      "allow_purchase_invoice_creation_without_purchase_order": "0",
      "allow_purchase_invoice_creation_without_purchase_receipt": "0",
      "disabled": "0",
      "is_frozen": "0",
      "warn_rfqs": "0",
      "warn_pos": "0",
      "prevent_rfqs": "0",
      "prevent_pos": "0",
      "on_hold": "0",
      "hold_type": "All",
      "release_date": "2024-01-15"
  };

  it('validates a correct Supplier object', () => {
    const result = SupplierSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "supplier_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).supplier_name;
    const result = SupplierSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
