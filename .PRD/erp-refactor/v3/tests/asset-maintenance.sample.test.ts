import { describe, it, expect } from 'vitest';
import { AssetMaintenanceSchema, AssetMaintenanceInsertSchema } from '../types/asset-maintenance.js';

describe('AssetMaintenance Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetMaintenance-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "asset_name": "LINK-asset_name-001",
      "asset_category": "Read Only Value",
      "company": "LINK-company-001",
      "item_code": "Read Only Value",
      "item_name": "Read Only Value",
      "maintenance_team": "LINK-maintenance_team-001",
      "maintenance_manager": "Sample Maintenance Manager",
      "maintenance_manager_name": "Read Only Value"
  };

  it('validates a correct Asset Maintenance object', () => {
    const result = AssetMaintenanceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetMaintenanceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "asset_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).asset_name;
    const result = AssetMaintenanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetMaintenanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
