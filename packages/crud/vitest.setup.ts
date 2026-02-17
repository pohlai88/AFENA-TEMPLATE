/**
 * Vitest setup for afenda-crud — sets TEST_DATABASE_URL so afenda-database does not throw.
 */
if (!process.env.TEST_DATABASE_URL) {
  process.env.TEST_DATABASE_URL = 'postgresql://dummy:dummy@localhost/dummy';
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}
