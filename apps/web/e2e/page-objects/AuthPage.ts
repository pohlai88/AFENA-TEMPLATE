import { BasePage } from './BasePage';

import type { Page } from '@playwright/test';

export class AuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/sign-in');
    await this.waitForLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.locator('button[type="submit"]').click();
    await this.page.waitForURL('**/org/**');
  }

  async loginWithTestUser(): Promise<void> {
    const email = process.env.E2E_TEST_USER_EMAIL ?? 'test@example.com';
    const password = process.env.E2E_TEST_USER_PASSWORD ?? 'test-password-123';
    await this.login(email, password);
  }

  async logout(): Promise<void> {
    await this.page.goto('/auth/sign-out');
    await this.page.waitForURL('**/auth/sign-in');
  }

  async gotoSignUp(): Promise<void> {
    await this.page.goto('/auth/sign-up');
    await this.waitForLoad();
  }

  async signUp(name: string, email: string, password: string): Promise<void> {
    await this.page.getByLabel('Name').fill(name);
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: /sign up/i }).click();
  }
}
