import { describe, it, expect } from 'vitest';
import { AssetRepairSchema, AssetRepairInsertSchema } from '../types/asset-repair.js';

describe('AssetRepair Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetRepair-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "asset": "LINK-asset-001",
      "asset_name": "Read Only Value",
      "repair_status": "Pending",
      "failure_date": "2024-01-15T10:30:00.000Z",
      "completion_date": "2024-01-15T10:30:00.000Z",
      "downtime": "Sample Downtime",
      "amended_from": "LINK-amended_from-001",
      "description": "Sample text for description",
      "actions_performed": "Sample text for actions_performed",
      "repair_cost": "0",
      "consumed_items_cost": 100,
      "capitalize_repair_cost": "0",
      "increase_in_asset_life": 1,
      "total_repair_cost": 100,
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001"
  };

  it('validates a correct Asset Repair object', () => {
    const result = AssetRepairSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetRepairInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = AssetRepairSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetRepairSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
