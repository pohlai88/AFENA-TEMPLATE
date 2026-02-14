import { expect, test } from '@playwright/test';

import { getTestUser } from '../../fixtures';
import { AuthPage } from '../../page-objects';

test.describe('Authentication — Login', () => {
  test('should display the sign-in form', async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.goto();

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should reject invalid credentials', async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.goto();

    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrong-password');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    const authPage = new AuthPage(page);
    const user = getTestUser();

    await authPage.goto();
    await authPage.login(user.email, user.password);

    await expect(page).toHaveURL(/\/org\//);
  });

  test('should navigate to sign-up page', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await page.getByRole('link', { name: /sign up/i }).click();

    await expect(page).toHaveURL(/\/auth\/sign-up/);
  });
});
