import { describe, expect, it } from 'vitest';
import { DOMAIN_INTENT_REGISTRY } from '../domain-intent-registry';
import { DOMAIN_PACKAGE_COUNT } from '../domain-taxonomy';
import { SHARED_KERNEL_REGISTRY } from '../shared-kernel-registry';

import type { DomainIntent } from '../../types/domain-intent';

type IntentType = DomainIntent['type'];

describe('DOMAIN_INTENT_REGISTRY invariants', () => {
  const intentTypes = Object.keys(DOMAIN_INTENT_REGISTRY) as IntentType[];

  it('every intent type has a non-empty owner', () => {
    for (const key of intentTypes) {
      expect(DOMAIN_INTENT_REGISTRY[key].owner).toBeTruthy();
    }
  });

  it('every intent type has a non-empty tableTarget', () => {
    for (const key of intentTypes) {
      expect(DOMAIN_INTENT_REGISTRY[key].tableTarget).toBeTruthy();
    }
  });

  it('every intent type has an idempotency recipe', () => {
    for (const key of intentTypes) {
      const { idempotency } = DOMAIN_INTENT_REGISTRY[key];
      expect(idempotency.recipe).toBeTruthy();
      expect(idempotency.scope).toMatch(/^(org|company|document)$/);
      expect(idempotency.policy).toMatch(/^(required|optional|forbidden)$/);
    }
  });

  it('every intent tableTarget exists in SHARED_KERNEL_REGISTRY', () => {
    const skKeys = Object.keys(SHARED_KERNEL_REGISTRY);
    for (const key of intentTypes) {
      expect(skKeys).toContain(DOMAIN_INTENT_REGISTRY[key].tableTarget);
    }
  });

  it('intent type format is {domain}.{verb} or {domain}.{noun}.{verb}', () => {
    for (const key of intentTypes) {
      expect(key).toMatch(/^[a-z]+(-[a-z]+)*\.[a-z]+(\.[a-z]+)?$/);
    }
  });
});

describe('SHARED_KERNEL_REGISTRY invariants', () => {
  const entries = Object.entries(SHARED_KERNEL_REGISTRY);

  it('every entry has rls = tenantPolicy', () => {
    for (const [, entry] of entries) {
      expect(entry.rls).toBe('tenantPolicy');
    }
  });

  it('every entry has at least one invariant', () => {
    for (const [key, entry] of entries) {
      expect(entry.invariants.length, `${key} has no invariants`).toBeGreaterThan(0);
    }
  });

  it('every entry has at least one reader', () => {
    for (const [key, entry] of entries) {
      expect(entry.readers.length, `${key} has no readers`).toBeGreaterThan(0);
    }
  });

  it('every writes[] entry exists in DOMAIN_INTENT_REGISTRY', () => {
    const intentKeys = Object.keys(DOMAIN_INTENT_REGISTRY);
    for (const [key, entry] of entries) {
      for (const w of entry.writes) {
        expect(intentKeys, `${key}.writes contains unknown intent: ${w}`).toContain(w);
      }
    }
  });

  it('cross-reference: intent.tableTarget matches SK entry key', () => {
    for (const [skKey, entry] of entries) {
      for (const w of entry.writes) {
        const intent = DOMAIN_INTENT_REGISTRY[w as IntentType];
        expect(
          intent.tableTarget,
          `${w} targets ${intent.tableTarget} but is in writes[] of ${skKey}`,
        ).toBe(skKey);
      }
    }
  });

  it('every entry has write_policy set', () => {
    for (const [, entry] of entries) {
      expect(entry.write_policy).toMatch(/^(intent-only|direct)$/);
    }
  });

  it('truth tables require intent-only write_policy', () => {
    for (const [key, entry] of entries) {
      if (entry.kind === 'truth') {
        expect(entry.write_policy, `${key} is truth but not intent-only`).toBe('intent-only');
      }
    }
  });
});

describe('DOMAIN_PACKAGE_COUNT', () => {
  it('is a positive integer', () => {
    expect(Number.isInteger(DOMAIN_PACKAGE_COUNT)).toBe(true);
    expect(DOMAIN_PACKAGE_COUNT).toBeGreaterThan(0);
  });

  it('equals 37 (all finance packages)', () => {
    expect(DOMAIN_PACKAGE_COUNT).toBe(37);
  });
});
