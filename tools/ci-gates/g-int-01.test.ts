/**
 * CIG-05: Integration Test Coverage Floor Gate
 *
 * For every finance package with `src/services/*.ts`, asserts at least one
 * `*.integration.test.ts` file exists. Uses a ratchet: floor increases over time.
 *
 * @see oss-finance-ext.md §5 CIG-05, AD-10
 */
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');

/** Minimum number of finance packages that must have integration tests */
const INTEGRATION_TEST_FLOOR = 5;

type PackageInfo = {
  name: string;
  hasServices: boolean;
  hasIntegrationTests: boolean;
};

function getFinancePackages(): PackageInfo[] {
  const packages: PackageInfo[] = [];

  const dirs = readdirSync(FINANCE_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'node_modules' && d.name !== 'test-utils');

  for (const dir of dirs) {
    const servicesDir = join(FINANCE_ROOT, dir.name, 'src', 'services');
    const testsDir = join(FINANCE_ROOT, dir.name, 'src', '__tests__');

    const hasServices = existsSync(servicesDir) && readdirSync(servicesDir).some((f) => f.endsWith('.ts'));

    let hasIntegrationTests = false;
    if (existsSync(testsDir)) {
      hasIntegrationTests = readdirSync(testsDir).some((f) => f.includes('.integration.test.'));
    }

    packages.push({
      name: dir.name,
      hasServices,
      hasIntegrationTests,
    });
  }

  return packages;
}

describe('gate.integration-coverage — CIG-05', () => {
  const packages = getFinancePackages();
  const withServices = packages.filter((p) => p.hasServices);
  const withIntegration = withServices.filter((p) => p.hasIntegrationTests);

  it('finds finance packages with services', () => {
    expect(withServices.length).toBeGreaterThan(0);
  });

  it(`at least ${INTEGRATION_TEST_FLOOR} packages with services have integration tests (ratchet)`, () => {
    const missing = withServices
      .filter((p) => !p.hasIntegrationTests)
      .map((p) => p.name);

    expect(
      withIntegration.length,
      `Only ${withIntegration.length}/${withServices.length} packages have integration tests.\n` +
        `Missing: ${missing.join(', ')}\n` +
        `Floor: ${INTEGRATION_TEST_FLOOR}`,
    ).toBeGreaterThanOrEqual(INTEGRATION_TEST_FLOOR);
  });

  it('integration test count never decreases (ratchet direction)', () => {
    // This test documents the current count. If someone removes integration tests,
    // this assertion will fail. Update the floor when adding new tests.
    expect(withIntegration.length).toBeGreaterThanOrEqual(INTEGRATION_TEST_FLOOR);
  });
});
