import { describe, it, expect } from 'vitest';
import { SupportSearchSourceSchema, SupportSearchSourceInsertSchema } from '../types/support-search-source.js';

describe('SupportSearchSource Zod validation', () => {
  const validSample = {
      "id": "TEST-SupportSearchSource-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "source_name": "Sample Source Name",
      "source_type": "API",
      "base_url": "Sample Base URL",
      "query_route": "Sample Query Route String",
      "search_term_param_name": "Sample Search Term Param Name",
      "response_result_key_path": "Sample Response Result Key Path",
      "post_route": "Sample Post Route String",
      "post_route_key_list": "Sample Post Route Key List",
      "post_title_key": "Sample Post Title Key",
      "post_description_key": "Sample Post Description Key",
      "source_doctype": "LINK-source_doctype-001",
      "result_title_field": "Sample Result Title Field",
      "result_preview_field": "Sample Result Preview Field",
      "result_route_field": "Sample Result Route Field"
  };

  it('validates a correct Support Search Source object', () => {
    const result = SupportSearchSourceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupportSearchSourceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "source_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).source_type;
    const result = SupportSearchSourceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupportSearchSourceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
