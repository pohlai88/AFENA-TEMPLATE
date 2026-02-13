import { describe, it, expect } from 'vitest';
import { QuotationSchema, QuotationInsertSchema } from '../types/quotation.js';

describe('Quotation Zod validation', () => {
  const validSample = {
      "id": "TEST-Quotation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "quotation_to": "Customer",
      "party_name": "LINK-party_name-001",
      "customer_name": "Sample Customer Name",
      "transaction_date": "Today",
      "valid_till": "2024-01-15",
      "order_type": "Sales",
      "company": "LINK-company-001",
      "has_unit_price_items": "0",
      "amended_from": "LINK-amended_from-001",
      "currency": "LINK-currency-001",
      "conversion_rate": 1,
      "selling_price_list": "LINK-selling_price_list-001",
      "price_list_currency": "LINK-price_list_currency-001",
      "plc_conversion_rate": 1,
      "ignore_pricing_rule": "0",
      "scan_barcode": "Sample Scan Barcode",
      "last_scanned_warehouse": "Sample Last Scanned Warehouse",
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
      "grand_total": 100,
      "in_words": "Sample In Words",
      "rounded_total": 100,
      "rounding_adjustment": 100,
      "disable_rounded_total": "0",
      "base_grand_total": 100,
      "base_in_words": "Sample In Words",
      "base_rounded_total": 100,
      "base_rounding_adjustment": 100,
      "apply_discount_on": "Grand Total",
      "base_discount_amount": 100,
      "coupon_code": "LINK-coupon_code-001",
      "additional_discount_percentage": 1,
      "discount_amount": 100,
      "referral_sales_partner": "LINK-referral_sales_partner-001",
      "other_charges_calculation": "Sample text for other_charges_calculation",
      "customer_address": "LINK-customer_address-001",
      "address_display": "Sample text for address_display",
      "contact_person": "LINK-contact_person-001",
      "contact_display": "Sample text for contact_display",
      "contact_mobile": "Sample text for contact_mobile",
      "contact_email": "test@example.com",
      "shipping_address_name": "LINK-shipping_address_name-001",
      "shipping_address": "Sample text for shipping_address",
      "company_address": "LINK-company_address-001",
      "company_address_display": "Sample text for company_address_display",
      "company_contact_person": "LINK-company_contact_person-001",
      "payment_terms_template": "LINK-payment_terms_template-001",
      "tc_name": "LINK-tc_name-001",
      "terms": "Sample text for terms",
      "auto_repeat": "LINK-auto_repeat-001",
      "letter_head": "LINK-letter_head-001",
      "group_same_items": "0",
      "select_print_heading": "LINK-select_print_heading-001",
      "language": "LINK-language-001",
      "order_lost_reason": "Sample text for order_lost_reason",
      "status": "Draft",
      "customer_group": "LINK-customer_group-001",
      "territory": "LINK-territory-001",
      "utm_source": "LINK-utm_source-001",
      "utm_campaign": "LINK-utm_campaign-001",
      "utm_medium": "LINK-utm_medium-001",
      "utm_content": "Sample Content",
      "opportunity": "LINK-opportunity-001",
      "supplier_quotation": "LINK-supplier_quotation-001",
      "enq_det": "Sample text for enq_det"
  };

  it('validates a correct Quotation object', () => {
    const result = QuotationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QuotationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = QuotationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QuotationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
