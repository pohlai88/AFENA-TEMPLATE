/**
 * Health check endpoint
 *
 * Returns health status of the application and its dependencies
 */

import { db, sql } from 'afenda-database';
import { createHealthCheck, HealthChecks } from 'afenda-observability/health';

export const CAPABILITIES = ['system.health.read'] as const;

const health = createHealthCheck({
  name: 'afenda-web',
  checks: {
    database: HealthChecks.database(async () => {
      try {
        const result = await db.execute(sql`SELECT 1 AS health`);
        return ((result as unknown as { rows: unknown[] }).rows ?? []).length > 0;
      } catch {
        return false;
      }
    }),

    memory: HealthChecks.memory(1024), // 1GB threshold
  },
  timeout: 5000,
});

export async function GET() {
  const result = await health.check();

  return Response.json(result, {
    status: result.healthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
