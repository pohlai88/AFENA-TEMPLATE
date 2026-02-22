import { BasePage } from './BasePage';

import type { Locator, Page } from '@playwright/test';

export interface ContactFormData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export class ContactsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/org/default/contacts');
    await this.waitForLoad();
  }

  async clickCreateContact(): Promise<void> {
    await this.page.getByRole('link', { name: /new contact/i }).click();
    await this.waitForLoad();
  }

  async fillContactForm(data: ContactFormData): Promise<void> {
    await this.page.getByLabel(/name/i).fill(data.name);
    if (data.email) {
      await this.page.getByLabel(/email/i).fill(data.email);
    }
    if (data.phone) {
      await this.page.getByLabel(/phone/i).fill(data.phone);
    }
    if (data.company) {
      await this.page.getByLabel(/company/i).fill(data.company);
    }
    if (data.notes) {
      await this.page.getByLabel(/notes/i).fill(data.notes);
    }
  }

  async saveContact(): Promise<void> {
    await this.page.getByRole('button', { name: /save/i }).click();
  }

  async createContact(data: ContactFormData): Promise<void> {
    await this.clickCreateContact();
    await this.fillContactForm(data);
    await this.saveContact();
  }

  getContactRow(name: string): Locator {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  getContactLink(name: string): Locator {
    return this.page.getByRole('link', { name });
  }

  async editContact(name: string): Promise<void> {
    await this.getContactRow(name)
      .getByRole('button', { name: /edit/i })
      .click();
    await this.waitForLoad();
  }

  async deleteContact(name: string): Promise<void> {
    await this.getContactRow(name)
      .getByRole('button', { name: /delete|remove/i })
      .click();
  }

  async confirmDelete(): Promise<void> {
    await this.page
      .getByRole('alertdialog')
      .getByRole('button', { name: /confirm|delete|yes/i })
      .click();
  }

  async searchContacts(query: string): Promise<void> {
    await this.page.getByPlaceholder(/search/i).fill(query);
  }

  getEmptyState(): Locator {
    return this.page.getByText(/no contacts/i);
  }

  getTable(): Locator {
    return this.page.getByRole('table');
  }
}
