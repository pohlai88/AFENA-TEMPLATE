import { describe, it, expect } from 'vitest';
import { EmployeeEducationSchema, EmployeeEducationInsertSchema } from '../types/employee-education.js';

describe('EmployeeEducation Zod validation', () => {
  const validSample = {
      "id": "TEST-EmployeeEducation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "school_univ": "Sample text for school_univ",
      "qualification": "Sample Qualification",
      "level": "Graduate",
      "year_of_passing": 1,
      "class_per": "Sample Class / Percentage",
      "maj_opt_subj": "Sample text for maj_opt_subj"
  };

  it('validates a correct Employee Education object', () => {
    const result = EmployeeEducationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = EmployeeEducationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = EmployeeEducationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
