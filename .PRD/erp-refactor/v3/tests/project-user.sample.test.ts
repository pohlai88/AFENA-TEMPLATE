import { describe, it, expect } from 'vitest';
import { ProjectUserSchema, ProjectUserInsertSchema } from '../types/project-user.js';

describe('ProjectUser Zod validation', () => {
  const validSample = {
      "id": "TEST-ProjectUser-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "user": "LINK-user-001",
      "email": "Read Only Value",
      "image": "Read Only Value",
      "full_name": "Read Only Value",
      "welcome_email_sent": "0",
      "view_attachments": "0",
      "hide_timesheets": "0",
      "project_status": "Sample text for project_status"
  };

  it('validates a correct Project User object', () => {
    const result = ProjectUserSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProjectUserInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "user" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).user;
    const result = ProjectUserSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProjectUserSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
