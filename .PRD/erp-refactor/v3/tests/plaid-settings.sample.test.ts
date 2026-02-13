import { describe, it, expect } from 'vitest';
import { PlaidSettingsSchema, PlaidSettingsInsertSchema } from '../types/plaid-settings.js';

describe('PlaidSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-PlaidSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "enabled": "0",
      "automatic_sync": "0",
      "plaid_client_id": "Sample Plaid Client ID",
      "plaid_secret": "********",
      "plaid_env": "sandbox",
      "enable_european_access": "0"
  };

  it('validates a correct Plaid Settings object', () => {
    const result = PlaidSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PlaidSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PlaidSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
