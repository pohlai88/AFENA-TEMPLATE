import { describe, it, expect } from 'vitest';
import { PosInvoiceSchema, PosInvoiceInsertSchema } from '../types/pos-invoice.js';

describe('PosInvoice Zod validation', () => {
  const validSample = {
      "id": "TEST-PosInvoice-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "customer": "LINK-customer-001",
      "customer_name": "Sample Customer Name",
      "tax_id": "Sample Tax Id",
      "pos_profile": "LINK-pos_profile-001",
      "consolidated_invoice": "LINK-consolidated_invoice-001",
      "is_pos": "1",
      "is_return": "0",
      "update_billed_amount_in_sales_order": "0",
      "update_billed_amount_in_delivery_note": "1",
      "company": "LINK-company-001",
      "posting_date": "Today",
      "posting_time": "Now",
      "set_posting_time": "0",
      "due_date": "2024-01-15",
      "amended_from": "LINK-amended_from-001",
      "return_against": "LINK-return_against-001",
      "project": "LINK-project-001",
      "cost_center": "LINK-cost_center-001",
      "currency": "LINK-currency-001",
      "conversion_rate": 1,
      "selling_price_list": "LINK-selling_price_list-001",
      "price_list_currency": "LINK-price_list_currency-001",
      "plc_conversion_rate": 1,
      "ignore_pricing_rule": "0",
      "set_warehouse": "LINK-set_warehouse-001",
      "update_stock": "0",
      "scan_barcode": "Sample Scan Barcode",
      "last_scanned_warehouse": "Sample Last Scanned Warehouse",
      "product_bundle_help": "Sample text for product_bundle_help",
      "total_billing_amount": "0",
      "total_qty": 1,
      "base_total": 100,
      "base_net_total": 100,
      "total": 100,
      "net_total": 100,
      "total_net_weight": 1,
      "taxes_and_charges": "LINK-taxes_and_charges-001",
      "shipping_rule": "LINK-shipping_rule-001",
      "tax_category": "LINK-tax_category-001",
      "other_charges_calculation": "Sample text for other_charges_calculation",
      "base_total_taxes_and_charges": 100,
      "total_taxes_and_charges": 100,
      "coupon_code": "LINK-coupon_code-001",
      "apply_discount_on": "Grand Total",
      "base_discount_amount": 100,
      "additional_discount_percentage": 1,
      "discount_amount": 100,
      "base_grand_total": 100,
      "base_rounding_adjustment": 100,
      "base_rounded_total": 100,
      "base_in_words": "Sample In Words (Company Currency)",
      "grand_total": 100,
      "rounding_adjustment": 100,
      "rounded_total": 100,
      "in_words": "Sample In Words",
      "total_advance": 100,
      "outstanding_amount": 100,
      "cash_bank_account": "LINK-cash_bank_account-001",
      "base_paid_amount": 100,
      "paid_amount": 100,
      "base_change_amount": 100,
      "change_amount": 100,
      "account_for_change_amount": "LINK-account_for_change_amount-001",
      "allocate_advances_automatically": "0",
      "write_off_amount": 100,
      "base_write_off_amount": 100,
      "write_off_outstanding_amount_automatically": "0",
      "write_off_account": "LINK-write_off_account-001",
      "write_off_cost_center": "LINK-write_off_cost_center-001",
      "loyalty_points": 1,
      "loyalty_amount": 100,
      "redeem_loyalty_points": "0",
      "loyalty_program": "LINK-loyalty_program-001",
      "loyalty_redemption_account": "LINK-loyalty_redemption_account-001",
      "loyalty_redemption_cost_center": "LINK-loyalty_redemption_cost_center-001",
      "customer_address": "LINK-customer_address-001",
      "address_display": "Sample text for address_display",
      "contact_person": "LINK-contact_person-001",
      "contact_display": "Sample text for contact_display",
      "contact_mobile": "+1-555-0100",
      "contact_email": "test@example.com",
      "territory": "LINK-territory-001",
      "shipping_address_name": "LINK-shipping_address_name-001",
      "shipping_address": "Sample text for shipping_address",
      "company_address": "LINK-company_address-001",
      "company_address_display": "Sample text for company_address_display",
      "company_contact_person": "LINK-company_contact_person-001",
      "payment_terms_template": "LINK-payment_terms_template-001",
      "tc_name": "LINK-tc_name-001",
      "terms": "Sample text for terms",
      "po_no": "Sample Customer's Purchase Order",
      "po_date": "2024-01-15",
      "letter_head": "LINK-letter_head-001",
      "group_same_items": "0",
      "language": "Sample Print Language",
      "select_print_heading": "LINK-select_print_heading-001",
      "inter_company_invoice_reference": "LINK-inter_company_invoice_reference-001",
      "customer_group": "LINK-customer_group-001",
      "is_discounted": "0",
      "utm_source": "LINK-utm_source-001",
      "utm_campaign": "LINK-utm_campaign-001",
      "utm_medium": "LINK-utm_medium-001",
      "status": "Draft",
      "debit_to": "LINK-debit_to-001",
      "party_account_currency": "LINK-party_account_currency-001",
      "is_opening": "No",
      "remarks": "Sample text for remarks",
      "sales_partner": "LINK-sales_partner-001",
      "amount_eligible_for_commission": 100,
      "commission_rate": 1,
      "total_commission": 100,
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "auto_repeat": "LINK-auto_repeat-001",
      "against_income_account": "Sample text for against_income_account"
  };

  it('validates a correct POS Invoice object', () => {
    const result = PosInvoiceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosInvoiceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = PosInvoiceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosInvoiceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
