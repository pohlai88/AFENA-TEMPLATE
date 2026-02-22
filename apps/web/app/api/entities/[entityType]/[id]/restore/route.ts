import { restoreEntityHandler } from '@/lib/api/entity-route-handlers';

import type { RouteMetaStrict } from '@/lib/api/route-types';

/**
 * POST /api/entities/:entityType/:id/restore — Restore soft-deleted entity
 *
 * Body: { expectedVersion: number }
 */
export const ROUTE_META = {
  path: '/api/entities/[entityType]/[id]/restore',
  methods: ['POST'],
  tier: 'contract',
  version: 'v1',
  exposeInOpenApi: true,
} as const satisfies RouteMetaStrict;

export const POST = restoreEntityHandler;
