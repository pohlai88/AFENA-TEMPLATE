import { describe, it, expect } from 'vitest';
import { ClosedDocumentSchema, ClosedDocumentInsertSchema } from '../types/closed-document.js';

describe('ClosedDocument Zod validation', () => {
  const validSample = {
      "id": "TEST-ClosedDocument-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "document_type": "LINK-document_type-001",
      "closed": "0"
  };

  it('validates a correct Closed Document object', () => {
    const result = ClosedDocumentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ClosedDocumentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "document_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).document_type;
    const result = ClosedDocumentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ClosedDocumentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
