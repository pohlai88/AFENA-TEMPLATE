import { describe, it, expect } from 'vitest';
import { RoutingSchema, RoutingInsertSchema } from '../types/routing.js';

describe('Routing Zod validation', () => {
  const validSample = {
      "id": "TEST-Routing-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "routing_name": "Sample Routing Name",
      "disabled": "0"
  };

  it('validates a correct Routing object', () => {
    const result = RoutingSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RoutingInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RoutingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
