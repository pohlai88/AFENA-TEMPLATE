import {
  deleteEntityHandler,
  readEntityHandler,
  updateEntityHandler,
} from '@/lib/api/entity-route-handlers';

/**
 * GET    /api/entities/:entityType/:id — Read entity
 * PATCH  /api/entities/:entityType/:id — Update entity
 * DELETE /api/entities/:entityType/:id — Soft-delete entity
 */
export const GET = readEntityHandler;
export const PATCH = updateEntityHandler;
export const DELETE = deleteEntityHandler;
