import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './apps/web/e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),

  reporter: process.env.CI
    ? [
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
      ['junit', { outputFile: 'test-results/e2e-junit.xml' }],
    ]
    : [['html', { outputFolder: 'playwright-report', open: 'on-failure' }]],

  outputDir: 'test-results/e2e-artifacts',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    /* ── Auth setup (runs once, shared across projects) ── */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    /* ── Desktop browsers ── */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    /* ── Mobile viewports ── */
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      dependencies: ['setup'],
    },

    /* ── API-only tests (no browser) ── */
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm --filter web dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
