/**
 * GAP-DB-006 / SER-01: Serialization boundary layer tests.
 *
 * Validates coerceMutationInput and coerceValue for API → DB coercion.
 * Handlers receive MutationSpec; input is coerced before dispatch.
 */

import { describe, it, expect } from 'vitest';

import { coerceMutationInput, coerceValue } from 'afena-canon';

describe('coerceValue (SER-01)', () => {
  it('returns null/undefined as-is', () => {
    expect(coerceValue(null)).toBe(null);
    expect(coerceValue(undefined)).toBe(undefined);
  });

  it('coerces date strings to ISO format', () => {
    expect(coerceValue('2025-02-15', 'date')).toBe('2025-02-15T00:00:00.000Z');
    expect(coerceValue('2025-02-15T12:00:00Z', 'date')).toBe('2025-02-15T12:00:00.000Z');
    expect(coerceValue(new Date('2025-02-15'), 'date')).toBe('2025-02-15T00:00:00.000Z');
  });

  it('passes through invalid date strings', () => {
    expect(coerceValue('not-a-date', 'date')).toBe('not-a-date');
  });

  it('validates UUID format and passes through valid UUIDs', () => {
    const valid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    expect(coerceValue(valid, 'uuid')).toBe(valid);
  });

  it('passes through objects for json hint', () => {
    const obj = { foo: 'bar' };
    expect(coerceValue(obj, 'json')).toBe(obj);
  });
});

describe('coerceMutationInput (SER-01)', () => {
  it('coerces date-like keys (created_at, issueDate, etc.)', () => {
    const input = {
      created_at: '2025-02-15',
      issueDate: '2025-01-01',
    };
    const result = coerceMutationInput(input);
    expect(result.created_at).toBe('2025-02-15T00:00:00.000Z');
    expect(result.issueDate).toBe('2025-01-01T00:00:00.000Z');
  });

  it('preserves id-like keys (company_id, etc.)', () => {
    const uuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const input = { company_id: uuid, contactId: uuid };
    const result = coerceMutationInput(input);
    expect(result.company_id).toBe(uuid);
    expect(result.contactId).toBe(uuid);
  });

  it('preserves custom_data / customData as objects', () => {
    const custom = { key: 'value' };
    const input = { custom_data: custom, customData: { other: 1 } };
    const result = coerceMutationInput(input);
    expect(result.custom_data).toBe(custom);
    expect(result.customData).toEqual({ other: 1 });
  });

  it('preserves null and undefined values', () => {
    const input = { optional_field: null, another: undefined };
    const result = coerceMutationInput(input);
    expect(result.optional_field).toBe(null);
    expect(result.another).toBe(undefined);
  });

  it('passes through primitive values for non-special keys', () => {
    const input = { name: 'Test', count: 42, active: true };
    const result = coerceMutationInput(input);
    expect(result).toEqual(input);
  });
});
