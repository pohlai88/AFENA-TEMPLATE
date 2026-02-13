import { expect, test } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Afena/i);
  });

  test('auth page is accessible', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('unauthenticated user is redirected to sign-in', async ({ page }) => {
    await page.goto('/org/default/contacts');
    await expect(page).toHaveURL(/auth\/sign-in/);
  });
});
