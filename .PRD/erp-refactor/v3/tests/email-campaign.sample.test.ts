import { describe, it, expect } from 'vitest';
import { EmailCampaignSchema, EmailCampaignInsertSchema } from '../types/email-campaign.js';

describe('EmailCampaign Zod validation', () => {
  const validSample = {
      "id": "TEST-EmailCampaign-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "campaign_name": "LINK-campaign_name-001",
      "email_campaign_for": "Lead",
      "recipient": "LINK-recipient-001",
      "sender": "__user",
      "start_date": "2024-01-15",
      "end_date": "2024-01-15",
      "status": "Scheduled"
  };

  it('validates a correct Email Campaign object', () => {
    const result = EmailCampaignSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = EmailCampaignInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "campaign_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).campaign_name;
    const result = EmailCampaignSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = EmailCampaignSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
