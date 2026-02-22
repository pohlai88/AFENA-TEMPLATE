/**
 * Tests for CanonResult envelope and error handling
 * 
 * Verifies:
 * - CanonResult type discriminates correctly
 * - zodErrorToCanonIssues converts Zod errors properly
 * - Helper functions (ok, err, createIssue) work as expected
 * - exactOptionalPropertyTypes compatibility
 */

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  createIssue,
  err,
  errSingle,
  ok,
  zodErrorToCanonIssues,
  type CanonIssue,
  type CanonResult,
} from '../result';

describe('CanonResult Envelope', () => {
  describe('ok() helper', () => {
    it('should create success result', () => {
      const result = ok('test value');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('test value');
      }
    });

    it('should work with complex types', () => {
      const data = { id: '123', name: 'Test', nested: { value: 42 } };
      const result = ok(data);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(data);
      }
    });

    it('should work with null and undefined', () => {
      const nullResult = ok(null);
      const undefinedResult = ok(undefined);

      expect(nullResult.ok).toBe(true);
      expect(undefinedResult.ok).toBe(true);
    });
  });

  describe('err() helper', () => {
    it('should create error result with issues', () => {
      const issues: CanonIssue[] = [
        { code: 'INVALID_TYPE', message: 'Expected string' },
      ];
      const result = err<string>(issues);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues).toEqual(issues);
      }
    });

    it('should work with multiple issues', () => {
      const issues: CanonIssue[] = [
        { code: 'INVALID_TYPE', message: 'Expected string', path: ['field1'] },
        { code: 'STRING_TOO_LONG', message: 'Max length exceeded', path: ['field2'] },
      ];
      const result = err<string>(issues);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues).toHaveLength(2);
      }
    });
  });

  describe('errSingle() helper', () => {
    it('should create error result with single issue', () => {
      const result = errSingle<string>('INVALID_TYPE', 'Expected string');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues).toHaveLength(1);
        expect(result.issues[0]!.code).toBe('INVALID_TYPE');
        expect(result.issues[0]!.message).toBe('Expected string');
      }
    });

    it('should include path when provided', () => {
      const result = errSingle<string>('INVALID_TYPE', 'Expected string', ['user', 'email']);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues[0]!.path).toEqual(['user', 'email']);
      }
    });

    it('should include details when provided', () => {
      const result = errSingle<string>(
        'INVALID_TYPE',
        'Expected string',
        ['field'],
        { expected: 'string', received: 'number' }
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues[0]!.details).toEqual({ expected: 'string', received: 'number' });
      }
    });
  });

  describe('createIssue()', () => {
    it('should create issue with required fields only', () => {
      const issue = createIssue('INVALID_TYPE', 'Expected string');

      expect(issue.code).toBe('INVALID_TYPE');
      expect(issue.message).toBe('Expected string');
      expect(issue.path).toBeUndefined();
      expect(issue.details).toBeUndefined();
    });

    it('should create issue with path', () => {
      const issue = createIssue('INVALID_TYPE', 'Expected string', ['user', 'email']);

      expect(issue.path).toBeDefined();
      expect(issue.path!).toEqual(['user', 'email']);
    });

    it('should create issue with details', () => {
      const issue = createIssue(
        'INVALID_TYPE',
        'Expected string',
        undefined,
        { expected: 'string', received: 'number' }
      );

      expect(issue.details).toBeDefined();
      expect(issue.details!).toEqual({ expected: 'string', received: 'number' });
    });

    it('should create issue with both path and details', () => {
      const issue = createIssue(
        'INVALID_TYPE',
        'Expected string',
        ['field'],
        { expected: 'string' }
      );

      expect(issue.path).toBeDefined();
      expect(issue.path!).toEqual(['field']);
      expect(issue.details).toBeDefined();
      expect(issue.details!).toEqual({ expected: 'string' });
    });

    it('should handle numeric path segments', () => {
      const issue = createIssue('INVALID_TYPE', 'Expected string', ['items', 0, 'name']);

      expect(issue.path).toBeDefined();
      expect(issue.path!).toEqual(['items', 0, 'name']);
    });
  });

  describe('zodErrorToCanonIssues()', () => {
    it('should convert simple Zod error', () => {
      const schema = z.string();
      const result = schema.safeParse(123);

      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = zodErrorToCanonIssues(result.error);

        expect(issues).toHaveLength(1);
        expect(issues[0]!.code).toBe('invalid_type');
        expect(issues[0]!.message).toContain('string');
        expect(issues[0]!.message).toContain('number');
      }
    });

    it('should convert nested object errors', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });
      const result = schema.safeParse({ name: 123, age: 'not a number' });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = zodErrorToCanonIssues(result.error);

        expect(issues.length).toBeGreaterThan(0);
        expect(issues.some(i => i.path?.includes('name'))).toBe(true);
        expect(issues.some(i => i.path?.includes('age'))).toBe(true);
      }
    });

    it('should filter out symbol path segments', () => {
      // Zod can include symbols in paths for certain validations
      const schema = z.string().email();
      const result = schema.safeParse('not-an-email');

      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = zodErrorToCanonIssues(result.error);

        // All path segments should be string or number
        issues.forEach(issue => {
          if (issue.path) {
            issue.path.forEach(segment => {
              expect(typeof segment === 'string' || typeof segment === 'number').toBe(true);
            });
          }
        });
      }
    });

    it('should include details when available', () => {
      const schema = z.string();
      const result = schema.safeParse(123);

      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = zodErrorToCanonIssues(result.error);

        expect(issues[0]!.details).toBeDefined();
      }
    });

    it('should handle array validation errors', () => {
      const schema = z.array(z.number());
      const result = schema.safeParse([1, 'two', 3]);

      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = zodErrorToCanonIssues(result.error);

        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0]!.path).toContain(1); // Index 1 failed
      }
    });
  });

  describe('Type discrimination', () => {
    it('should narrow type with ok check', () => {
      const result: CanonResult<string> = ok('test');

      if (result.ok) {
        // TypeScript should know result.value is string
        const value: string = result.value;
        expect(value).toBe('test');
      } else {
        // This branch should not execute
        expect.fail('Should not reach here');
      }
    });

    it('should narrow type with !ok check', () => {
      const result: CanonResult<string> = errSingle('ERROR', 'Test error');

      if (!result.ok) {
        // TypeScript should know result.issues exists
        const issues: CanonIssue[] = result.issues;
        expect(issues).toHaveLength(1);
      } else {
        // This branch should not execute
        expect.fail('Should not reach here');
      }
    });
  });

  describe('exactOptionalPropertyTypes compatibility', () => {
    it('should not include undefined for optional properties', () => {
      const issue = createIssue('CODE', 'Message');

      // These should not be present (not even as undefined)
      expect('path' in issue).toBe(false);
      expect('details' in issue).toBe(false);
    });

    it('should include optional properties when provided', () => {
      const issue = createIssue('CODE', 'Message', ['path'], { key: 'value' });

      expect('path' in issue).toBe(true);
      expect('details' in issue).toBe(true);
    });
  });
});
