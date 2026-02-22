import { faker } from '@faker-js/faker';

export interface TestUser {
  name: string;
  email: string;
  password: string;
}

export function getTestUser(): TestUser {
  return {
    name: process.env.E2E_TEST_USER_NAME ?? 'E2E Test User',
    email: process.env.E2E_TEST_USER_EMAIL ?? 'test@example.com',
    password: process.env.E2E_TEST_USER_PASSWORD ?? 'test-password-123',
  };
}

export function createRandomUser(): TestUser {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 16 }),
  };
}
