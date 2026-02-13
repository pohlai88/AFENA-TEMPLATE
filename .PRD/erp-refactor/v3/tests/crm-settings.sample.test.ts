import { describe, it, expect } from 'vitest';
import { CrmSettingsSchema, CrmSettingsInsertSchema } from '../types/crm-settings.js';

describe('CrmSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-CrmSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "campaign_naming_by": "Campaign Name",
      "allow_lead_duplication_based_on_emails": "0",
      "auto_creation_of_contact": "1",
      "close_opportunity_after_days": "15",
      "default_valid_till": "Sample Default Quotation Validity Days",
      "carry_forward_communication_and_comments": "0",
      "update_timestamp_on_new_communication": "0"
  };

  it('validates a correct CRM Settings object', () => {
    const result = CrmSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CrmSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CrmSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
