import { vi } from 'vitest';

/**
 * Shared mock for `afena-database` — prevents DATABASE_URL requirement in unit tests.
 *
 * Many packages import from `afena-database` via barrel exports, which eagerly
 * evaluates `db.ts` and throws if DATABASE_URL is not set. This setup file
 * intercepts the import with a chainable Proxy so any `db.method().chain()` works.
 *
 * Used automatically by the unit preset (`afena-vitest-config/presets/unit`).
 */
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
  dbRo: chainable(),
  eq: vi.fn(),
  and: vi.fn(),
  or: vi.fn(),
  sql: vi.fn(),
  not: vi.fn(),
  asc: vi.fn(),
  desc: vi.fn(),
  inArray: vi.fn(),
  isNull: vi.fn(),
  isNotNull: vi.fn(),
  // Schema tables — empty objects satisfy type-level imports
  workflowRules: {},
  workflowExecutions: {},
  workflowDefinitions: {},
  workflowInstances: {},
  workflowStepExecutions: {},
  workflowEventsOutbox: {},
  workflowSideEffectsOutbox: {},
  workflowStepReceipts: {},
  workflowOutboxReceipts: {},
  contacts: {},
  companies: {},
  auditLogs: {},
  entityVersions: {},
  mutationBatches: {},
  customFields: {},
  customFieldValues: {},
  savedViews: {},
  searchIndex: {},
  advisoryLockLog: {},
}));
