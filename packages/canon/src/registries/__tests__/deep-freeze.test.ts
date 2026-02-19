/**
 * Deep freeze utility tests
 */

import { describe, expect, it } from 'vitest';
import { deepFreeze } from '../utils/deep-freeze';

describe('deepFreeze', () => {
  it('should freeze top-level object', () => {
    const obj = { a: 1, b: 2 };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(() => { (frozen as any).a = 999; }).toThrow();
  });
  
  it('should freeze nested objects', () => {
    const obj = { a: { b: { c: 1 } } };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen.a)).toBe(true);
    expect(Object.isFrozen(frozen.a.b)).toBe(true);
    expect(() => { (frozen.a.b as any).c = 999; }).toThrow();
  });
  
  it('should freeze arrays', () => {
    const obj = { arr: [1, 2, 3] };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen.arr)).toBe(true);
    expect(() => { frozen.arr.push(4); }).toThrow();
  });
  
  it('should freeze nested arrays', () => {
    const obj = { arr: [{ x: 1 }, { y: 2 }] };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen.arr[0])).toBe(true);
    expect(() => { (frozen.arr[0] as any).x = 999; }).toThrow();
  });
  
  it('should handle null values', () => {
    const obj = { a: null, b: undefined };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(frozen.a).toBe(null);
    expect(frozen.b).toBe(undefined);
  });
  
  it('should not freeze already frozen objects', () => {
    const inner = Object.freeze({ x: 1 });
    const obj = { inner };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen.inner)).toBe(true);
  });
  
  it('should return the same object reference', () => {
    const obj = { a: 1 };
    const frozen = deepFreeze(obj);
    
    expect(frozen).toBe(obj);
  });
});
