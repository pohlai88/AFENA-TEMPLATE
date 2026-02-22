/**
 * Readiness probe endpoint
 *
 * Used by Kubernetes/Docker to determine if the app can accept traffic
 */

export const CAPABILITIES = ['system.health.read'] as const;

import { db, sql } from 'afenda-database';
import { createHealthCheck, HealthChecks } from 'afenda-observability/health';

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
  },
  timeout: 3000,
});

export async function GET() {
  const isReady = await health.ready();

  return new Response(isReady ? 'OK' : 'NOT READY', {
    status: isReady ? 200 : 503,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
