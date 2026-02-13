import { describe, it, expect } from 'vitest';
import { DowntimeEntrySchema, DowntimeEntryInsertSchema } from '../types/downtime-entry.js';

describe('DowntimeEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-DowntimeEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "Option1",
      "workstation": "LINK-workstation-001",
      "operator": "LINK-operator-001",
      "from_time": "2024-01-15T10:30:00.000Z",
      "to_time": "2024-01-15T10:30:00.000Z",
      "downtime": 1,
      "stop_reason": "Excessive machine set up time",
      "remarks": "Sample text for remarks"
  };

  it('validates a correct Downtime Entry object', () => {
    const result = DowntimeEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DowntimeEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = DowntimeEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DowntimeEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
