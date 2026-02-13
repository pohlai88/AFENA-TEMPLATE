import { versionsHandler } from '@/lib/api/entity-route-handlers';

/**
 * GET /api/entities/:entityType/:id/versions — Entity version history
 */
export const GET = versionsHandler;
