import { describe, it, expect } from 'vitest';
import { PlantFloorSchema, PlantFloorInsertSchema } from '../types/plant-floor.js';

describe('PlantFloor Zod validation', () => {
  const validSample = {
      "id": "TEST-PlantFloor-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "plant_dashboard": "Sample text for plant_dashboard",
      "stock_summary": "Sample text for stock_summary",
      "floor_name": "Sample Floor Name",
      "company": "LINK-company-001",
      "warehouse": "LINK-warehouse-001"
  };

  it('validates a correct Plant Floor object', () => {
    const result = PlantFloorSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PlantFloorInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PlantFloorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
