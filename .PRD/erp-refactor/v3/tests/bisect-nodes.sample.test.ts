import { describe, it, expect } from 'vitest';
import { BisectNodesSchema, BisectNodesInsertSchema } from '../types/bisect-nodes.js';

describe('BisectNodes Zod validation', () => {
  const validSample = {
      "id": "TEST-BisectNodes-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "root": "LINK-root-001",
      "left_child": "LINK-left_child-001",
      "right_child": "LINK-right_child-001",
      "period_from_date": "2024-01-15T10:30:00.000Z",
      "period_to_date": "2024-01-15T10:30:00.000Z",
      "difference": 1,
      "balance_sheet_summary": 1,
      "profit_loss_summary": 1,
      "generated": "0"
  };

  it('validates a correct Bisect Nodes object', () => {
    const result = BisectNodesSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BisectNodesInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BisectNodesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
