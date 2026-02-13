import { describe, it, expect } from 'vitest';

import { ENTITY_TYPES, ACTION_TYPES } from 'afena-canon';

describe('Companies entity registration', () => {
  it('companies is in ENTITY_TYPES', () => {
    expect(ENTITY_TYPES).toContain('companies');
  });

  it('companies.create is in ACTION_TYPES', () => {
    expect(ACTION_TYPES).toContain('companies.create');
  });

  it('companies.update is in ACTION_TYPES', () => {
    expect(ACTION_TYPES).toContain('companies.update');
  });

  it('companies.delete is in ACTION_TYPES', () => {
    expect(ACTION_TYPES).toContain('companies.delete');
  });

  it('companies.restore is in ACTION_TYPES', () => {
    expect(ACTION_TYPES).toContain('companies.restore');
  });
});
