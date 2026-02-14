import { test as setup } from '@playwright/test';

import { getTestUser } from '../fixtures/auth';

const authFile = 'test-results/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const user = getTestUser();

  await page.goto('/auth/sign-in');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.locator('button[type="submit"]').click();

  await page.waitForURL('**/org/**');

  await page.context().storageState({ path: authFile });
});
