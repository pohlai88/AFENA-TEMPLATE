import { describe, it, expect } from 'vitest';
import { ProductionPlanMaterialRequestSchema, ProductionPlanMaterialRequestInsertSchema } from '../types/production-plan-material-request.js';

describe('ProductionPlanMaterialRequest Zod validation', () => {
  const validSample = {
      "id": "TEST-ProductionPlanMaterialRequest-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "material_request": "LINK-material_request-001",
      "material_request_date": "2024-01-15"
  };

  it('validates a correct Production Plan Material Request object', () => {
    const result = ProductionPlanMaterialRequestSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProductionPlanMaterialRequestInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "material_request" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).material_request;
    const result = ProductionPlanMaterialRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProductionPlanMaterialRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
