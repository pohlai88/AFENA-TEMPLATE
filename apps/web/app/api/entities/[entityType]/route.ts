import {
  createEntityHandler,
  listEntitiesHandler,
} from '@/lib/api/entity-route-handlers';

import type { RouteMetaStrict } from '@/lib/api/route-types';

/**
 * GET  /api/entities/:entityType — List entities
 * POST /api/entities/:entityType — Create entity
 */
export const ROUTE_META = {
  path: '/api/entities/[entityType]',
  methods: ['GET', 'POST'],
  tier: 'contract',
  version: 'v1',
  exposeInOpenApi: true,
} as const satisfies RouteMetaStrict;

export const GET = listEntitiesHandler;
export const POST = createEntityHandler;
