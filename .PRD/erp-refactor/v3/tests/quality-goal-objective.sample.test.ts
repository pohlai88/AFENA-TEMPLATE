import { describe, it, expect } from 'vitest';
import { QualityGoalObjectiveSchema, QualityGoalObjectiveInsertSchema } from '../types/quality-goal-objective.js';

describe('QualityGoalObjective Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityGoalObjective-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "objective": "Sample text for objective",
      "target": "Sample Target",
      "uom": "LINK-uom-001"
  };

  it('validates a correct Quality Goal Objective object', () => {
    const result = QualityGoalObjectiveSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityGoalObjectiveInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "objective" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).objective;
    const result = QualityGoalObjectiveSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityGoalObjectiveSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
