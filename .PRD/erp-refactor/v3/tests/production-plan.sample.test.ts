import { describe, it, expect } from 'vitest';
import { ProductionPlanSchema, ProductionPlanInsertSchema } from '../types/production-plan.js';

describe('ProductionPlan Zod validation', () => {
  const validSample = {
      "id": "TEST-ProductionPlan-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "get_items_from": "Sales Order",
      "posting_date": "Today",
      "reserve_stock": "0",
      "item_code": "LINK-item_code-001",
      "customer": "LINK-customer-001",
      "warehouse": "LINK-warehouse-001",
      "project": "LINK-project-001",
      "sales_order_status": "To Deliver and Bill",
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "from_delivery_date": "2024-01-15",
      "to_delivery_date": "2024-01-15",
      "combine_items": "0",
      "sub_assembly_warehouse": "LINK-sub_assembly_warehouse-001",
      "skip_available_sub_assembly_item": "1",
      "combine_sub_items": "0",
      "include_non_stock_items": "1",
      "include_subcontracted_items": "1",
      "consider_minimum_order_qty": "0",
      "include_safety_stock": "0",
      "ignore_existing_ordered_qty": "1",
      "for_warehouse": "LINK-for_warehouse-001",
      "total_planned_qty": "0",
      "total_produced_qty": "0",
      "status": "Draft",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Production Plan object', () => {
    const result = ProductionPlanSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProductionPlanInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = ProductionPlanSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProductionPlanSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
