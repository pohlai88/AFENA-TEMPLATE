import { describe, it, expect } from 'vitest';
import { TaskSchema, TaskInsertSchema } from '../types/task.js';

describe('Task Zod validation', () => {
  const validSample = {
      "id": "TEST-Task-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "subject": "Sample Subject",
      "project": "LINK-project-001",
      "issue": "LINK-issue-001",
      "type": "LINK-type-001",
      "color": "#3498db",
      "is_group": "0",
      "is_template": "0",
      "status": "Open",
      "priority": "Low",
      "task_weight": 1,
      "parent_task": "LINK-parent_task-001",
      "completed_by": "LINK-completed_by-001",
      "completed_on": "2024-01-15",
      "exp_start_date": "2024-01-15T10:30:00.000Z",
      "expected_time": "0",
      "start": 1,
      "exp_end_date": "2024-01-15T10:30:00.000Z",
      "progress": 1,
      "duration": 1,
      "is_milestone": "0",
      "description": "Sample text for description",
      "depends_on_tasks": "console.log(\"hello\");",
      "act_start_date": "2024-01-15",
      "actual_time": 1,
      "act_end_date": "2024-01-15",
      "total_costing_amount": 100,
      "total_billing_amount": 100,
      "review_date": "2024-01-15",
      "closing_date": "2024-01-15",
      "department": "LINK-department-001",
      "company": "LINK-company-001",
      "lft": 1,
      "rgt": 1,
      "old_parent": "Sample Old Parent",
      "template_task": "Sample Template Task"
  };

  it('validates a correct Task object', () => {
    const result = TaskSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TaskInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "subject" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).subject;
    const result = TaskSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TaskSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
