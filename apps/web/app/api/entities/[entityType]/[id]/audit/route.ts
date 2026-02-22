import { auditHandler } from '@/lib/api/entity-route-handlers';

import type { RouteMetaStrict } from '@/lib/api/route-types';

/**
 * GET /api/entities/:entityType/:id/audit — Entity audit trail
 */
export const ROUTE_META = {
  path: '/api/entities/[entityType]/[id]/audit',
  methods: ['GET'],
  tier: 'contract',
  version: 'v1',
  exposeInOpenApi: true,
} as const satisfies RouteMetaStrict;

export const GET = auditHandler;
