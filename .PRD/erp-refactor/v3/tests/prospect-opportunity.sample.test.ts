import { describe, it, expect } from 'vitest';
import { ProspectOpportunitySchema, ProspectOpportunityInsertSchema } from '../types/prospect-opportunity.js';

describe('ProspectOpportunity Zod validation', () => {
  const validSample = {
      "id": "TEST-ProspectOpportunity-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "opportunity": "LINK-opportunity-001",
      "amount": 100,
      "stage": "Sample Stage",
      "deal_owner": "Sample Deal Owner",
      "probability": 1,
      "expected_closing": "2024-01-15",
      "currency": "LINK-currency-001",
      "contact_person": "LINK-contact_person-001"
  };

  it('validates a correct Prospect Opportunity object', () => {
    const result = ProspectOpportunitySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProspectOpportunityInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProspectOpportunitySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
