import { vi } from 'vitest';

// Mock afena-database to prevent DATABASE_URL requirement in unit tests.
// The barrel import chain (index → db-loader / engine → afena-database → db.ts)
// eagerly connects and throws if DATABASE_URL is not set.
const chainable = () => {
  const chain: Record<string, unknown> = {};
  const proxy = new Proxy(chain, {
    get: (_target, prop) => {
      if (prop === 'then') return undefined; // prevent Promise detection
      return vi.fn().mockReturnValue(proxy);
    },
  });
  return proxy;
};

vi.mock('afena-database', () => ({
  db: chainable(),
  eq: vi.fn(),
  and: vi.fn(),
  sql: vi.fn(),
  workflowRules: {},
  workflowExecutions: {},
  workflowDefinitions: {},
  workflowInstances: {},
  workflowStepExecutions: {},
  workflowEventsOutbox: {},
  workflowSideEffectsOutbox: {},
  workflowStepReceipts: {},
  workflowOutboxReceipts: {},
}));
