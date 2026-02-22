import { describe, expect, it } from 'vitest';
import {
  AssetTypeMismatchError,
  BatchOperationError,
  CacheError,
  ClassificationError,
  ConfigurationError,
  formatError,
  getErrorContext,
  getUserMessage,
  InvalidAssetKeyError,
  isErrorType,
  isLiteMetaError,
  LiteMetaError,
  ValidationError,
} from '../errors';

describe('Error Taxonomy', () => {
  describe('LiteMetaError Base Class', () => {
    it('should be instanceof Error', () => {
      const error = new InvalidAssetKeyError('test', 'reason');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(LiteMetaError);
    });

    it('should have correct name', () => {
      const error = new InvalidAssetKeyError('test', 'reason');
      expect(error.name).toBe('InvalidAssetKeyError');
    });

    it('should serialize to JSON', () => {
      const error = new InvalidAssetKeyError('test.key', 'invalid format', {
        extra: 'data',
      });

      const json = error.toJSON();

      expect(json.name).toBe('InvalidAssetKeyError');
      expect(json.code).toBe('INVALID_ASSET_KEY');
      expect(json.message).toContain('test.key');
      expect(json.context).toEqual({
        key: 'test.key',
        reason: 'invalid format',
        extra: 'data',
      });
      expect(json.stack).toBeDefined();
    });
  });

  describe('InvalidAssetKeyError', () => {
    it('should create error with correct properties', () => {
      const error = new InvalidAssetKeyError('db.rec.test', 'missing segments');

      expect(error.message).toBe('Invalid asset key "db.rec.test": missing segments');
      expect(error.code).toBe('INVALID_ASSET_KEY');
      expect(error.context).toEqual({
        key: 'db.rec.test',
        reason: 'missing segments',
      });
    });

    it('should include additional context', () => {
      const error = new InvalidAssetKeyError('key', 'reason', { userId: '123' });

      expect(error.context).toEqual({
        key: 'key',
        reason: 'reason',
        userId: '123',
      });
    });
  });

  describe('AssetTypeMismatchError', () => {
    it('should create error with correct properties', () => {
      const error = new AssetTypeMismatchError(
        'table',
        'column',
        'db.rec.test.public.users'
      );

      expect(error.message).toContain('expected table, got column');
      expect(error.code).toBe('ASSET_TYPE_MISMATCH');
      expect(error.context).toEqual({
        expected: 'table',
        actual: 'column',
        key: 'db.rec.test.public.users',
      });
    });

    it('should include additional context', () => {
      const error = new AssetTypeMismatchError('table', 'view', 'key', {
        source: 'parser',
      });

      expect(error.context?.source).toBe('parser');
    });
  });

  describe('ClassificationError', () => {
    it('should create error with correct properties', () => {
      const error = new ClassificationError('email', 'pattern not found');

      expect(error.message).toBe('Classification failed for column "email": pattern not found');
      expect(error.code).toBe('CLASSIFICATION_FAILED');
      expect(error.context).toEqual({
        columnName: 'email',
        reason: 'pattern not found',
      });
    });
  });

  describe('BatchOperationError', () => {
    it('should create error with correct properties', () => {
      const error = new BatchOperationError('parse', 5, 100);

      expect(error.message).toBe('Batch parse failed: 5/100 items failed');
      expect(error.code).toBe('BATCH_OPERATION_FAILED');
      expect(error.context).toEqual({
        operation: 'parse',
        failedCount: 5,
        totalCount: 100,
      });
    });

    it('should handle zero failures', () => {
      const error = new BatchOperationError('classify', 0, 50);
      expect(error.message).toContain('0/50');
    });
  });

  describe('CacheError', () => {
    it('should create error with correct properties', () => {
      const error = new CacheError('get', 'assetKeyCache', 'connection timeout');

      expect(error.message).toBe('Cache get failed for "assetKeyCache": connection timeout');
      expect(error.code).toBe('CACHE_ERROR');
      expect(error.context).toEqual({
        operation: 'get',
        cacheName: 'assetKeyCache',
        reason: 'connection timeout',
      });
    });
  });

  describe('ValidationError', () => {
    it('should create error with correct properties', () => {
      const error = new ValidationError('email', 'invalid@', 'invalid format');

      expect(error.message).toBe('Validation failed for field "email": invalid format');
      expect(error.code).toBe('VALIDATION_FAILED');
      expect(error.context).toEqual({
        field: 'email',
        value: 'invalid@',
        reason: 'invalid format',
      });
    });

    it('should handle complex values', () => {
      const error = new ValidationError('config', { nested: 'object' }, 'invalid schema');
      expect(error.context?.value).toEqual({ nested: 'object' });
    });
  });

  describe('ConfigurationError', () => {
    it('should create error with correct properties', () => {
      const error = new ConfigurationError('maxSize', 'must be positive');

      expect(error.message).toBe('Configuration error for "maxSize": must be positive');
      expect(error.code).toBe('CONFIGURATION_ERROR');
      expect(error.context).toEqual({
        setting: 'maxSize',
        reason: 'must be positive',
      });
    });
  });

  describe('isLiteMetaError', () => {
    it('should return true for LiteMeta errors', () => {
      const error = new InvalidAssetKeyError('key', 'reason');
      expect(isLiteMetaError(error)).toBe(true);
    });

    it('should return false for standard errors', () => {
      const error = new Error('standard error');
      expect(isLiteMetaError(error)).toBe(false);
    });

    it('should return false for non-errors', () => {
      expect(isLiteMetaError('string')).toBe(false);
      expect(isLiteMetaError(null)).toBe(false);
      expect(isLiteMetaError(undefined)).toBe(false);
      expect(isLiteMetaError({})).toBe(false);
    });
  });

  describe('isErrorType', () => {
    it('should return true for matching error type', () => {
      const error = new InvalidAssetKeyError('key', 'reason');
      expect(isErrorType(error, InvalidAssetKeyError)).toBe(true);
    });

    it('should return false for different error type', () => {
      const error = new InvalidAssetKeyError('key', 'reason');
      expect(isErrorType(error, ClassificationError)).toBe(false);
    });

    it('should return false for standard errors', () => {
      const error = new Error('standard');
      expect(isErrorType(error, InvalidAssetKeyError)).toBe(false);
    });

    it('should work with all error types', () => {
      expect(isErrorType(new InvalidAssetKeyError('k', 'r'), InvalidAssetKeyError)).toBe(true);
      expect(isErrorType(new AssetTypeMismatchError('t', 'a', 'k'), AssetTypeMismatchError)).toBe(true);
      expect(isErrorType(new ClassificationError('c', 'r'), ClassificationError)).toBe(true);
      expect(isErrorType(new BatchOperationError('o', 1, 10), BatchOperationError)).toBe(true);
      expect(isErrorType(new CacheError('o', 'c', 'r'), CacheError)).toBe(true);
      expect(isErrorType(new ValidationError('f', 'v', 'r'), ValidationError)).toBe(true);
      expect(isErrorType(new ConfigurationError('s', 'r'), ConfigurationError)).toBe(true);
    });
  });

  describe('getErrorContext', () => {
    it('should return context for LiteMeta errors', () => {
      const error = new InvalidAssetKeyError('key', 'reason', { extra: 'data' });
      const context = getErrorContext(error);

      expect(context).toEqual({
        key: 'key',
        reason: 'reason',
        extra: 'data',
      });
    });

    it('should return empty object for standard errors', () => {
      const error = new Error('standard');
      const context = getErrorContext(error);

      expect(context).toEqual({});
    });

    it('should return empty object for non-errors', () => {
      expect(getErrorContext('string')).toEqual({});
      expect(getErrorContext(null)).toEqual({});
      expect(getErrorContext(undefined)).toEqual({});
    });

    it('should handle errors without context', () => {
      const error = new InvalidAssetKeyError('key', 'reason');
      const context = getErrorContext(error);

      expect(context).toEqual({
        key: 'key',
        reason: 'reason',
      });
    });
  });

  describe('formatError', () => {
    it('should format LiteMeta errors as JSON', () => {
      const error = new InvalidAssetKeyError('key', 'reason');
      const formatted = formatError(error);

      expect(formatted).toContain('InvalidAssetKeyError');
      expect(formatted).toContain('INVALID_ASSET_KEY');
      expect(formatted).toContain('key');
    });

    it('should format standard errors with stack', () => {
      const error = new Error('standard error');
      const formatted = formatError(error);

      expect(formatted).toContain('Error: standard error');
      expect(formatted).toContain('at '); // Stack trace
    });

    it('should format non-errors as string', () => {
      expect(formatError('string error')).toBe('string error');
      expect(formatError(42)).toBe('42');
      expect(formatError(null)).toBe('null');
    });
  });

  describe('getUserMessage', () => {
    it('should return message for LiteMeta errors', () => {
      const error = new InvalidAssetKeyError('key', 'reason');
      const message = getUserMessage(error);

      expect(message).toBe('Invalid asset key "key": reason');
    });

    it('should return message for standard errors', () => {
      const error = new Error('standard error');
      const message = getUserMessage(error);

      expect(message).toBe('standard error');
    });

    it('should return generic message for non-errors', () => {
      expect(getUserMessage('string')).toBe('An unexpected error occurred');
      expect(getUserMessage(null)).toBe('An unexpected error occurred');
      expect(getUserMessage(undefined)).toBe('An unexpected error occurred');
    });
  });

  describe('Error Chaining', () => {
    it('should preserve error chain', () => {
      const cause = new Error('root cause');
      const error = new InvalidAssetKeyError('key', 'reason');
      (error as any).cause = cause;

      expect((error as any).cause).toBe(cause);
    });
  });

  describe('Error Context Merging', () => {
    it('should merge context correctly', () => {
      const error = new InvalidAssetKeyError('key', 'reason', {
        userId: '123',
        timestamp: Date.now(),
      });

      expect(error.context?.key).toBe('key');
      expect(error.context?.reason).toBe('reason');
      expect(error.context?.userId).toBe('123');
      expect(error.context?.timestamp).toBeDefined();
    });
  });
});
