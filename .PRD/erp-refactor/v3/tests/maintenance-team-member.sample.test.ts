import { describe, it, expect } from 'vitest';
import { MaintenanceTeamMemberSchema, MaintenanceTeamMemberInsertSchema } from '../types/maintenance-team-member.js';

describe('MaintenanceTeamMember Zod validation', () => {
  const validSample = {
      "id": "TEST-MaintenanceTeamMember-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "team_member": "LINK-team_member-001",
      "full_name": "Sample Full Name",
      "maintenance_role": "LINK-maintenance_role-001"
  };

  it('validates a correct Maintenance Team Member object', () => {
    const result = MaintenanceTeamMemberSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MaintenanceTeamMemberInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "team_member" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).team_member;
    const result = MaintenanceTeamMemberSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MaintenanceTeamMemberSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
