import { describe, it, expect } from 'vitest';
import { SalesOrderSchema, SalesOrderInsertSchema } from '../types/sales-order.js';

describe('SalesOrder Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesOrder-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "company": "LINK-company-001",
      "naming_series": "Option1",
      "customer": "LINK-customer-001",
      "customer_name": "Sample Customer Name",
      "order_type": "Sales",
      "transaction_date": "Today",
      "delivery_date": "2024-01-15",
      "tax_id": "Sample Tax Id",
      "skip_delivery_note": "0",
      "has_unit_price_items": "0",
      "is_subcontracted": "0",
      "amended_from": "LINK-amended_from-001",
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
      "reserve_stock": "0",
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
      "disable_rounded_total": "0",
      "rounded_total": 100,
      "rounding_adjustment": 100,
      "base_grand_total": 100,
      "base_in_words": "Sample In Words",
      "base_rounded_total": 100,
      "base_rounding_adjustment": 100,
      "advance_paid": 100,
      "apply_discount_on": "Grand Total",
      "base_discount_amount": 100,
      "coupon_code": "LINK-coupon_code-001",
      "additional_discount_percentage": 1,
      "discount_amount": 100,
      "other_charges_calculation": "Sample text for other_charges_calculation",
      "customer_address": "LINK-customer_address-001",
      "address_display": "Sample text for address_display",
      "customer_group": "LINK-customer_group-001",
      "territory": "LINK-territory-001",
      "contact_person": "LINK-contact_person-001",
      "contact_display": "Sample text for contact_display",
      "contact_phone": "+1-555-0100",
      "contact_mobile": "Sample text for contact_mobile",
      "contact_email": "test@example.com",
      "shipping_address_name": "LINK-shipping_address_name-001",
      "shipping_address": "Sample text for shipping_address",
      "dispatch_address_name": "LINK-dispatch_address_name-001",
      "dispatch_address": "Sample text for dispatch_address",
      "company_address": "LINK-company_address-001",
      "company_address_display": "Sample text for company_address_display",
      "company_contact_person": "LINK-company_contact_person-001",
      "payment_terms_template": "LINK-payment_terms_template-001",
      "tc_name": "LINK-tc_name-001",
      "terms": "Sample text for terms",
      "status": "Draft",
      "delivery_status": "Not Delivered",
      "per_delivered": 1,
      "per_billed": 1,
      "per_picked": 1,
      "billing_status": "Not Billed",
      "advance_payment_status": "Not Requested",
      "sales_partner": "LINK-sales_partner-001",
      "amount_eligible_for_commission": 100,
      "commission_rate": 1,
      "total_commission": 100,
      "loyalty_points": 1,
      "loyalty_amount": 100,
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "auto_repeat": "LINK-auto_repeat-001",
      "letter_head": "LINK-letter_head-001",
      "group_same_items": "0",
      "select_print_heading": "LINK-select_print_heading-001",
      "language": "LINK-language-001",
      "is_internal_customer": "0",
      "po_no": "Sample Customer's Purchase Order",
      "po_date": "2024-01-15",
      "represents_company": "LINK-represents_company-001",
      "utm_source": "LINK-utm_source-001",
      "utm_campaign": "LINK-utm_campaign-001",
      "utm_medium": "LINK-utm_medium-001",
      "utm_content": "Sample Content",
      "inter_company_order_reference": "LINK-inter_company_order_reference-001",
      "party_account_currency": "LINK-party_account_currency-001"
  };

  it('validates a correct Sales Order object', () => {
    const result = SalesOrderSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesOrderInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = SalesOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
