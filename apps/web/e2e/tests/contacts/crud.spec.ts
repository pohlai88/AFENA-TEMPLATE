import { expect, test } from '@playwright/test';

import { createTestContact } from '../../fixtures';
import { ContactsPage } from '../../page-objects';

test.describe('Contacts — CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    const contactsPage = new ContactsPage(page);
    await contactsPage.goto();
  });

  test('should display the contacts list page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /contacts/i })).toBeVisible();
  });

  test('should navigate to the create contact form', async ({ page }) => {
    const contactsPage = new ContactsPage(page);
    await contactsPage.clickCreateContact();

    await expect(page.getByRole('heading', { name: /new contact/i })).toBeVisible();
  });

  test('should create a new contact', async ({ page }) => {
    const contactsPage = new ContactsPage(page);
    const testContact = createTestContact();

    await contactsPage.createContact(testContact);

    await expect(contactsPage.getSuccessToast()).toBeVisible();
  });

  test('should view contact details', async ({ page }) => {
    const contactsPage = new ContactsPage(page);
    const testContact = createTestContact();

    await contactsPage.createContact(testContact);
    await contactsPage.goto();
    await contactsPage.getContactLink(testContact.name).click();

    await expect(page.getByText(testContact.name)).toBeVisible();
  });

  test('should edit an existing contact', async ({ page }) => {
    const contactsPage = new ContactsPage(page);
    const testContact = createTestContact();
    const updatedName = `Updated ${testContact.name}`;

    await contactsPage.createContact(testContact);
    await contactsPage.goto();
    await contactsPage.editContact(testContact.name);
    await contactsPage.fillContactForm({ name: updatedName });
    await contactsPage.saveContact();

    await expect(contactsPage.getSuccessToast()).toBeVisible();
  });

  test('should delete a contact', async ({ page }) => {
    const contactsPage = new ContactsPage(page);
    const testContact = createTestContact();

    await contactsPage.createContact(testContact);
    await contactsPage.goto();
    await contactsPage.deleteContact(testContact.name);
    await contactsPage.confirmDelete();

    await expect(contactsPage.getContactRow(testContact.name)).not.toBeVisible();
  });

  test('should search contacts', async ({ page }) => {
    const contactsPage = new ContactsPage(page);
    const testContact = createTestContact({ name: 'Unique Search Name E2E' });

    await contactsPage.createContact(testContact);
    await contactsPage.goto();
    await contactsPage.searchContacts('Unique Search Name E2E');

    await expect(contactsPage.getContactRow('Unique Search Name E2E')).toBeVisible();
  });
});
