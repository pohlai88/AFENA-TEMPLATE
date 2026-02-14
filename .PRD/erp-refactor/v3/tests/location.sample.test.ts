import { describe, it, expect } from 'vitest';
import { LocationSchema, LocationInsertSchema } from '../types/location.js';

describe('Location Zod validation', () => {
  const validSample = {
      "id": "TEST-Location-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "location_name": "Sample Location Name",
      "parent_location": "LINK-parent_location-001",
      "is_container": "0",
      "is_group": "0",
      "latitude": 1,
      "longitude": 1,
      "area": 1,
      "area_uom": "LINK-area_uom-001",
      "location": {
          "type": "Point",
          "coordinates": [
              0,
              0
          ]
      },
      "lft": 1,
      "rgt": 1,
      "old_parent": "Sample Old Parent"
  };

  it('validates a correct Location object', () => {
    const result = LocationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LocationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "location_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).location_name;
    const result = LocationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LocationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
