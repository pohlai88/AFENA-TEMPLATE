import { describe, expect, test } from 'vitest';

/**
 * G-DOM-01 — DOMAIN_PACKAGE_COUNT Canon Invariant
 *
 * Enforces SK-03: the declared DOMAIN_PACKAGE_COUNT in afenda-canon must
 * match the actual number of leaf packages under business-domain/.
 *
 * Update EXPECTED_COUNT when adding new domain packages.
 */

const EXPECTED_COUNT = 38;

describe('G-DOM-01: DOMAIN_PACKAGE_COUNT invariant', () => {
  test(`DOMAIN_PACKAGE_COUNT equals ${EXPECTED_COUNT}`, async () => {
    const { DOMAIN_PACKAGE_COUNT } =
      await import('../../packages/canon/src/registries/domain-taxonomy');
    expect(DOMAIN_PACKAGE_COUNT).toBe(EXPECTED_COUNT);
  });

  test('DOMAIN_PACKAGE_COUNT is a positive integer', async () => {
    const { DOMAIN_PACKAGE_COUNT } =
      await import('../../packages/canon/src/registries/domain-taxonomy');
    expect(Number.isInteger(DOMAIN_PACKAGE_COUNT)).toBe(true);
    expect(DOMAIN_PACKAGE_COUNT).toBeGreaterThan(0);
  });
});
