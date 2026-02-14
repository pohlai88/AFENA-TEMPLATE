import {
  deleteEntityHandler,
  readEntityHandler,
  updateEntityHandler,
} from '@/lib/api/entity-route-handlers';

import type { RouteMetaStrict } from '@/lib/api/route-types';

/**
 * GET    /api/entities/:entityType/:id — Read entity
 * PATCH  /api/entities/:entityType/:id — Update entity
 * DELETE /api/entities/:entityType/:id — Soft-delete entity
 */
export const ROUTE_META = {
  path: '/api/entities/[entityType]/[id]',
  methods: ['GET', 'PATCH', 'DELETE'],
  tier: 'contract',
  version: 'v1',
  exposeInOpenApi: true,
} as const satisfies RouteMetaStrict;

export const GET = readEntityHandler;
export const PATCH = updateEntityHandler;
export const DELETE = deleteEntityHandler;
