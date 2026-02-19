import { describe, expect, it } from 'vitest';
import { DATA_TYPES } from '../../enums/data-types';
import { TYPE_CONFIG_SCHEMAS } from '../data-types';

describe('Data Types Schema Invariants', () => {
  describe('INV-DT-01: TYPE_CONFIG_SCHEMAS Exhaustiveness', () => {
    it('should have a schema for every DataType', () => {
      const schemaKeys = Object.keys(TYPE_CONFIG_SCHEMAS).sort();
      const dataTypes = [...DATA_TYPES].sort();

      expect(schemaKeys).toEqual(dataTypes);
    });

    it('should not have extra schemas beyond DataType', () => {
      const schemaKeys = Object.keys(TYPE_CONFIG_SCHEMAS);
      const dataTypes = [...DATA_TYPES];

      // Every schema key must be a valid DataType
      for (const key of schemaKeys) {
        expect(dataTypes).toContain(key);
      }
    });
  });

  describe('INV-DT-02: Decimal Scale <= Precision', () => {
    const decimalSchema = TYPE_CONFIG_SCHEMAS.decimal;

    it('should accept scale equal to precision', () => {
      const result = decimalSchema.safeParse({
        precision: 10,
        scale: 10,
      });

      expect(result.success).toBe(true);
    });

    it('should accept scale less than precision', () => {
      const result = decimalSchema.safeParse({
        precision: 18,
        scale: 6,
      });

      expect(result.success).toBe(true);
    });

    it('should reject scale greater than precision', () => {
      const result = decimalSchema.safeParse({
        precision: 10,
        scale: 15,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('CANON_DECIMAL_SCALE_GT_PRECISION');
        expect(result.error.issues[0]?.path).toEqual(['scale']);
      }
    });

    it('should use default values when not provided', () => {
      const result = decimalSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.precision).toBe(18);
        expect(result.data.scale).toBe(6);
      }
    });

    it('should coerce string numbers to integers', () => {
      const result = decimalSchema.safeParse({
        precision: '20',
        scale: '8',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.precision).toBe(20);
        expect(result.data.scale).toBe(8);
      }
    });
  });

  describe('INV-DT-03: Currency Precision Range', () => {
    const currencySchema = TYPE_CONFIG_SCHEMAS.currency;

    it('should accept precision within range (0-10)', () => {
      expect(currencySchema.safeParse({ precision: 0 }).success).toBe(true);
      expect(currencySchema.safeParse({ precision: 2 }).success).toBe(true);
      expect(currencySchema.safeParse({ precision: 10 }).success).toBe(true);
    });

    it('should reject negative precision', () => {
      const result = currencySchema.safeParse({ precision: -1 });
      expect(result.success).toBe(false);
    });

    it('should reject precision above 10', () => {
      const result = currencySchema.safeParse({ precision: 11 });
      expect(result.success).toBe(false);
    });

    it('should use default values', () => {
      const result = currencySchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currencyCode).toBe('USD');
        expect(result.data.precision).toBe(2);
      }
    });
  });

  describe('INV-DT-04: Integer Min < Max', () => {
    const integerSchema = TYPE_CONFIG_SCHEMAS.integer;

    it('should accept min < max', () => {
      const result = integerSchema.safeParse({ min: 0, max: 100 });
      expect(result.success).toBe(true);
    });

    it('should reject min === max', () => {
      const result = integerSchema.safeParse({ min: 50, max: 50 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('CANON_INTEGER_MIN_GTE_MAX');
        expect(result.error.issues[0]?.path).toEqual(['max']);
      }
    });

    it('should reject min > max', () => {
      const result = integerSchema.safeParse({ min: 100, max: 0 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('CANON_INTEGER_MIN_GTE_MAX');
      }
    });

    it('should accept when only min is provided', () => {
      expect(integerSchema.safeParse({ min: 0 }).success).toBe(true);
    });

    it('should accept when only max is provided', () => {
      expect(integerSchema.safeParse({ max: 100 }).success).toBe(true);
    });

    it('should accept when neither is provided', () => {
      expect(integerSchema.safeParse({}).success).toBe(true);
    });
  });

  describe('INV-DT-05: Date MinDate < MaxDate', () => {
    const dateSchema = TYPE_CONFIG_SCHEMAS.date;

    it('should accept minDate < maxDate', () => {
      const result = dateSchema.safeParse({
        minDate: '2024-01-01',
        maxDate: '2024-12-31',
      });
      expect(result.success).toBe(true);
    });

    it('should reject minDate === maxDate', () => {
      const result = dateSchema.safeParse({
        minDate: '2024-06-15',
        maxDate: '2024-06-15',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('CANON_DATE_MIN_GTE_MAX');
        expect(result.error.issues[0]?.path).toEqual(['maxDate']);
      }
    });

    it('should reject minDate > maxDate', () => {
      const result = dateSchema.safeParse({
        minDate: '2024-12-31',
        maxDate: '2024-01-01',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('CANON_DATE_MIN_GTE_MAX');
      }
    });

    it('should accept when only minDate is provided', () => {
      expect(dateSchema.safeParse({ minDate: '2024-01-01' }).success).toBe(true);
    });

    it('should accept when only maxDate is provided', () => {
      expect(dateSchema.safeParse({ maxDate: '2024-12-31' }).success).toBe(true);
    });

    it('should accept when neither is provided', () => {
      expect(dateSchema.safeParse({}).success).toBe(true);
    });
  });

  describe('INV-DT-06: Multi-Select MaxSelections <= Choices', () => {
    const multiSelectSchema = TYPE_CONFIG_SCHEMAS.multi_select;

    it('should accept maxSelections < choices.length', () => {
      const result = multiSelectSchema.safeParse({
        choices: ['a', 'b', 'c', 'd', 'e'],
        maxSelections: 3,
      });
      expect(result.success).toBe(true);
    });

    it('should accept maxSelections === choices.length', () => {
      const result = multiSelectSchema.safeParse({
        choices: ['a', 'b', 'c'],
        maxSelections: 3,
      });
      expect(result.success).toBe(true);
    });

    it('should reject maxSelections > choices.length', () => {
      const result = multiSelectSchema.safeParse({
        choices: ['a', 'b'],
        maxSelections: 5,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('CANON_MULTISELECT_MAX_GT_CHOICES');
        expect(result.error.issues[0]?.path).toEqual(['maxSelections']);
      }
    });

    it('should accept when maxSelections is not provided', () => {
      const result = multiSelectSchema.safeParse({
        choices: ['a', 'b', 'c'],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('INV-DT-07: Multi-Enum MaxSelections <= Choices', () => {
    const multiEnumSchema = TYPE_CONFIG_SCHEMAS.multi_enum;

    it('should accept maxSelections < choices.length', () => {
      const result = multiEnumSchema.safeParse({
        choices: ['red', 'green', 'blue', 'yellow'],
        maxSelections: 2,
      });
      expect(result.success).toBe(true);
    });

    it('should accept maxSelections === choices.length', () => {
      const result = multiEnumSchema.safeParse({
        choices: ['small', 'medium', 'large'],
        maxSelections: 3,
      });
      expect(result.success).toBe(true);
    });

    it('should reject maxSelections > choices.length', () => {
      const result = multiEnumSchema.safeParse({
        choices: ['option1', 'option2'],
        maxSelections: 10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('CANON_MULTIENUM_MAX_GT_CHOICES');
        expect(result.error.issues[0]?.path).toEqual(['maxSelections']);
      }
    });

    it('should accept when maxSelections is not provided', () => {
      const result = multiEnumSchema.safeParse({
        choices: ['x', 'y', 'z'],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle boundary values for short_text maxLength', () => {
      const schema = TYPE_CONFIG_SCHEMAS.short_text;

      expect(schema.safeParse({ maxLength: 1 }).success).toBe(true);
      expect(schema.safeParse({ maxLength: 4000 }).success).toBe(true);
      expect(schema.safeParse({ maxLength: 0 }).success).toBe(false);
      expect(schema.safeParse({ maxLength: 4001 }).success).toBe(false);
    });

    it('should handle enum choices validation', () => {
      const schema = TYPE_CONFIG_SCHEMAS.enum;

      // Valid: 1-100 choices
      expect(schema.safeParse({ choices: ['a'] }).success).toBe(true);
      expect(schema.safeParse({ choices: Array(100).fill('x').map((_, i) => `opt${i}`) }).success).toBe(true);

      // Invalid: empty or too many
      expect(schema.safeParse({ choices: [] }).success).toBe(false);
      expect(schema.safeParse({ choices: Array(101).fill('x').map((_, i) => `opt${i}`) }).success).toBe(false);
    });

    it('should validate entity_ref targetEntity', () => {
      const schema = TYPE_CONFIG_SCHEMAS.entity_ref;

      expect(schema.safeParse({ targetEntity: 'contacts' }).success).toBe(true);
      expect(schema.safeParse({ targetEntity: '' }).success).toBe(false);
      expect(schema.safeParse({}).success).toBe(false);
    });
  });
});
