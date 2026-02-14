import { describe, it, expect } from 'vitest';
import { CampaignItemSchema, CampaignItemInsertSchema } from '../types/campaign-item.js';

describe('CampaignItem Zod validation', () => {
  const validSample = {
      "id": "TEST-CampaignItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "campaign": "LINK-campaign-001"
  };

  it('validates a correct Campaign Item object', () => {
    const result = CampaignItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CampaignItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CampaignItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
