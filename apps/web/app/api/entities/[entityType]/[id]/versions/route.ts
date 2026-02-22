import { versionsHandler } from '@/lib/api/entity-route-handlers';

import type { RouteMetaStrict } from '@/lib/api/route-types';

/**
 * GET /api/entities/:entityType/:id/versions — Entity version history
 */
export const ROUTE_META = {
  path: '/api/entities/[entityType]/[id]/versions',
  methods: ['GET'],
  tier: 'contract',
  version: 'v1',
  exposeInOpenApi: true,
} as const satisfies RouteMetaStrict;

export const GET = versionsHandler;
