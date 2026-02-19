import { describe, expect, it } from 'vitest';
import {
  BudgetExceededError,
  CpuBudgetTracker,
  DEFAULT_BUDGETS,
  withBudget,
} from '../cpu-budget';

describe('CPU Budget System', () => {
  describe('BudgetExceededError', () => {
    it('should create error with correct properties', () => {
      const error = new BudgetExceededError('iterations', 1000, 1500, 'testOp');

      expect(error.name).toBe('BudgetExceededError');
      expect(error.budgetType).toBe('iterations');
      expect(error.limit).toBe(1000);
      expect(error.actual).toBe(1500);
      expect(error.operationName).toBe('testOp');
      expect(error.message).toContain('iterations limit of 1000 exceeded');
      expect(error.message).toContain('actual: 1500');
    });

    it('should be instanceof Error', () => {
      const error = new BudgetExceededError('time', 100, 150, 'test');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('CpuBudgetTracker', () => {
    describe('Iteration Tracking', () => {
      it('should track iterations correctly', () => {
        const tracker = new CpuBudgetTracker({ maxIterations: 10 });

        for (let i = 0; i < 5; i++) {
          tracker.check();
        }

        expect(tracker.getIterations()).toBe(5);
      });

      it('should throw when iteration limit exceeded', () => {
        const tracker = new CpuBudgetTracker({ maxIterations: 3 });

        tracker.check(); // 1
        tracker.check(); // 2
        tracker.check(); // 3

        expect(() => tracker.check()).toThrow(BudgetExceededError);
      });

      it('should include operation name in error', () => {
        const tracker = new CpuBudgetTracker({
          maxIterations: 1,
          operationName: 'myOperation',
        });

        tracker.check(); // 1

        try {
          tracker.check(); // 2 - exceeds
          expect.fail('Should have thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(BudgetExceededError);
          expect((error as BudgetExceededError).operationName).toBe('myOperation');
        }
      });

      it('should use default operation name', () => {
        const tracker = new CpuBudgetTracker({ maxIterations: 1 });
        tracker.check();

        try {
          tracker.check();
          expect.fail('Should have thrown');
        } catch (error) {
          expect((error as BudgetExceededError).operationName).toBe('operation');
        }
      });
    });

    describe('Time Tracking', () => {
      it('should track elapsed time', async () => {
        const tracker = new CpuBudgetTracker();

        await new Promise((resolve) => setTimeout(resolve, 50));

        const elapsed = tracker.getElapsedMs();
        expect(elapsed).toBeGreaterThanOrEqual(45); // Allow some variance
        expect(elapsed).toBeLessThan(100);
      });

      it('should throw when time limit exceeded', async () => {
        const tracker = new CpuBudgetTracker({ maxTimeMs: 50 });

        await new Promise((resolve) => setTimeout(resolve, 60));

        expect(() => tracker.check()).toThrow(BudgetExceededError);
      });

      it('should not throw before time limit', async () => {
        const tracker = new CpuBudgetTracker({ maxTimeMs: 100 });

        await new Promise((resolve) => setTimeout(resolve, 20));

        expect(() => tracker.check()).not.toThrow();
      });
    });

    describe('Default Budgets', () => {
      it('should use default maxIterations', () => {
        const tracker = new CpuBudgetTracker();
        const stats = tracker.getStats();
        expect(stats.limits.maxIterations).toBe(10000);
      });

      it('should use default maxTimeMs', () => {
        const tracker = new CpuBudgetTracker();
        const stats = tracker.getStats();
        expect(stats.limits.maxTimeMs).toBe(5000);
      });

      it('should use default maxMemoryBytes', () => {
        const tracker = new CpuBudgetTracker();
        const stats = tracker.getStats();
        expect(stats.limits.maxMemoryBytes).toBe(100 * 1024 * 1024);
      });
    });

    describe('Custom Budgets', () => {
      it('should accept custom maxIterations', () => {
        const tracker = new CpuBudgetTracker({ maxIterations: 500 });
        const stats = tracker.getStats();
        expect(stats.limits.maxIterations).toBe(500);
      });

      it('should accept custom maxTimeMs', () => {
        const tracker = new CpuBudgetTracker({ maxTimeMs: 1000 });
        const stats = tracker.getStats();
        expect(stats.limits.maxTimeMs).toBe(1000);
      });

      it('should accept custom maxMemoryBytes', () => {
        const tracker = new CpuBudgetTracker({ maxMemoryBytes: 50 * 1024 * 1024 });
        const stats = tracker.getStats();
        expect(stats.limits.maxMemoryBytes).toBe(50 * 1024 * 1024);
      });
    });

    describe('Statistics', () => {
      it('should return correct stats', () => {
        const tracker = new CpuBudgetTracker({
          maxIterations: 100,
          maxTimeMs: 1000,
        });

        tracker.check();
        tracker.check();

        const stats = tracker.getStats();

        expect(stats.iterations).toBe(2);
        expect(stats.elapsedMs).toBeGreaterThanOrEqual(0);
        expect(stats.limits.maxIterations).toBe(100);
        expect(stats.limits.maxTimeMs).toBe(1000);
      });

      it('should track memory usage', () => {
        const tracker = new CpuBudgetTracker();
        const stats = tracker.getStats();

        expect(stats.memoryBytes).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('withBudget', () => {
    it('should execute function with budget', () => {
      const result = withBudget((tracker) => {
        tracker.check();
        return 42;
      });

      expect(result).toBe(42);
    });

    it('should pass tracker to function', () => {
      withBudget((tracker) => {
        expect(tracker).toBeInstanceOf(CpuBudgetTracker);
        expect(tracker.getIterations()).toBe(0);
      });
    });

    it('should enforce budget limits', () => {
      expect(() => {
        withBudget(
          (tracker) => {
            for (let i = 0; i < 100; i++) {
              tracker.check();
            }
          },
          { maxIterations: 50 }
        );
      }).toThrow(BudgetExceededError);
    });

    it('should use default budget if not provided', () => {
      const result = withBudget((tracker) => {
        const stats = tracker.getStats();
        expect(stats.limits.maxIterations).toBe(10000);
        return true;
      });

      expect(result).toBe(true);
    });

    it('should propagate function errors', () => {
      expect(() => {
        withBudget(() => {
          throw new Error('Test error');
        });
      }).toThrow('Test error');
    });

    it('should allow tracker usage in loops', () => {
      const result = withBudget(
        (tracker) => {
          let sum = 0;
          for (let i = 0; i < 10; i++) {
            tracker.check();
            sum += i;
          }
          return sum;
        },
        { maxIterations: 20 }
      );

      expect(result).toBe(45); // 0+1+2+...+9
    });
  });

  describe('DEFAULT_BUDGETS', () => {
    it('should have fast preset', () => {
      expect(DEFAULT_BUDGETS.fast).toEqual({
        maxIterations: 1000,
        maxTimeMs: 100,
        maxMemoryBytes: 10 * 1024 * 1024,
      });
    });

    it('should have normal preset', () => {
      expect(DEFAULT_BUDGETS.normal).toEqual({
        maxIterations: 10000,
        maxTimeMs: 1000,
        maxMemoryBytes: 50 * 1024 * 1024,
      });
    });

    it('should have slow preset', () => {
      expect(DEFAULT_BUDGETS.slow).toEqual({
        maxIterations: 50000,
        maxTimeMs: 5000,
        maxMemoryBytes: 100 * 1024 * 1024,
      });
    });

    it('should have batch preset', () => {
      expect(DEFAULT_BUDGETS.batch).toEqual({
        maxIterations: 100000,
        maxTimeMs: 30000,
        maxMemoryBytes: 500 * 1024 * 1024,
      });
    });
  });

  describe('Real-world Scenarios', () => {
    it('should protect against infinite loops', () => {
      expect(() => {
        withBudget(
          (tracker) => {
            while (true) {
              tracker.check();
            }
          },
          { maxIterations: 100 }
        );
      }).toThrow(BudgetExceededError);
    });

    it('should protect against slow operations', async () => {
      expect(() => {
        withBudget(
          (tracker) => {
            const start = Date.now();
            while (Date.now() - start < 150) {
              // Busy wait
            }
            tracker.check();
          },
          { maxTimeMs: 100 }
        );
      }).toThrow(BudgetExceededError);
    });

    it('should allow normal operations to complete', () => {
      const result = withBudget(
        (tracker) => {
          const items = Array.from({ length: 100 }, (_, i) => i);
          let sum = 0;
          for (const item of items) {
            tracker.check();
            sum += item;
          }
          return sum;
        },
        { maxIterations: 200 }
      );

      expect(result).toBe(4950); // Sum of 0..99
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero iterations limit', () => {
      const tracker = new CpuBudgetTracker({ maxIterations: 0 });
      expect(() => tracker.check()).toThrow(BudgetExceededError);
    });

    it('should handle very large iteration limit', () => {
      const tracker = new CpuBudgetTracker({ maxIterations: 1000000 });

      for (let i = 0; i < 100; i++) {
        tracker.check();
      }

      expect(tracker.getIterations()).toBe(100);
    });

    it('should handle immediate time limit', () => {
      const tracker = new CpuBudgetTracker({ maxTimeMs: 0 });
      expect(() => tracker.check()).toThrow(BudgetExceededError);
    });
  });
});
