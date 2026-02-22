/**
 * Liveness probe endpoint
 *
 * Used by Kubernetes/Docker to determine if the app is still alive
 */

import { createHealthCheck } from 'afenda-observability/health';

const health = createHealthCheck({
  name: 'afenda-web',
  checks: {},
});

export async function GET() {
  const isAlive = await health.alive();

  return new Response(isAlive ? 'OK' : 'DEAD', {
    status: isAlive ? 200 : 503,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
