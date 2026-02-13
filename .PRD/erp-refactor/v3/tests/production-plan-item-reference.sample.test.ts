import { describe, it, expect } from 'vitest';
import { ProductionPlanItemReferenceSchema, ProductionPlanItemReferenceInsertSchema } from '../types/production-plan-item-reference.js';

describe('ProductionPlanItemReference Zod validation', () => {
  const validSample = {
      "id": "TEST-ProductionPlanItemReference-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_reference": "Sample Item Reference",
      "sales_order": "LINK-sales_order-001",
      "sales_order_item": "Sample Sales Order Item",
      "qty": 1
  };

  it('validates a correct Production Plan Item Reference object', () => {
    const result = ProductionPlanItemReferenceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProductionPlanItemReferenceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProductionPlanItemReferenceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
