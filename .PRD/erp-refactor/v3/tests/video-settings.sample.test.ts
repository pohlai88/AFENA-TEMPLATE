import { describe, it, expect } from 'vitest';
import { VideoSettingsSchema, VideoSettingsInsertSchema } from '../types/video-settings.js';

describe('VideoSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-VideoSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "enable_youtube_tracking": "0",
      "api_key": "Sample API Key",
      "frequency": "1 hr"
  };

  it('validates a correct Video Settings object', () => {
    const result = VideoSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = VideoSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = VideoSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
