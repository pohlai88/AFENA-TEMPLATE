import { describe, it, expect } from 'vitest';
import { ProductionPlanSalesOrderSchema, ProductionPlanSalesOrderInsertSchema } from '../types/production-plan-sales-order.js';

describe('ProductionPlanSalesOrder Zod validation', () => {
  const validSample = {
      "id": "TEST-ProductionPlanSalesOrder-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "sales_order": "LINK-sales_order-001",
      "sales_order_date": "2024-01-15",
      "customer": "LINK-customer-001",
      "grand_total": 100,
      "status": "Sample Status"
  };

  it('validates a correct Production Plan Sales Order object', () => {
    const result = ProductionPlanSalesOrderSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProductionPlanSalesOrderInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "sales_order" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).sales_order;
    const result = ProductionPlanSalesOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProductionPlanSalesOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
