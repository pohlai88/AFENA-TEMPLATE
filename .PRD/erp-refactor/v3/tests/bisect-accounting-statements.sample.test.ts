import { describe, it, expect } from 'vitest';
import { BisectAccountingStatementsSchema, BisectAccountingStatementsInsertSchema } from '../types/bisect-accounting-statements.js';

describe('BisectAccountingStatements Zod validation', () => {
  const validSample = {
      "id": "TEST-BisectAccountingStatements-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "from_date": "2024-01-15T10:30:00.000Z",
      "to_date": "2024-01-15T10:30:00.000Z",
      "algorithm": "BFS",
      "current_node": "LINK-current_node-001",
      "bisect_heatmap": "Sample text for bisect_heatmap",
      "current_from_date": "2024-01-15T10:30:00.000Z",
      "current_to_date": "2024-01-15T10:30:00.000Z",
      "p_l_summary": 1,
      "b_s_summary": 1,
      "difference": 1
  };

  it('validates a correct Bisect Accounting Statements object', () => {
    const result = BisectAccountingStatementsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BisectAccountingStatementsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BisectAccountingStatementsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
