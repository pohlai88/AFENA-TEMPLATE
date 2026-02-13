import { describe, it, expect } from 'vitest';
import { SubcontractingOrderSchema, SubcontractingOrderInsertSchema } from '../types/subcontracting-order.js';

describe('SubcontractingOrder Zod validation', () => {
  const validSample = {
      "id": "TEST-SubcontractingOrder-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "title": "{supplier_name}",
      "naming_series": "Option1",
      "purchase_order": "LINK-purchase_order-001",
      "supplier": "LINK-supplier-001",
      "supplier_name": "Sample Job Worker Name",
      "supplier_warehouse": "LINK-supplier_warehouse-001",
      "supplier_currency": "LINK-supplier_currency-001",
      "company": "LINK-company-001",
      "transaction_date": "Today",
      "schedule_date": "2024-01-15",
      "amended_from": "LINK-amended_from-001",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "set_warehouse": "LINK-set_warehouse-001",
      "total_qty": 1,
      "total": 100,
      "set_reserve_warehouse": "LINK-set_reserve_warehouse-001",
      "reserve_stock": "0",
      "supplier_address": "LINK-supplier_address-001",
      "address_display": "Sample text for address_display",
      "contact_person": "LINK-contact_person-001",
      "contact_display": "Sample text for contact_display",
      "contact_mobile": "Sample text for contact_mobile",
      "contact_email": "Sample text for contact_email",
      "shipping_address": "LINK-shipping_address-001",
      "shipping_address_display": "Sample text for shipping_address_display",
      "billing_address": "LINK-billing_address-001",
      "billing_address_display": "Sample text for billing_address_display",
      "distribute_additional_costs_based_on": "Qty",
      "total_additional_costs": 100,
      "status": "Draft",
      "per_received": 1,
      "select_print_heading": "LINK-select_print_heading-001",
      "letter_head": "LINK-letter_head-001",
      "production_plan": "Sample Production Plan"
  };

  it('validates a correct Subcontracting Order object', () => {
    const result = SubcontractingOrderSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubcontractingOrderInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = SubcontractingOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubcontractingOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
