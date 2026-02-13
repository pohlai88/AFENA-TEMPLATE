import {
  createEntityHandler,
  listEntitiesHandler,
} from '@/lib/api/entity-route-handlers';

/**
 * GET  /api/entities/:entityType — List entities
 * POST /api/entities/:entityType — Create entity
 */
export const GET = listEntitiesHandler;
export const POST = createEntityHandler;
