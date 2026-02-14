import { describe, it, expect } from 'vitest';
import { SupportSettingsSchema, SupportSettingsInsertSchema } from '../types/support-settings.js';

describe('SupportSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-SupportSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "track_service_level_agreement": "0",
      "allow_resetting_service_level_agreement": "0",
      "close_issue_after_days": "7",
      "get_started_sections": "console.log(\"hello\");",
      "show_latest_forum_posts": "0",
      "forum_url": "Sample Forum URL",
      "get_latest_query": "Sample Get Latest Query",
      "response_key_list": "Sample Response Key List",
      "post_title_key": "Sample Post Title Key",
      "post_description_key": "Sample Post Description Key",
      "post_route_key": "Sample Post Route Key",
      "post_route_string": "Sample Post Route String",
      "greeting_title": "We're here to help",
      "greeting_subtitle": "Browse help topics"
  };

  it('validates a correct Support Settings object', () => {
    const result = SupportSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupportSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupportSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
