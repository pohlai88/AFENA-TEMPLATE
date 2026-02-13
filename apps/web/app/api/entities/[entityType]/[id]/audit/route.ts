import { auditHandler } from '@/lib/api/entity-route-handlers';

/**
 * GET /api/entities/:entityType/:id/audit — Entity audit trail
 */
export const GET = auditHandler;
