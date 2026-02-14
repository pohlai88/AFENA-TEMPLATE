import { faker } from '@faker-js/faker';

import type { ContactFormData } from '../page-objects/ContactsPage';

export function createTestContact(
  overrides?: Partial<ContactFormData>,
): ContactFormData {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    company: faker.company.name(),
    notes: faker.lorem.sentence(),
    ...overrides,
  };
}

export function createTestContacts(
  count: number,
  overrides?: Partial<ContactFormData>,
): ContactFormData[] {
  return Array.from({ length: count }, () => createTestContact(overrides));
}
