import { describe, it, expect } from 'vitest';
import { CampaignSchema, CampaignInsertSchema } from '../types/campaign.js';

describe('Campaign Zod validation', () => {
  const validSample = {
      "id": "TEST-Campaign-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "campaign_name": "Sample Campaign Name",
      "naming_series": "Option1",
      "description": "Sample text for description"
  };

  it('validates a correct Campaign object', () => {
    const result = CampaignSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CampaignInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "campaign_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).campaign_name;
    const result = CampaignSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CampaignSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
