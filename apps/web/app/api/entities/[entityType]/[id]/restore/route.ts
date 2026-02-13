import { restoreEntityHandler } from '@/lib/api/entity-route-handlers';

/**
 * POST /api/entities/:entityType/:id/restore — Restore soft-deleted entity
 *
 * Body: { expectedVersion: number }
 */
export const POST = restoreEntityHandler;
