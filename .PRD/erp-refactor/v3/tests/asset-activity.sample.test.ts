import { describe, it, expect } from 'vitest';
import { AssetActivitySchema, AssetActivityInsertSchema } from '../types/asset-activity.js';

describe('AssetActivity Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetActivity-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "asset": "LINK-asset-001",
      "date": "now",
      "user": "LINK-user-001",
      "subject": "Sample text for subject"
  };

  it('validates a correct Asset Activity object', () => {
    const result = AssetActivitySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetActivityInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "asset" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).asset;
    const result = AssetActivitySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetActivitySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
