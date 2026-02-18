import { vi } from 'vitest';

// Mock @afenda/logger
vi.mock('@afenda/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));
