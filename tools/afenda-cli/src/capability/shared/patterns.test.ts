import { describe, it, expect } from 'vitest';
import {
  hasWriteBoundary,
  hasCapabilityAnnotation,
  WRITE_BOUNDARY_PATTERNS,
  CAPABILITIES_REGEX,
  JSDOC_CAPABILITY_REGEX,
} from './patterns';

describe('hasWriteBoundary', () => {
  it('returns true for mutate()', () => {
    expect(hasWriteBoundary('const x = mutate( db, ...)')).toBe(true);
  });

  it('returns true for db.insert()', () => {
    expect(hasWriteBoundary('db.insert(t)')).toBe(true);
  });

  it('returns true for db.update()', () => {
    expect(hasWriteBoundary('await db.update(...)')).toBe(true);
  });

  it('returns true for db.delete()', () => {
    expect(hasWriteBoundary('db.delete(t)')).toBe(true);
  });

  it('returns true for db.transaction()', () => {
    expect(hasWriteBoundary('db.transaction(async (tx) => {})')).toBe(true);
  });

  it('returns true for tx.*()', () => {
    expect(hasWriteBoundary('tx.insert(t)')).toBe(true);
  });

  it('returns true for .execute()', () => {
    expect(hasWriteBoundary('stmt.execute()')).toBe(true);
  });

  it('returns false when no write boundary present', () => {
    expect(hasWriteBoundary('const x = 1;')).toBe(false);
    expect(hasWriteBoundary('db.select()')).toBe(false);
  });
});

describe('hasCapabilityAnnotation', () => {
  it('returns true for CAPABILITIES export', () => {
    const content = `export const CAPABILITIES = ['contacts.create'] as const`;
    expect(hasCapabilityAnnotation(content)).toBe(true);
  });

  it('returns true for @capability JSDoc', () => {
    expect(hasCapabilityAnnotation('/** @capability contacts.create */')).toBe(true);
    expect(hasCapabilityAnnotation('@capability system.advisory.detect')).toBe(true);
  });

  it('returns false when neither present', () => {
    expect(hasCapabilityAnnotation('const x = 1')).toBe(false);
  });
});

describe('CAPABILITIES_REGEX', () => {
  it('matches export const CAPABILITIES = [...] as const', () => {
    const m = 'export const CAPABILITIES = [\'a\', \'b\'] as const'.match(CAPABILITIES_REGEX);
    expect(m?.[1]).toBe("'a', 'b'");
  });
});

describe('JSDOC_CAPABILITY_REGEX', () => {
  it('matches @capability key', () => {
    expect('@capability contacts.create'.match(JSDOC_CAPABILITY_REGEX)?.[0]).toBe('@capability contacts.create');
  });
});
