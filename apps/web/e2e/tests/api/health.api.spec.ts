import { expect, test } from '@playwright/test';

test.describe('API — Health Checks', () => {
  test('GET / should return 200', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
  });

  test('GET /api/search should require auth', async ({ request }) => {
    const response = await request.get('/api/search?q=test');
    expect(response.status()).toBe(401);
  });
});
