/**
 * Composition Primitives Tests
 * 
 * Tests for pipe, all, any, optional, when, transform, withPath
 */

import { describe, expect, test } from 'vitest';
import { all, any, optional, pipe, transform, when, withPath } from '../core/compose';
import { VAL_CODES } from '../core/codes';
import { error, ok } from '../core/issue';
import type { ValidationContext, Validator } from '../core/types';

describe('Composition Primitives', () => {
  const context: ValidationContext = {
    entityType: 'contacts',
    fieldPath: ['test'],
    mode: 'create',
  };

  describe('pipe', () => {
    test('should pass value through validators in sequence', () => {
      const addOne: Validator<number> = (value) => 
        typeof value === 'number' ? ok((value as number) + 1) : { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context)] };
      
      const double: Validator<number> = (value) => 
        typeof value === 'number' ? ok((value as number) * 2) : { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context)] };

      const validator = pipe(addOne, double);
      const result = validator(5, context);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(12); // (5 + 1) * 2
      }
    });

    test('should stop on first error', () => {
      const pass: Validator<string> = (value) => ok(value as string);
      const fail: Validator<string> = () => ({ ok: false, issues: [error(VAL_CODES.INVALID_FORMAT, context)] });
      const neverCalled: Validator<string> = () => ok('should not reach');

      const validator = pipe(pass, fail, neverCalled);
      const result = validator('test', context);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues[0].code).toBe(VAL_CODES.INVALID_FORMAT);
      }
    });

    test('should accumulate warnings', () => {
      const warn1: Validator<string> = (value) => ({ ok: true, value: value as string, issues: [{ code: 'WARN_1', path: [], severity: 'warn' }] });
      const warn2: Validator<string> = (value) => ({ ok: true, value: value as string, issues: [{ code: 'WARN_2', path: [], severity: 'warn' }] });

      const validator = pipe(warn1, warn2);
      const result = validator('test', context);

      expect(result.ok).toBe(true);
      if (result.ok && result.issues) {
        expect(result.issues.length).toBe(2);
      }
    });
  });

  describe('all', () => {
    test('should collect all errors', () => {
      const fail1: Validator<string> = () => ({ ok: false, issues: [error(VAL_CODES.STRING_TOO_SHORT, context)] });
      const fail2: Validator<string> = () => ({ ok: false, issues: [error(VAL_CODES.STRING_TOO_LONG, context)] });

      const validator = all(fail1, fail2);
      const result = validator('test', context);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.length).toBe(2);
      }
    });

    test('should pass if all validators pass', () => {
      const pass1: Validator<string> = (value) => ok(value as string);
      const pass2: Validator<string> = (value) => ok(value as string);

      const validator = all(pass1, pass2);
      const result = validator('test', context);

      expect(result.ok).toBe(true);
    });
  });

  describe('any', () => {
    test('should return first success', () => {
      const fail: Validator<string> = () => ({ ok: false, issues: [error(VAL_CODES.INVALID_FORMAT, context)] });
      const pass: Validator<string> = (value) => ok(value as string);

      const validator = any(fail, pass);
      const result = validator('test', context);

      expect(result.ok).toBe(true);
    });

    test('should collect all errors if all fail', () => {
      const fail1: Validator<string> = () => ({ ok: false, issues: [error(VAL_CODES.STRING_TOO_SHORT, context)] });
      const fail2: Validator<string> = () => ({ ok: false, issues: [error(VAL_CODES.STRING_TOO_LONG, context)] });

      const validator = any(fail1, fail2);
      const result = validator('test', context);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.length).toBe(2);
      }
    });
  });

  describe('optional', () => {
    test('should pass null and undefined', () => {
      const validator = optional((value) => 
        typeof value === 'string' ? ok(value) : { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context)] }
      );

      expect(validator(null, context).ok).toBe(true);
      expect(validator(undefined, context).ok).toBe(true);
    });

    test('should validate non-null values', () => {
      const validator = optional((value) => 
        typeof value === 'string' ? ok(value) : { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context)] }
      );

      const result = validator('test', context);
      expect(result.ok).toBe(true);

      const failResult = validator(123, context);
      expect(failResult.ok).toBe(false);
    });
  });

  describe('when', () => {
    test('should validate when predicate is true', () => {
      const validator = when(
        (value) => typeof value === 'string' && (value as string).startsWith('http'),
        (value) => (value as string).includes('://') ? ok(value as string) : { ok: false, issues: [error(VAL_CODES.INVALID_FORMAT, context)] }
      );

      const result = validator('http://example.com', context);
      expect(result.ok).toBe(true);
    });

    test('should skip validation when predicate is false', () => {
      const validator = when(
        (value) => typeof value === 'string' && (value as string).startsWith('http'),
        () => ({ ok: false, issues: [error(VAL_CODES.INVALID_FORMAT, context)] })
      );

      const result = validator('not-a-url', context);
      expect(result.ok).toBe(true); // Skipped validation
    });
  });

  describe('transform', () => {
    test('should transform value after validation', () => {
      const validator = transform(
        (value) => typeof value === 'string' ? ok(value as string) : { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context)] },
        (str) => str.toUpperCase()
      );

      const result = validator('hello', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('HELLO');
      }
    });

    test('should not transform on validation failure', () => {
      const validator = transform(
        () => ({ ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context)] }),
        () => 'should not reach'
      );

      const result = validator('test', context);
      expect(result.ok).toBe(false);
    });
  });

  describe('withPath', () => {
    test('should add path segment', () => {
      const validator = withPath('email', (value, ctx) => {
        expect(ctx.fieldPath).toEqual(['test', 'email']);
        return ok(value);
      });

      validator('test', context);
    });

    test('should add multiple path segments', () => {
      const validator = withPath(['customFields', 'email'], (value, ctx) => {
        expect(ctx.fieldPath).toEqual(['test', 'customFields', 'email']);
        return ok(value);
      });

      validator('test', context);
    });
  });

  describe('Integration', () => {
    test('should compose multiple primitives', () => {
      const isString: Validator<string> = (value) => 
        typeof value === 'string' ? ok(value) : { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context)] };
      
      const minLength = (min: number): Validator<string> => (value) =>
        typeof value === 'string' && value.length >= min ? ok(value) : { ok: false, issues: [error(VAL_CODES.STRING_TOO_SHORT, context, { min })] };

      const validator = optional(pipe(isString, minLength(3)));

      expect(validator(null, context).ok).toBe(true);
      expect(validator('hello', context).ok).toBe(true);
      expect(validator('hi', context).ok).toBe(false);
    });
  });
});
