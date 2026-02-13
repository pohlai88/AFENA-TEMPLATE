import { describe, expect, it } from 'vitest';

import {
  canonicalJsonHash,
  canonicalJsonSerialize,
  computeEventIdempotencyKey,
  computeJoinIdempotencyKey,
  computeSideEffectIdempotencyKey,
  computeStepIdempotencyKey,
} from '../canonical-json';

describe('canonicalJsonSerialize', () => {
  it('sorts object keys lexicographically', () => {
    const a = canonicalJsonSerialize({ b: 1, a: 2 });
    const b = canonicalJsonSerialize({ a: 2, b: 1 });
    expect(a).toBe(b);
    expect(a).toBe('{"a":2,"b":1}');
  });

  it('sorts nested object keys', () => {
    const result = canonicalJsonSerialize({ z: { b: 1, a: 2 }, a: 3 });
    expect(result).toBe('{"a":3,"z":{"a":2,"b":1}}');
  });

  it('preserves array order', () => {
    expect(canonicalJsonSerialize([3, 1, 2])).toBe('[3,1,2]');
  });

  it('handles null', () => {
    expect(canonicalJsonSerialize(null)).toBe('null');
  });

  it('handles undefined as null', () => {
    expect(canonicalJsonSerialize(undefined)).toBe('null');
  });

  it('handles booleans', () => {
    expect(canonicalJsonSerialize(true)).toBe('true');
    expect(canonicalJsonSerialize(false)).toBe('false');
  });

  it('handles strings with escaping', () => {
    expect(canonicalJsonSerialize('hello "world"')).toBe('"hello \\"world\\""');
  });

  it('handles numbers', () => {
    expect(canonicalJsonSerialize(42)).toBe('42');
    expect(canonicalJsonSerialize(0)).toBe('0');
    expect(canonicalJsonSerialize(-1)).toBe('-1');
  });

  it('rejects non-finite numbers', () => {
    expect(() => canonicalJsonSerialize(Infinity)).toThrow('non-finite');
    expect(() => canonicalJsonSerialize(NaN)).toThrow('non-finite');
    expect(() => canonicalJsonSerialize(-Infinity)).toThrow('non-finite');
  });

  it('handles empty objects and arrays', () => {
    expect(canonicalJsonSerialize({})).toBe('{}');
    expect(canonicalJsonSerialize([])).toBe('[]');
  });

  it('handles deeply nested structures', () => {
    const deep = { a: { b: { c: { d: 1 } } } };
    expect(canonicalJsonSerialize(deep)).toBe('{"a":{"b":{"c":{"d":1}}}}');
  });
});

describe('canonicalJsonHash (WF-12: deterministic compile)', () => {
  it('produces identical hashes for key-reordered objects', () => {
    const hash1 = canonicalJsonHash({ b: 1, a: 2, c: 3 });
    const hash2 = canonicalJsonHash({ a: 2, c: 3, b: 1 });
    expect(hash1).toBe(hash2);
  });

  it('produces different hashes for different values', () => {
    const hash1 = canonicalJsonHash({ a: 1 });
    const hash2 = canonicalJsonHash({ a: 2 });
    expect(hash1).not.toBe(hash2);
  });

  it('produces 64-char hex string (SHA-256)', () => {
    const hash = canonicalJsonHash({ test: true });
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('is deterministic across multiple calls', () => {
    const input = { nodes: ['a', 'b'], edges: { x: 1, y: 2 } };
    const hashes = Array.from({ length: 10 }, () => canonicalJsonHash(input));
    expect(new Set(hashes).size).toBe(1);
  });
});

describe('computeStepIdempotencyKey (WF-02)', () => {
  it('produces deterministic key', () => {
    const key1 = computeStepIdempotencyKey('inst-1', 'node-a', 'token-1', 5);
    const key2 = computeStepIdempotencyKey('inst-1', 'node-a', 'token-1', 5);
    expect(key1).toBe(key2);
  });

  it('differs when any input changes', () => {
    const base = computeStepIdempotencyKey('inst-1', 'node-a', 'token-1', 5);
    expect(computeStepIdempotencyKey('inst-2', 'node-a', 'token-1', 5)).not.toBe(base);
    expect(computeStepIdempotencyKey('inst-1', 'node-b', 'token-1', 5)).not.toBe(base);
    expect(computeStepIdempotencyKey('inst-1', 'node-a', 'token-2', 5)).not.toBe(base);
    expect(computeStepIdempotencyKey('inst-1', 'node-a', 'token-1', 6)).not.toBe(base);
  });
});

describe('computeEventIdempotencyKey (WF-11)', () => {
  it('produces deterministic key', () => {
    const key1 = computeEventIdempotencyKey('inst-1', 'entity_created', { id: '123' }, 1);
    const key2 = computeEventIdempotencyKey('inst-1', 'entity_created', { id: '123' }, 1);
    expect(key1).toBe(key2);
  });

  it('differs when payload changes', () => {
    const key1 = computeEventIdempotencyKey('inst-1', 'entity_created', { id: '123' }, 1);
    const key2 = computeEventIdempotencyKey('inst-1', 'entity_created', { id: '456' }, 1);
    expect(key1).not.toBe(key2);
  });
});

describe('computeSideEffectIdempotencyKey (WF-11)', () => {
  it('produces deterministic key', () => {
    const key1 = computeSideEffectIdempotencyKey('step-1', 'webhook', { url: 'http://x' });
    const key2 = computeSideEffectIdempotencyKey('step-1', 'webhook', { url: 'http://x' });
    expect(key1).toBe(key2);
  });
});

describe('computeJoinIdempotencyKey (WF-16)', () => {
  it('produces deterministic key', () => {
    const key1 = computeJoinIdempotencyKey('inst-1', 'join-node', 5, 0);
    const key2 = computeJoinIdempotencyKey('inst-1', 'join-node', 5, 0);
    expect(key1).toBe(key2);
  });

  it('differs across join epochs', () => {
    const key1 = computeJoinIdempotencyKey('inst-1', 'join-node', 5, 0);
    const key2 = computeJoinIdempotencyKey('inst-1', 'join-node', 5, 1);
    expect(key1).not.toBe(key2);
  });
});
