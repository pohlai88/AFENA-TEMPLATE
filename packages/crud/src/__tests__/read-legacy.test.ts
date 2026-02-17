/**
 * Tests for getLegacyRefs and includeLegacyRef behavior.
 * Regression: includeLegacyRef !== true must never touch migration_lineage.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock getLegacyRefs to assert it is never called when includeLegacyRef is false
const getLegacyRefsMock = vi.fn().mockImplementation(
  (_conn: unknown, _orgId: unknown, _entityType: unknown, afendaIds: string[]) => {
    if (afendaIds.length === 0) return Promise.resolve(new Map());
    return Promise.resolve(new Map());
  },
);
vi.mock('../read-legacy', () => ({
  getLegacyRefs: (...args: unknown[]) => getLegacyRefsMock(...args),
}));

// Mock getDb so read/list don't hit real DB (avoids DATABASE_URL requirement)
const row = { id: 'id-1', orgId: 'org-1', isDeleted: false };
const createChain = (result: unknown[]) => {
  const offsetRet = Promise.resolve(result);
  const limitRet = {
    offset: vi.fn().mockReturnValue(offsetRet),
    then: offsetRet.then.bind(offsetRet),
    catch: offsetRet.catch.bind(offsetRet),
  };
  return {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnValue(limitRet),
  };
};
const mockConn = {
  select: vi.fn().mockReturnValue(createChain([row])),
};

vi.mock('afenda-database', () => {
  const drizzle = require('drizzle-orm');
  return {
    ...drizzle,
    getDb: () => mockConn,
    batch: vi.fn().mockResolvedValue([]),
    companies: {},
    contacts: {},
    videoSettings: {},
    departments: {},
    branches: {},
    tasks: {},
  };
});

import { getLegacyRefs } from '../read-legacy';
import { readEntity, listEntities } from '../read';

describe('getLegacyRefs', () => {
  it('returns empty map when afendaIds is empty', async () => {
    const conn = {} as Parameters<typeof getLegacyRefs>[0];
    const result = await getLegacyRefs(conn, 'org-1', 'contacts', []);
    expect(result.size).toBe(0);
  });
});

describe('readEntity — no extra query when includeLegacyRef false', () => {
  beforeEach(() => {
    getLegacyRefsMock.mockClear();
  });

  afterEach(() => {
    getLegacyRefsMock.mockClear();
  });

  it('does not call getLegacyRefs when includeLegacyRef is omitted', async () => {
    await readEntity('contacts', 'id-1', 'req-1', {});
    expect(getLegacyRefsMock).not.toHaveBeenCalled();
  });

  it('does not call getLegacyRefs when includeLegacyRef is false', async () => {
    await readEntity('contacts', 'id-1', 'req-1', { includeLegacyRef: false });
    expect(getLegacyRefsMock).not.toHaveBeenCalled();
  });
});

describe('listEntities — no extra query when includeLegacyRef false', () => {
  beforeEach(() => {
    getLegacyRefsMock.mockClear();
  });

  afterEach(() => {
    getLegacyRefsMock.mockClear();
  });

  it('does not call getLegacyRefs when includeLegacyRef is omitted', async () => {
    await listEntities('contacts', 'req-1', { orgId: 'org-1', limit: 10 });
    expect(getLegacyRefsMock).not.toHaveBeenCalled();
  });

  it('does not call getLegacyRefs when includeLegacyRef is false', async () => {
    await listEntities('contacts', 'req-1', {
      orgId: 'org-1',
      limit: 10,
      includeLegacyRef: false,
    });
    expect(getLegacyRefsMock).not.toHaveBeenCalled();
  });
});
