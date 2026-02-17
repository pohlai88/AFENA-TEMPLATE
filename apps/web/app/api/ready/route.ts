/**
 * Readiness probe endpoint
 *
 * Used by Kubernetes/Docker to determine if the app can accept traffic
 */

import { createHealthCheck, HealthChecks } from 'afenda-observability/health';
import { neon } from '@neondatabase/neon-js';

const health = createHealthCheck({
  name: 'afenda-web',
  checks: {
    database: HealthChecks.database(async () => {
      try {
        const sql = neon(process.env.DATABASE_URL!);
        const result = await sql`SELECT 1 as health`;
        return result.length > 0;
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
