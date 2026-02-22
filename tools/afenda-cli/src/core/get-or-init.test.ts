import { describe, it, expect } from 'vitest';
import { getOrInit } from './get-or-init';

describe('getOrInit', () => {
  it('returns existing array when key exists', () => {
    const map = new Map<string, number[]>();
    const arr = [1, 2];
    map.set('foo', arr);
    expect(getOrInit(map, 'foo')).toBe(arr);
    expect(getOrInit(map, 'foo')).toEqual([1, 2]);
  });

  it('creates and returns new array when key does not exist', () => {
    const map = new Map<string, number[]>();
    const result = getOrInit(map, 'bar');
    expect(result).toEqual([]);
    expect(map.get('bar')).toBe(result);
  });

  it('mutations affect the stored array', () => {
    const map = new Map<string, string[]>();
    const arr = getOrInit(map, 'x');
    arr.push('a');
    expect(getOrInit(map, 'x')).toEqual(['a']);
  });
});
