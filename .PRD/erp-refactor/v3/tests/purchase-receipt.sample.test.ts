import { describe, it, expect } from 'vitest';
import { PurchaseReceiptSchema, PurchaseReceiptInsertSchema } from '../types/purchase-receipt.js';

describe('PurchaseReceipt Zod validation', () => {
  const validSample = {
      "id": "TEST-PurchaseReceipt-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "title": "{supplier_name}",
      "naming_series": "Option1",
      "supplier": "LINK-supplier-001",
      "supplier_name": "Sample Supplier Name",
      "supplier_delivery_note": "Sample Supplier Delivery Note",
      "subcontracting_receipt": "LINK-subcontracting_receipt-001",
      "posting_date": "Today",
      "posting_time": "Now",
      "set_posting_time": "0",
      "company": "LINK-company-001",
      "apply_putaway_rule": "0",
      "is_return": "0",
      "return_against": "LINK-return_against-001",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "currency": "LINK-currency-001",
      "conversion_rate": 1,
      "buying_price_list": "LINK-buying_price_list-001",
      "price_list_currency": "LINK-price_list_currency-001",
      "plc_conversion_rate": 1,
      "ignore_pricing_rule": "0",
      "scan_barcode": "Sample Scan Barcode",
      "last_scanned_warehouse": "Sample Last Scanned Warehouse",
      "set_warehouse": "LINK-set_warehouse-001",
      "set_from_warehouse": "LINK-set_from_warehouse-001",
      "rejected_warehouse": "LINK-rejected_warehouse-001",
      "is_subcontracted": "0",
      "supplier_warehouse": "LINK-supplier_warehouse-001",
      "total_qty": 1,
      "total_net_weight": 1,
      "base_total": 100,
      "base_net_total": 100,
      "total": 100,
      "net_total": 100,
      "tax_category": "LINK-tax_category-001",
      "taxes_and_charges": "LINK-taxes_and_charges-001",
      "shipping_rule": "LINK-shipping_rule-001",
      "incoterm": "LINK-incoterm-001",
      "named_place": "Sample Named Place",
      "base_taxes_and_charges_added": 100,
      "base_taxes_and_charges_deducted": 100,
      "base_total_taxes_and_charges": 100,
      "taxes_and_charges_added": 100,
      "taxes_and_charges_deducted": 100,
      "total_taxes_and_charges": 100,
      "grand_total": 100,
      "disable_rounded_total": "0",
      "rounding_adjustment": 100,
      "in_words": "Sample In Words",
      "rounded_total": 100,
      "base_grand_total": 100,
      "base_rounding_adjustment": 100,
      "base_in_words": "Sample In Words",
      "base_rounded_total": 100,
      "apply_discount_on": "Grand Total",
      "base_discount_amount": 100,
      "additional_discount_percentage": 1,
      "discount_amount": 100,
      "other_charges_calculation": "Sample text for other_charges_calculation",
      "supplier_address": "LINK-supplier_address-001",
      "address_display": "Sample text for address_display",
      "contact_person": "LINK-contact_person-001",
      "contact_display": "Sample text for contact_display",
      "contact_mobile": "Sample text for contact_mobile",
      "contact_email": "Sample text for contact_email",
      "dispatch_address": "LINK-dispatch_address-001",
      "dispatch_address_display": "Sample text for dispatch_address_display",
      "shipping_address": "LINK-shipping_address-001",
      "shipping_address_display": "Sample text for shipping_address_display",
      "billing_address": "LINK-billing_address-001",
      "billing_address_display": "Sample text for billing_address_display",
      "tc_name": "LINK-tc_name-001",
      "terms": "Sample text for terms",
      "status": "Draft",
      "per_billed": 1,
      "per_returned": 1,
      "auto_repeat": "LINK-auto_repeat-001",
      "letter_head": "LINK-letter_head-001",
      "group_same_items": "0",
      "select_print_heading": "LINK-select_print_heading-001",
      "language": "Sample Print Language",
      "transporter_name": "Sample Transporter Name",
      "lr_no": "Sample Vehicle Number",
      "lr_date": "2024-01-15",
      "instructions": "Sample text for instructions",
      "is_internal_supplier": "0",
      "represents_company": "LINK-represents_company-001",
      "inter_company_reference": "LINK-inter_company_reference-001",
      "remarks": "Sample text for remarks",
      "range": "Sample Range",
      "amended_from": "LINK-amended_from-001",
      "is_old_subcontracting_flow": "0",
      "other_details": "Sample text for other_details"
  };

  it('validates a correct Purchase Receipt object', () => {
    const result = PurchaseReceiptSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PurchaseReceiptInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = PurchaseReceiptSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PurchaseReceiptSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
