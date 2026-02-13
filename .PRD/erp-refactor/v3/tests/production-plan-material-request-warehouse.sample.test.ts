import { describe, it, expect } from 'vitest';
import { ProductionPlanMaterialRequestWarehouseSchema, ProductionPlanMaterialRequestWarehouseInsertSchema } from '../types/production-plan-material-request-warehouse.js';

describe('ProductionPlanMaterialRequestWarehouse Zod validation', () => {
  const validSample = {
      "id": "TEST-ProductionPlanMaterialRequestWarehouse-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "warehouse": "LINK-warehouse-001"
  };

  it('validates a correct Production Plan Material Request Warehouse object', () => {
    const result = ProductionPlanMaterialRequestWarehouseSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProductionPlanMaterialRequestWarehouseInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProductionPlanMaterialRequestWarehouseSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
