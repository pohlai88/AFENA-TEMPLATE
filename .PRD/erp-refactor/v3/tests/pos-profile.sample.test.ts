import { describe, it, expect } from 'vitest';
import { PosProfileSchema, PosProfileInsertSchema } from '../types/pos-profile.js';

describe('PosProfile Zod validation', () => {
  const validSample = {
      "id": "TEST-PosProfile-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "customer": "LINK-customer-001",
      "country": "Read Only Value",
      "disabled": "0",
      "warehouse": "LINK-warehouse-001",
      "company_address": "LINK-company_address-001",
      "set_grand_total_to_default_mop": "1",
      "currency": "LINK-currency-001",
      "selling_price_list": "LINK-selling_price_list-001",
      "write_off_account": "LINK-write_off_account-001",
      "write_off_cost_center": "LINK-write_off_cost_center-001",
      "write_off_limit": "1",
      "income_account": "LINK-income_account-001",
      "expense_account": "LINK-expense_account-001",
      "taxes_and_charges": "LINK-taxes_and_charges-001",
      "tax_category": "LINK-tax_category-001",
      "account_for_change_amount": "LINK-account_for_change_amount-001",
      "disable_rounded_total": "0",
      "apply_discount_on": "Grand Total",
      "allow_partial_payment": "0",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "action_on_new_invoice": "Always Ask",
      "validate_stock_on_save": "0",
      "update_stock": "1",
      "ignore_pricing_rule": "0",
      "print_receipt_on_order_complete": "0",
      "hide_images": "0",
      "hide_unavailable_items": "0",
      "auto_add_item_to_cart": "0",
      "allow_rate_change": "0",
      "allow_discount_change": "0",
      "allow_warehouse_change": "0",
      "print_format": "LINK-print_format-001",
      "letter_head": "LINK-letter_head-001",
      "tc_name": "LINK-tc_name-001",
      "select_print_heading": "LINK-select_print_heading-001",
      "utm_source": "LINK-utm_source-001",
      "utm_campaign": "LINK-utm_campaign-001",
      "utm_medium": "LINK-utm_medium-001"
  };

  it('validates a correct POS Profile object', () => {
    const result = PosProfileSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosProfileInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = PosProfileSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosProfileSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
