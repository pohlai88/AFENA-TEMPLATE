import { BasePage } from './BasePage';

import type { Locator, Page } from '@playwright/test';

export class Navigation extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  getSidebar(): Locator {
    return this.page.locator('[data-slot="sidebar"]');
  }

  getSidebarTrigger(): Locator {
    return this.page.locator('[data-slot="sidebar-trigger"]');
  }

  async navigateTo(label: string): Promise<void> {
    await this.getSidebar()
      .getByRole('link', { name: label })
      .click();
    await this.waitForLoad();
  }

  async navigateToContacts(): Promise<void> {
    await this.navigateTo('Contacts');
  }

  async navigateToCompanies(): Promise<void> {
    await this.navigateTo('Companies');
  }

  async navigateToWorkflows(): Promise<void> {
    await this.navigateTo('Workflows');
  }

  async navigateToSettings(): Promise<void> {
    await this.navigateTo('Settings');
  }

  async openCommandPalette(): Promise<void> {
    await this.page.keyboard.press('Control+k');
  }

  async searchCommandPalette(query: string): Promise<void> {
    await this.openCommandPalette();
    await this.page.getByPlaceholder(/search/i).fill(query);
  }
}
