import { describe, expect, it } from 'vitest';
import { BudgetExceededError } from '../cpu-budget';
import {
  andThen,
  classifyColumnsSafe,
  isError,
  isOk,
  mapResult,
  parseAssetKeySafe,
  unwrap,
  unwrapOr,
  type Result,
} from '../safe-wrappers';

describe('Safe Wrappers', () => {
  describe('parseAssetKeySafe', () => {
    it('should return ok result for valid key', () => {
      const result = parseAssetKeySafe('db.rec.test.public.users');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.prefix).toBe('db.rec');
        expect(result.value.valid).toBe(true);
      }
    });

    it('should return ok result even for invalid key (parseAssetKey never throws)', () => {
      const result = parseAssetKeySafe('invalid');

      // parseAssetKey never throws - it returns ParsedAssetKey with valid: false
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.valid).toBe(false);
        expect(result.value.errors.length).toBeGreaterThan(0);
      }
    });

    it('should enforce CPU budget', () => {
      const result = parseAssetKeySafe('db.rec.test.public.users', {
        maxIterations: 0,
        maxTimeMs: 100,
        maxMemoryBytes: 10 * 1024 * 1024,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(BudgetExceededError);
      }
    });

    it('should use fast budget by default', () => {
      const result = parseAssetKeySafe('db.rec.test.public.users');
      expect(result.ok).toBe(true);
    });

    it('should handle empty key', () => {
      const result = parseAssetKeySafe('');

      // parseAssetKey never throws - returns ParsedAssetKey with valid: false
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.valid).toBe(false);
      }
    });

    it('should never throw', () => {
      expect(() => parseAssetKeySafe('invalid')).not.toThrow();
      expect(() => parseAssetKeySafe('')).not.toThrow();
      expect(() => parseAssetKeySafe('db.rec.test.public.users')).not.toThrow();
    });
  });

  describe('classifyColumnsSafe', () => {
    it('should return ok result for valid columns', () => {
      const result = classifyColumnsSafe([
        { name: 'email', sampleValues: ['user@example.com'] },
        { name: 'phone', sampleValues: ['555-1234'] },
      ]);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.size).toBeGreaterThan(0);
        const emailClass = result.value.get('email');
        expect(emailClass).toBeDefined();
      }
    });

    it('should return ok result for empty array', () => {
      const result = classifyColumnsSafe([]);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.size).toBe(0);
      }
    });

    it('should enforce CPU budget', () => {
      const result = classifyColumnsSafe(
        [{ name: 'test', sampleValues: [] }],
        {
          maxIterations: 0,
          maxTimeMs: 10000,
        }
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(BudgetExceededError);
      }
    });

    it('should use normal budget by default', () => {
      const result = classifyColumnsSafe([{ name: 'test' }]);
      expect(result.ok).toBe(true);
    });

    it('should never throw', () => {
      expect(() => classifyColumnsSafe([])).not.toThrow();
      expect(() => classifyColumnsSafe([{ name: 'test' }])).not.toThrow();
    });
  });

  describe('Result Utilities', () => {
    describe('unwrap', () => {
      it('should return value for ok result', () => {
        const result: Result<number> = { ok: true, value: 42 };
        expect(unwrap(result)).toBe(42);
      });

      it('should throw error for error result', () => {
        const error = new Error('test error');
        const result: Result<number> = { ok: false, error };

        expect(() => unwrap(result)).toThrow('test error');
      });
    });

    describe('unwrapOr', () => {
      it('should return value for ok result', () => {
        const result: Result<number> = { ok: true, value: 42 };
        expect(unwrapOr(result, 0)).toBe(42);
      });

      it('should return default for error result', () => {
        const result: Result<number> = { ok: false, error: new Error('test') };
        expect(unwrapOr(result, 0)).toBe(0);
      });

      it('should work with different types', () => {
        const result: Result<string> = { ok: false, error: new Error('test') };
        expect(unwrapOr(result, 'default')).toBe('default');
      });
    });

    describe('mapResult', () => {
      it('should transform ok result', () => {
        const result: Result<number> = { ok: true, value: 42 };
        const mapped = mapResult(result, (x) => x * 2);

        expect(mapped.ok).toBe(true);
        if (mapped.ok) {
          expect(mapped.value).toBe(84);
        }
      });

      it('should preserve error result', () => {
        const error = new Error('test');
        const result: Result<number> = { ok: false, error };
        const mapped = mapResult(result, (x) => x * 2);

        expect(mapped.ok).toBe(false);
        if (!mapped.ok) {
          expect(mapped.error).toBe(error);
        }
      });

      it('should work with type transformations', () => {
        const result: Result<number> = { ok: true, value: 42 };
        const mapped = mapResult(result, (x: number) => String(x));

        expect(mapped.ok).toBe(true);
        if (mapped.ok) {
          expect(mapped.value).toBe('42');
        }
      });
    });

    describe('andThen', () => {
      it('should chain ok results', () => {
        const result: Result<number> = { ok: true, value: 42 };
        const chained = andThen(result, (x) => ({ ok: true, value: x * 2 }));

        expect(chained.ok).toBe(true);
        if (chained.ok) {
          expect(chained.value).toBe(84);
        }
      });

      it('should short-circuit on error', () => {
        const error = new Error('test');
        const result: Result<number> = { ok: false, error };
        const chained = andThen(result, (x) => ({ ok: true, value: x * 2 }));

        expect(chained.ok).toBe(false);
        if (!chained.ok) {
          expect(chained.error).toBe(error);
        }
      });

      it('should propagate errors from chain', () => {
        const result: Result<number> = { ok: true, value: 42 };
        const error = new Error('chain error');
        const chained = andThen(result, () => ({ ok: false, error }));

        expect(chained.ok).toBe(false);
        if (!chained.ok) {
          expect(chained.error).toBe(error);
        }
      });

      it('should work with multiple chains', () => {
        const result: Result<number> = { ok: true, value: 10 };
        const final = andThen(
          andThen(result, (x) => ({ ok: true, value: x * 2 })),
          (x) => ({ ok: true, value: x + 5 })
        );

        expect(final.ok).toBe(true);
        if (final.ok) {
          expect(final.value).toBe(25); // (10 * 2) + 5
        }
      });
    });

    describe('isOk', () => {
      it('should return true for ok result', () => {
        const result: Result<number> = { ok: true, value: 42 };
        expect(isOk(result)).toBe(true);
      });

      it('should return false for error result', () => {
        const result: Result<number> = { ok: false, error: new Error('test') };
        expect(isOk(result)).toBe(false);
      });

      it('should narrow type', () => {
        const result: Result<number> = { ok: true, value: 42 };
        if (isOk(result)) {
          // TypeScript should know result.value exists
          expect(result.value).toBe(42);
        }
      });
    });

    describe('isError', () => {
      it('should return false for ok result', () => {
        const result: Result<number> = { ok: true, value: 42 };
        expect(isError(result)).toBe(false);
      });

      it('should return true for error result', () => {
        const result: Result<number> = { ok: false, error: new Error('test') };
        expect(isError(result)).toBe(true);
      });

      it('should narrow type', () => {
        const result: Result<number> = { ok: false, error: new Error('test') };
        if (isError(result)) {
          // TypeScript should know result.error exists
          expect(result.error.message).toBe('test');
        }
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle parse -> map -> unwrap', () => {
      const result = parseAssetKeySafe('db.rec.test.public.users');
      const prefix = mapResult(result, (parsed) => parsed.prefix);
      const value = unwrapOr(prefix, null);

      expect(value).toBe('db.rec');
    });

    it('should handle parse -> andThen -> unwrapOr', () => {
      const result = parseAssetKeySafe('db.rec.test.public.users');
      const chained = andThen(result, (parsed) => {
        if (parsed.valid) {
          return { ok: true, value: parsed.prefix };
        }
        return { ok: false, error: new Error('invalid') };
      });

      expect(unwrapOr(chained, null)).toBe('db.rec');
    });

    it('should handle error propagation', () => {
      const result = parseAssetKeySafe('db.rec.test.public.users', { maxIterations: 0 });
      const mapped = mapResult(result, (parsed) => parsed.prefix);
      const chained = andThen(mapped, (prefix) => ({ ok: true, value: prefix }));

      expect(isError(chained)).toBe(true);
    });

    it('should handle multiple operations safely', () => {
      const keys = ['db.rec.test.public.users', 'db.field.test.public.users.email'];
      const results = keys.map((key) => parseAssetKeySafe(key));

      const validResults = results.filter(isOk);

      expect(validResults.length).toBe(2);
      expect(validResults.every((r) => r.ok && r.value.valid)).toBe(true);
    });
  });

  describe('Error Recovery Patterns', () => {
    it('should provide fallback values', () => {
      const result = parseAssetKeySafe('db.rec.test.public.users', { maxIterations: 0 });
      const value = unwrapOr(mapResult(result, (p) => p.prefix), 'unknown');

      expect(value).toBe('unknown');
    });

    it('should chain with error handling', () => {
      const result = parseAssetKeySafe('db.rec.test.public.users');
      const final = andThen(result, (parsed) => {
        if (!parsed.valid) {
          return { ok: false, error: new Error('validation failed') };
        }
        return { ok: true, value: parsed.segments.join('.') };
      });

      expect(isOk(final)).toBe(true);
      if (isOk(final)) {
        expect(final.value).toBe('test.public.users');
      }
    });
  });
});
