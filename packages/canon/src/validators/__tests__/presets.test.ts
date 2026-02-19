/**
 * Presets Tests
 * 
 * Tests for all 22 data type validators with pass/fail cases.
 */

import { describe, expect, test } from 'vitest';
import type { DataType } from '../../enums/data-types';
import { CUSTOM_FIELD_VALIDATORS, validateCustomFieldValue } from '../presets/custom-field-value';

describe('Custom Field Value Presets', () => {
  const context = {
    entityType: 'contacts' as const,
    fieldPath: ['customFields', 'test'],
    mode: 'create' as const,
  };

  describe('String Types', () => {
    test('short_text: should validate with maxLength', () => {
      expect(validateCustomFieldValue('short_text', { maxLength: 10 }, 'hello', context).ok).toBe(true);
      expect(validateCustomFieldValue('short_text', { maxLength: 3 }, 'hello', context).ok).toBe(false);
    });

    test('long_text: should validate with optional maxLength', () => {
      expect(validateCustomFieldValue('long_text', {}, 'long text content', context).ok).toBe(true);
      expect(validateCustomFieldValue('long_text', { maxLength: 5 }, 'long text', context).ok).toBe(false);
    });

    test('rich_text: should validate as string', () => {
      expect(validateCustomFieldValue('rich_text', {}, '<p>rich content</p>', context).ok).toBe(true);
      expect(validateCustomFieldValue('rich_text', {}, 123, context).ok).toBe(false);
    });
  });

  describe('Number Types', () => {
    test('integer: should validate integers with min/max', () => {
      expect(validateCustomFieldValue('integer', {}, 42, context).ok).toBe(true);
      expect(validateCustomFieldValue('integer', {}, 42.5, context).ok).toBe(false);
      expect(validateCustomFieldValue('integer', { min: 0, max: 100 }, 50, context).ok).toBe(true);
      expect(validateCustomFieldValue('integer', { min: 0, max: 100 }, 150, context).ok).toBe(false);
    });

    test('decimal: should validate finite numbers', () => {
      expect(validateCustomFieldValue('decimal', {}, 42.5, context).ok).toBe(true);
      expect(validateCustomFieldValue('decimal', {}, Infinity, context).ok).toBe(false);
      expect(validateCustomFieldValue('decimal', {}, NaN, context).ok).toBe(false);
    });

    test('money: should validate integers (minor units)', () => {
      expect(validateCustomFieldValue('money', {}, 1000, context).ok).toBe(true);
      expect(validateCustomFieldValue('money', {}, 10.50, context).ok).toBe(false);
    });

    test('currency: should validate finite numbers', () => {
      expect(validateCustomFieldValue('currency', {}, 99.99, context).ok).toBe(true);
      expect(validateCustomFieldValue('currency', {}, Infinity, context).ok).toBe(false);
    });
  });

  describe('Boolean Type', () => {
    test('boolean: should validate booleans only', () => {
      expect(validateCustomFieldValue('boolean', {}, true, context).ok).toBe(true);
      expect(validateCustomFieldValue('boolean', {}, false, context).ok).toBe(true);
      expect(validateCustomFieldValue('boolean', {}, 'true', context).ok).toBe(false);
      expect(validateCustomFieldValue('boolean', {}, 1, context).ok).toBe(false);
    });
  });

  describe('Temporal Types', () => {
    test('date: should validate ISO dates', () => {
      expect(validateCustomFieldValue('date', {}, '2024-01-15', context).ok).toBe(true);
      expect(validateCustomFieldValue('date', {}, '2024-13-45', context).ok).toBe(false);
      expect(validateCustomFieldValue('date', {}, 'not-a-date', context).ok).toBe(false);
    });

    test('datetime: should validate ISO datetimes', () => {
      expect(validateCustomFieldValue('datetime', {}, '2024-01-15T10:30:00Z', context).ok).toBe(true);
      expect(validateCustomFieldValue('datetime', {}, 'invalid-datetime', context).ok).toBe(false);
    });
  });

  describe('Format Types', () => {
    test('email: should validate email format', () => {
      expect(validateCustomFieldValue('email', {}, 'user@example.com', context).ok).toBe(true);
      expect(validateCustomFieldValue('email', {}, 'invalid-email', context).ok).toBe(false);
      expect(validateCustomFieldValue('email', {}, 'missing@domain', context).ok).toBe(false);
    });

    test('url: should validate URL format', () => {
      expect(validateCustomFieldValue('url', {}, 'https://example.com', context).ok).toBe(true);
      expect(validateCustomFieldValue('url', {}, 'http://example.com', context).ok).toBe(true);
      expect(validateCustomFieldValue('url', {}, 'not-a-url', context).ok).toBe(false);
    });

    test('phone: should validate as string', () => {
      expect(validateCustomFieldValue('phone', {}, '555-1234', context).ok).toBe(true);
      expect(validateCustomFieldValue('phone', {}, 5551234, context).ok).toBe(false);
    });
  });

  describe('Enum Types', () => {
    test('enum: should validate against choices', () => {
      const config = { choices: ['red', 'green', 'blue'] };
      expect(validateCustomFieldValue('enum', config, 'red', context).ok).toBe(true);
      expect(validateCustomFieldValue('enum', config, 'yellow', context).ok).toBe(false);
    });

    test('multi_enum: should validate array against choices', () => {
      const config = { choices: ['red', 'green', 'blue'], maxSelections: 2 };
      expect(validateCustomFieldValue('multi_enum', config, ['red', 'blue'], context).ok).toBe(true);
      expect(validateCustomFieldValue('multi_enum', config, ['red', 'yellow'], context).ok).toBe(false);
      expect(validateCustomFieldValue('multi_enum', config, ['red', 'green', 'blue'], context).ok).toBe(false);
    });

    test('single_select: should validate against choices', () => {
      const config = { choices: ['option1', 'option2'] };
      expect(validateCustomFieldValue('single_select', config, 'option1', context).ok).toBe(true);
      expect(validateCustomFieldValue('single_select', config, 'option3', context).ok).toBe(false);
    });

    test('multi_select: should validate array against choices', () => {
      const config = { choices: ['a', 'b', 'c'] };
      expect(validateCustomFieldValue('multi_select', config, ['a', 'b'], context).ok).toBe(true);
      expect(validateCustomFieldValue('multi_select', config, ['a', 'd'], context).ok).toBe(false);
    });
  });

  describe('Reference Types', () => {
    test('entity_ref: should validate UUID format', () => {
      expect(validateCustomFieldValue('entity_ref', {}, '550e8400-e29b-41d4-a716-446655440000', context).ok).toBe(true);
      expect(validateCustomFieldValue('entity_ref', {}, 'not-a-uuid', context).ok).toBe(false);
    });

    test('relation: should validate UUID format', () => {
      expect(validateCustomFieldValue('relation', {}, '550e8400-e29b-41d4-a716-446655440000', context).ok).toBe(true);
      expect(validateCustomFieldValue('relation', {}, 'invalid', context).ok).toBe(false);
    });
  });

  describe('JSON Type', () => {
    test('json: should validate JSON-serializable values', () => {
      expect(validateCustomFieldValue('json', {}, { key: 'value' }, context).ok).toBe(true);
      expect(validateCustomFieldValue('json', {}, [1, 2, 3], context).ok).toBe(true);
      expect(validateCustomFieldValue('json', {}, 'string', context).ok).toBe(true);
      expect(validateCustomFieldValue('json', {}, 42, context).ok).toBe(true);
      expect(validateCustomFieldValue('json', {}, true, context).ok).toBe(true);
    });
  });

  describe('Binary and File Types', () => {
    test('binary: should validate as string', () => {
      expect(validateCustomFieldValue('binary', {}, 'base64data', context).ok).toBe(true);
      expect(validateCustomFieldValue('binary', {}, 123, context).ok).toBe(false);
    });

    test('file: should validate as string', () => {
      expect(validateCustomFieldValue('file', {}, 'file-path-or-id', context).ok).toBe(true);
      expect(validateCustomFieldValue('file', {}, 123, context).ok).toBe(false);
    });
  });

  describe('Formula Type', () => {
    test('formula: should accept any value', () => {
      expect(validateCustomFieldValue('formula', {}, 'computed', context).ok).toBe(true);
      expect(validateCustomFieldValue('formula', {}, 42, context).ok).toBe(true);
      expect(validateCustomFieldValue('formula', {}, null, context).ok).toBe(true);
    });
  });

  describe('Optional Values', () => {
    test('all types should accept null via optional wrapper', () => {
      const dataTypes: DataType[] = [
        'short_text', 'long_text', 'integer', 'decimal', 'money',
        'boolean', 'date', 'datetime', 'enum', 'multi_enum',
        'email', 'phone', 'url', 'entity_ref', 'json',
        'binary', 'file', 'single_select', 'multi_select',
        'rich_text', 'currency', 'formula', 'relation',
      ];

      for (const dataType of dataTypes) {
        const result = validateCustomFieldValue(dataType, {}, null, context);
        expect(result.ok).toBe(true);
      }
    });

    test('all types should accept undefined via optional wrapper', () => {
      const dataTypes: DataType[] = [
        'short_text', 'long_text', 'integer', 'decimal', 'money',
        'boolean', 'date', 'datetime', 'enum', 'multi_enum',
        'email', 'phone', 'url', 'entity_ref', 'json',
        'binary', 'file', 'single_select', 'multi_select',
        'rich_text', 'currency', 'formula', 'relation',
      ];

      for (const dataType of dataTypes) {
        const result = validateCustomFieldValue(dataType, {}, undefined, context);
        expect(result.ok).toBe(true);
      }
    });
  });

  describe('Registry Coverage', () => {
    test('CUSTOM_FIELD_VALIDATORS should have all 22 data types', () => {
      const expectedTypes: DataType[] = [
        'short_text', 'long_text', 'integer', 'decimal', 'money',
        'boolean', 'date', 'datetime', 'enum', 'multi_enum',
        'email', 'phone', 'url', 'entity_ref', 'json',
        'binary', 'file', 'single_select', 'multi_select',
        'rich_text', 'currency', 'formula', 'relation',
      ];

      for (const dataType of expectedTypes) {
        expect(CUSTOM_FIELD_VALIDATORS[dataType]).toBeDefined();
        expect(typeof CUSTOM_FIELD_VALIDATORS[dataType]).toBe('function');
      }
    });

    test('Registry should be frozen', () => {
      expect(Object.isFrozen(CUSTOM_FIELD_VALIDATORS)).toBe(true);
    });
  });
});
