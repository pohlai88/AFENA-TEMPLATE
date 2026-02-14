import { describe, it, expect } from 'vitest';
import { CampaignEmailScheduleSchema, CampaignEmailScheduleInsertSchema } from '../types/campaign-email-schedule.js';

describe('CampaignEmailSchedule Zod validation', () => {
  const validSample = {
      "id": "TEST-CampaignEmailSchedule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "email_template": "LINK-email_template-001",
      "send_after_days": 1
  };

  it('validates a correct Campaign Email Schedule object', () => {
    const result = CampaignEmailScheduleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CampaignEmailScheduleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "email_template" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).email_template;
    const result = CampaignEmailScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CampaignEmailScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
