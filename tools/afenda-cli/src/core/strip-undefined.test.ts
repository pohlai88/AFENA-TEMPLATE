import { describe, it, expect } from 'vitest';
import { stripUndefined } from './strip-undefined';

describe('stripUndefined', () => {
  it('removes undefined values', () => {
    const input = { a: 1, b: undefined, c: 3 };
    expect(stripUndefined(input)).toEqual({ a: 1, c: 3 });
  });

  it('keeps null and false', () => {
    const input = { a: null, b: false, c: undefined };
    expect(stripUndefined(input)).toEqual({ a: null, b: false });
  });

  it('returns empty object when all values are undefined', () => {
    expect(stripUndefined({ x: undefined, y: undefined })).toEqual({});
  });

  it('returns copy with no undefined keys when all defined', () => {
    const input = { a: 1, b: 'x' };
    const out = stripUndefined(input);
    expect(out).toEqual(input);
    expect(out).not.toBe(input);
  });
});
