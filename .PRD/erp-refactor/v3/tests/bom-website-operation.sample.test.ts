import { describe, it, expect } from 'vitest';
import { BomWebsiteOperationSchema, BomWebsiteOperationInsertSchema } from '../types/bom-website-operation.js';

describe('BomWebsiteOperation Zod validation', () => {
  const validSample = {
      "id": "TEST-BomWebsiteOperation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "operation": "LINK-operation-001",
      "workstation": "LINK-workstation-001",
      "time_in_mins": 1,
      "website_image": "/files/sample.png",
      "thumbnail": "Sample Thumbnail"
  };

  it('validates a correct BOM Website Operation object', () => {
    const result = BomWebsiteOperationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomWebsiteOperationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "operation" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).operation;
    const result = BomWebsiteOperationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomWebsiteOperationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
