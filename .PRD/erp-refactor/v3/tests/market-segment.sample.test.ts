import { describe, it, expect } from 'vitest';
import { MarketSegmentSchema, MarketSegmentInsertSchema } from '../types/market-segment.js';

describe('MarketSegment Zod validation', () => {
  const validSample = {
      "id": "TEST-MarketSegment-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "market_segment": "Sample Market Segment"
  };

  it('validates a correct Market Segment object', () => {
    const result = MarketSegmentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MarketSegmentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MarketSegmentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
