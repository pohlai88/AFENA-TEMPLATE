import { describe, it, expect } from 'vitest';
import { QualityGoalSchema, QualityGoalInsertSchema } from '../types/quality-goal.js';

describe('QualityGoal Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityGoal-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "goal": "Sample Goal",
      "frequency": "None",
      "procedure": "LINK-procedure-001",
      "weekday": "Monday",
      "date": "1"
  };

  it('validates a correct Quality Goal object', () => {
    const result = QualityGoalSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityGoalInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "goal" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).goal;
    const result = QualityGoalSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityGoalSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
