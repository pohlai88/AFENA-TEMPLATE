import { expect, test } from '@playwright/test';

/**
 * E2E API tests for Setup (departments) and Projects (tasks) entities.
 * ECO-HK-P4: Maximize surface area — BFF → CRUD → DB → RLS.
 *
 * Asserts:
 * - Entity routes exist and respond (200 with data, or 401 when auth required)
 * - Departments (Setup) and Tasks (Projects) are reachable via /api/entities/[type]
 */
test.describe('API — Departments (Setup)', () => {
  test('departments list route responds', async ({ request }) => {
    const res = await request.get(`/api/entities/departments?limit=10`);
    expect([200, 401]).toContain(res.status());
  });

  test('departments create route responds', async ({ request }) => {
    const res = await request.post(`/api/entities/departments`, {
      data: { departmentName: 'E2E Dept' },
    });
    expect([200, 401]).toContain(res.status());
  });
});

test.describe('API — Tasks (Projects)', () => {
  test('tasks list route responds', async ({ request }) => {
    const res = await request.get(`/api/entities/tasks?limit=10`);
    expect([200, 401]).toContain(res.status());
  });

  test('tasks create route responds', async ({ request }) => {
    const res = await request.post(`/api/entities/tasks`, {
      data: { subject: 'E2E Task' },
    });
    expect([200, 401]).toContain(res.status());
  });
});
