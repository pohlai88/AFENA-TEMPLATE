import type { Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  getToast(): Locator {
    return this.page.locator('[data-sonner-toast]');
  }

  getSuccessToast(): Locator {
    return this.page.locator('[data-sonner-toast][data-type="success"]');
  }

  getErrorToast(): Locator {
    return this.page.locator('[data-sonner-toast][data-type="error"]');
  }

  async clickButton(label: string): Promise<void> {
    await this.page.getByRole('button', { name: label }).click();
  }

  async fillInput(label: string, value: string): Promise<void> {
    await this.page.getByLabel(label).fill(value);
  }

  getBreadcrumb(): Locator {
    return this.page.locator('nav[aria-label="breadcrumb"]');
  }
}
