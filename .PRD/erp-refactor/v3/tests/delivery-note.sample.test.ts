import { describe, it, expect } from 'vitest';
import { DeliveryNoteSchema, DeliveryNoteInsertSchema } from '../types/delivery-note.js';

describe('DeliveryNote Zod validation', () => {
  const validSample = {
      "id": "TEST-DeliveryNote-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "customer": "LINK-customer-001",
      "tax_id": "Sample Tax Id",
      "customer_name": "Sample Customer Name",
      "posting_date": "Today",
      "posting_time": "Now",
      "set_posting_time": "0",
      "company": "LINK-company-001",
      "amended_from": "LINK-amended_from-001",
      "is_return": "0",
      "issue_credit_note": "0",
      "return_against": "LINK-return_against-001",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "currency": "LINK-currency-001",
      "conversion_rate": 1,
      "selling_price_list": "LINK-selling_price_list-001",
      "price_list_currency": "LINK-price_list_currency-001",
      "plc_conversion_rate": 1,
      "ignore_pricing_rule": "0",
      "scan_barcode": "Sample Scan Barcode",
      "last_scanned_warehouse": "Sample Last Scanned Warehouse",
      "set_warehouse": "LINK-set_warehouse-001",
      "set_target_warehouse": "LINK-set_target_warehouse-001",
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
      "base_total_taxes_and_charges": 100,
      "total_taxes_and_charges": 100,
      "base_grand_total": 100,
      "base_rounding_adjustment": 100,
      "base_rounded_total": 100,
      "base_in_words": "Sample In Words (Company Currency)",
      "grand_total": 100,
      "rounding_adjustment": 100,
      "rounded_total": 100,
      "in_words": "Sample In Words",
      "disable_rounded_total": "0",
      "apply_discount_on": "Grand Total",
      "base_discount_amount": 100,
      "additional_discount_percentage": 1,
      "discount_amount": 100,
      "other_charges_calculation": "Sample text for other_charges_calculation",
      "product_bundle_help": "Sample text for product_bundle_help",
      "customer_address": "LINK-customer_address-001",
      "address_display": "Sample text for address_display",
      "contact_person": "LINK-contact_person-001",
      "contact_display": "Sample text for contact_display",
      "contact_mobile": "Sample text for contact_mobile",
      "contact_email": "test@example.com",
      "shipping_address_name": "LINK-shipping_address_name-001",
      "shipping_address": "Sample text for shipping_address",
      "dispatch_address_name": "LINK-dispatch_address_name-001",
      "dispatch_address": "Sample text for dispatch_address",
      "company_address": "LINK-company_address-001",
      "company_address_display": "Sample text for company_address_display",
      "company_contact_person": "LINK-company_contact_person-001",
      "tc_name": "LINK-tc_name-001",
      "terms": "Sample text for terms",
      "per_billed": 1,
      "status": "Draft",
      "per_installed": 1,
      "installation_status": "Option1",
      "per_returned": 1,
      "transporter": "LINK-transporter-001",
      "lr_no": "Sample Transport Receipt No",
      "delivery_trip": "LINK-delivery_trip-001",
      "driver": "LINK-driver-001",
      "transporter_name": "Sample Transporter Name",
      "lr_date": "Today",
      "vehicle_no": "Sample Vehicle No",
      "driver_name": "Sample Driver Name",
      "po_no": "Sample text for po_no",
      "po_date": "2024-01-15",
      "sales_partner": "LINK-sales_partner-001",
      "amount_eligible_for_commission": 100,
      "commission_rate": 1,
      "total_commission": 100,
      "auto_repeat": "LINK-auto_repeat-001",
      "letter_head": "LINK-letter_head-001",
      "print_without_amount": "0",
      "group_same_items": "0",
      "select_print_heading": "LINK-select_print_heading-001",
      "language": "LINK-language-001",
      "is_internal_customer": "0",
      "represents_company": "LINK-represents_company-001",
      "inter_company_reference": "LINK-inter_company_reference-001",
      "customer_group": "LINK-customer_group-001",
      "territory": "LINK-territory-001",
      "utm_source": "LINK-utm_source-001",
      "utm_campaign": "LINK-utm_campaign-001",
      "utm_medium": "LINK-utm_medium-001",
      "utm_content": "Sample Content",
      "excise_page": "Sample Excise Page Number",
      "instructions": "Sample text for instructions"
  };

  it('validates a correct Delivery Note object', () => {
    const result = DeliveryNoteSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DeliveryNoteInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = DeliveryNoteSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DeliveryNoteSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
