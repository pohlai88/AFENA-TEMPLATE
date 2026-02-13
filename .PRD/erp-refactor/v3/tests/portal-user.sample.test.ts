import { describe, it, expect } from 'vitest';
import { PortalUserSchema, PortalUserInsertSchema } from '../types/portal-user.js';

describe('PortalUser Zod validation', () => {
  const validSample = {
      "id": "TEST-PortalUser-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "user": "LINK-user-001"
  };

  it('validates a correct Portal User object', () => {
    const result = PortalUserSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PortalUserInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "user" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).user;
    const result = PortalUserSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PortalUserSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
