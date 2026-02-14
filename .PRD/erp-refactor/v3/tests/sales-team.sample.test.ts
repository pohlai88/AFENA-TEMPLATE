import { describe, it, expect } from 'vitest';
import { SalesTeamSchema, SalesTeamInsertSchema } from '../types/sales-team.js';

describe('SalesTeam Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesTeam-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "sales_person": "LINK-sales_person-001",
      "contact_no": "Sample Contact No.",
      "allocated_percentage": 1,
      "allocated_amount": 100,
      "commission_rate": "Sample Commission Rate",
      "incentives": 100
  };

  it('validates a correct Sales Team object', () => {
    const result = SalesTeamSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesTeamInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "sales_person" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).sales_person;
    const result = SalesTeamSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesTeamSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
