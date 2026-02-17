/**
 * Health check endpoint
 *
 * Returns health status of the application and its dependencies
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
