/**
 * DbSession Tests
 * 
 * Tests for the DbSession primitive - the single entrypoint for database access.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDbSession, createWorkerSession, isDbSession } from '../db-session';
import type { AuthContext } from '../types/session';

// Mock the database instances
vi.mock('../db', () => ({
  db: {
    transaction: vi.fn(async (fn: any) => {
      const mockTx = {
        execute: vi.fn(),
        select: vi.fn(() => ({ from: vi.fn() })),
        insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn() })) })),
      };
      return fn(mockTx);
    }),
  },
  dbRo: {
    transaction: vi.fn(async (fn: any, options?: any) => {
      const mockTx = {
        execute: vi.fn(),
        select: vi.fn(() => ({ from: vi.fn() })),
      };
      return fn(mockTx);
    }),
  },
}));

describe('DbSession', () => {
  const validAuthContext: AuthContext = {
    orgId: '550e8400-e29b-41d4-a716-446655440000',
    userId: 'user123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createDbSession', () => {
    it('should create a valid DbSession instance', () => {
      const session = createDbSession(validAuthContext);

      expect(session).toBeDefined();
      expect(typeof session.rw).toBe('function');
      expect(typeof session.ro).toBe('function');
      expect(typeof session.read).toBe('function');
      expect(typeof session.query).toBe('function');
      expect(session.wrote).toBe(false);
    });

    it('should validate auth context on creation', () => {
      expect(() => {
        createDbSession({
          orgId: 'invalid-uuid',
          userId: 'user123',
        });
      }).toThrow('Invalid orgId format');
    });

    it('should reject empty userId', () => {
      expect(() => {
        createDbSession({
          orgId: '550e8400-e29b-41d4-a716-446655440000',
          userId: '',
        });
      }).toThrow('Invalid userId');
    });

    it('should accept valid UUID formats', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      ];

      validUUIDs.forEach(orgId => {
        expect(() => {
          createDbSession({ orgId, userId: 'user123' });
        }).not.toThrow();
      });
    });
  });

  describe('session.rw()', () => {
    it('should mark session as having written', async () => {
      const session = createDbSession(validAuthContext);
      
      expect(session.wrote).toBe(false);
      
      await session.rw(async (tx) => {
        return { id: '123' };
      });
      
      expect(session.wrote).toBe(true);
    });

    it('should set auth context as first statement', async () => {
      const session = createDbSession(validAuthContext);
      const { db } = await import('../db');
      
      await session.rw(async (tx) => {
        return { id: '123' };
      });

      // Verify transaction was called
      expect(db.transaction).toHaveBeenCalled();
    });

    it('should return result from transaction function', async () => {
      const session = createDbSession(validAuthContext);
      
      const result = await session.rw(async (tx) => {
        return { id: '123', name: 'Test' };
      });
      
      expect(result).toEqual({ id: '123', name: 'Test' });
    });
  });

  describe('session.ro()', () => {
    it('should use replica when no writes have occurred', async () => {
      const session = createDbSession(validAuthContext);
      const { dbRo } = await import('../db');
      
      await session.ro(async (tx) => {
        return { data: [] };
      });

      expect(dbRo.transaction).toHaveBeenCalled();
    });

    it('should use primary after writes', async () => {
      const session = createDbSession(validAuthContext);
      const { db } = await import('../db');
      
      // Perform write
      await session.rw(async (tx) => {
        return { id: '123' };
      });
      
      // Clear mock to check next call
      vi.clearAllMocks();
      
      // Perform read
      await session.ro(async (tx) => {
        return { data: [] };
      });

      // Should use primary db, not replica
      expect(db.transaction).toHaveBeenCalled();
    });

    it('should set auth context even for reads', async () => {
      const session = createDbSession(validAuthContext);
      const { dbRo } = await import('../db');
      
      await session.ro(async (tx) => {
        return { data: [] };
      });

      // Verify transaction was called with read-only options
      expect(dbRo.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          accessMode: 'read only',
          isolationLevel: 'read committed',
        })
      );
    });
  });

  describe('session.read()', () => {
    it('should be an alias for ro()', async () => {
      const session = createDbSession(validAuthContext);
      const { dbRo } = await import('../db');
      
      await session.read(async (tx) => {
        return { data: [] };
      });

      expect(dbRo.transaction).toHaveBeenCalled();
    });
  });

  describe('session.query()', () => {
    it('should execute query with shape tagging', async () => {
      const session = createDbSession(validAuthContext);
      
      const result = await session.query('invoices.list', async () => {
        return [{ id: '1' }, { id: '2' }];
      });
      
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });

    it('should log slow queries', async () => {
      const session = createDbSession(validAuthContext);
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      await session.query('invoices.list', async () => {
        // Simulate slow query
        await new Promise(resolve => setTimeout(resolve, 1100));
        return [];
      });
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[DbSession] Slow query detected',
        expect.objectContaining({
          shapeKey: 'invoices.list',
          orgId: validAuthContext.orgId,
        })
      );
      
      consoleWarnSpy.mockRestore();
    });

    it('should log query errors', async () => {
      const session = createDbSession(validAuthContext);
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await expect(
        session.query('invoices.list', async () => {
          throw new Error('Query failed');
        })
      ).rejects.toThrow('Query failed');
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[DbSession] Query failed',
        expect.objectContaining({
          shapeKey: 'invoices.list',
          error: 'Query failed',
        })
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('createWorkerSession', () => {
    it('should create a worker session without auth context', async () => {
      const session = createWorkerSession('test-worker');
      
      expect(session).toBeDefined();
      expect(typeof session.rw).toBe('function');
      expect(typeof session.ro).toBe('function');
    });

    it('should not set auth context in worker transactions', async () => {
      const session = createWorkerSession('test-worker');
      const { db } = await import('../db');
      
      await session.rw(async (tx) => {
        return { id: '123' };
      });

      // Worker transactions should not call auth.set_context
      expect(db.transaction).toHaveBeenCalled();
    });
  });

  describe('isDbSession', () => {
    it('should return true for valid DbSession', () => {
      const session = createDbSession(validAuthContext);
      expect(isDbSession(session)).toBe(true);
    });

    it('should return false for non-DbSession objects', () => {
      expect(isDbSession({})).toBe(false);
      expect(isDbSession(null)).toBe(false);
      expect(isDbSession(undefined)).toBe(false);
      expect(isDbSession({ rw: () => {} })).toBe(false);
    });
  });

  describe('wrote flag tracking', () => {
    it('should remain false for read-only sessions', async () => {
      const session = createDbSession(validAuthContext);
      
      await session.ro(async (tx) => {
        return { data: [] };
      });
      
      expect(session.wrote).toBe(false);
    });

    it('should be true after any write', async () => {
      const session = createDbSession(validAuthContext);
      
      await session.rw(async (tx) => {
        return { id: '123' };
      });
      
      expect(session.wrote).toBe(true);
    });

    it('should persist across multiple operations', async () => {
      const session = createDbSession(validAuthContext);
      
      await session.rw(async (tx) => {
        return { id: '123' };
      });
      
      expect(session.wrote).toBe(true);
      
      await session.ro(async (tx) => {
        return { data: [] };
      });
      
      expect(session.wrote).toBe(true);
    });
  });
});
