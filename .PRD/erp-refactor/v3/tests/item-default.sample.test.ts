import { describe, it, expect } from 'vitest';
import { ItemDefaultSchema, ItemDefaultInsertSchema } from '../types/item-default.js';

describe('ItemDefault Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemDefault-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "default_warehouse": "LINK-default_warehouse-001",
      "default_price_list": "LINK-default_price_list-001",
      "default_discount_account": "LINK-default_discount_account-001",
      "default_inventory_account": "LINK-default_inventory_account-001",
      "inventory_account_currency": "LINK-inventory_account_currency-001",
      "buying_cost_center": "LINK-buying_cost_center-001",
      "default_supplier": "LINK-default_supplier-001",
      "expense_account": "LINK-expense_account-001",
      "default_provisional_account": "LINK-default_provisional_account-001",
      "purchase_expense_account": "LINK-purchase_expense_account-001",
      "purchase_expense_contra_account": "LINK-purchase_expense_contra_account-001",
      "selling_cost_center": "LINK-selling_cost_center-001",
      "income_account": "LINK-income_account-001",
      "default_cogs_account": "LINK-default_cogs_account-001",
      "deferred_expense_account": "LINK-deferred_expense_account-001",
      "deferred_revenue_account": "LINK-deferred_revenue_account-001"
  };

  it('validates a correct Item Default object', () => {
    const result = ItemDefaultSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemDefaultInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = ItemDefaultSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemDefaultSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
