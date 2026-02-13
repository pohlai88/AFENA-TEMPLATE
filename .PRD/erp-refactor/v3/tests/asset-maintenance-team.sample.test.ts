import { describe, it, expect } from 'vitest';
import { AssetMaintenanceTeamSchema, AssetMaintenanceTeamInsertSchema } from '../types/asset-maintenance-team.js';

describe('AssetMaintenanceTeam Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetMaintenanceTeam-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "maintenance_team_name": "Sample Maintenance Team Name",
      "maintenance_manager": "LINK-maintenance_manager-001",
      "maintenance_manager_name": "Read Only Value",
      "company": "LINK-company-001"
  };

  it('validates a correct Asset Maintenance Team object', () => {
    const result = AssetMaintenanceTeamSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetMaintenanceTeamInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "maintenance_team_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).maintenance_team_name;
    const result = AssetMaintenanceTeamSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetMaintenanceTeamSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
