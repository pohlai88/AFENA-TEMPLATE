import { describe, it, expect } from 'vitest';
import { PurchaseInvoiceSchema, PurchaseInvoiceInsertSchema } from '../types/purchase-invoice.js';

describe('PurchaseInvoice Zod validation', () => {
  const validSample = {
      "id": "TEST-PurchaseInvoice-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "title": "{supplier_name}",
      "naming_series": "Option1",
      "supplier": "LINK-supplier-001",
      "supplier_name": "Sample Supplier Name",
      "tax_id": "Read Only Value",
      "company": "LINK-company-001",
      "posting_date": "Today",
      "posting_time": "Now",
      "set_posting_time": "0",
      "due_date": "2024-01-15",
      "is_paid": "0",
      "is_return": "0",
      "return_against": "LINK-return_against-001",
      "update_outstanding_for_self": "1",
      "update_billed_amount_in_purchase_order": "0",
      "update_billed_amount_in_purchase_receipt": "1",
      "apply_tds": "0",
      "amended_from": "LINK-amended_from-001",
      "bill_no": "Sample Supplier Invoice No",
      "bill_date": "2024-01-15",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "currency": "LINK-currency-001",
      "conversion_rate": 1,
      "use_transaction_date_exchange_rate": "0",
      "buying_price_list": "LINK-buying_price_list-001",
      "price_list_currency": "LINK-price_list_currency-001",
      "plc_conversion_rate": 1,
      "ignore_pricing_rule": "0",
      "scan_barcode": "Sample Scan Barcode",
      "last_scanned_warehouse": "Sample Last Scanned Warehouse",
      "update_stock": "0",
      "set_warehouse": "LINK-set_warehouse-001",
      "set_from_warehouse": "LINK-set_from_warehouse-001",
      "is_subcontracted": "0",
      "rejected_warehouse": "LINK-rejected_warehouse-001",
      "supplier_warehouse": "LINK-supplier_warehouse-001",
      "total_qty": 1,
      "total_net_weight": 1,
      "base_total": 100,
      "base_net_total": 100,
      "claimed_landed_cost_amount": 100,
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
      "use_company_roundoff_cost_center": "0",
      "in_words": "Sample In Words",
      "rounded_total": 100,
      "base_grand_total": 100,
      "base_rounding_adjustment": 100,
      "base_in_words": "Sample In Words",
      "base_rounded_total": 100,
      "total_advance": 100,
      "outstanding_amount": 100,
      "tax_withholding_group": "LINK-tax_withholding_group-001",
      "ignore_tax_withholding_threshold": "0",
      "override_tax_withholding_entries": "0",
      "apply_discount_on": "Grand Total",
      "base_discount_amount": 100,
      "additional_discount_percentage": 1,
      "discount_amount": 100,
      "other_charges_calculation": "Sample text for other_charges_calculation",
      "mode_of_payment": "LINK-mode_of_payment-001",
      "base_paid_amount": 100,
      "clearance_date": "2024-01-15",
      "cash_bank_account": "LINK-cash_bank_account-001",
      "paid_amount": 100,
      "allocate_advances_automatically": "0",
      "only_include_allocated_payments": "0",
      "write_off_amount": 100,
      "base_write_off_amount": 100,
      "write_off_account": "LINK-write_off_account-001",
      "write_off_cost_center": "LINK-write_off_cost_center-001",
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
      "payment_terms_template": "LINK-payment_terms_template-001",
      "ignore_default_payment_terms_template": "0",
      "tc_name": "LINK-tc_name-001",
      "terms": "Sample text for terms",
      "status": "Draft",
      "per_received": 1,
      "credit_to": "LINK-credit_to-001",
      "party_account_currency": "LINK-party_account_currency-001",
      "is_opening": "No",
      "against_expense_account": "Sample text for against_expense_account",
      "unrealized_profit_loss_account": "LINK-unrealized_profit_loss_account-001",
      "subscription": "LINK-subscription-001",
      "auto_repeat": "LINK-auto_repeat-001",
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "letter_head": "LINK-letter_head-001",
      "group_same_items": "0",
      "select_print_heading": "LINK-select_print_heading-001",
      "language": "Sample Print Language",
      "on_hold": "0",
      "release_date": "2024-01-15",
      "hold_comment": "Sample text for hold_comment",
      "is_internal_supplier": "0",
      "represents_company": "LINK-represents_company-001",
      "supplier_group": "LINK-supplier_group-001",
      "sender": "test@example.com",
      "inter_company_invoice_reference": "LINK-inter_company_invoice_reference-001",
      "is_old_subcontracting_flow": "0",
      "remarks": "Sample text for remarks"
  };

  it('validates a correct Purchase Invoice object', () => {
    const result = PurchaseInvoiceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PurchaseInvoiceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = PurchaseInvoiceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PurchaseInvoiceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
