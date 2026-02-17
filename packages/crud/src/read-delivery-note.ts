/**
 * Relational read for delivery note with lines.
 * Phase 2A: Uses db.query.X.findFirst({ with: { Y: true } }) — single bounded query.
 */
import { and, deliveryNotes, eq, getDb } from 'afenda-database';

import { err, ok } from './envelope';

import type { ApiResponse } from 'afenda-canon';

/**
 * Read a delivery note with its lines in one query.
 * Returns stable envelope { header, lines }; does not leak raw Drizzle objects.
 */
export async function readDeliveryNoteWithLines(
  id: string,
  orgId: string,
  requestId: string,
  options?: { forcePrimary?: boolean },
): Promise<ApiResponse<{ header: unknown; lines: unknown[] }>> {
  const conn = getDb(options?.forcePrimary ? { forcePrimary: true } : undefined);

  const result = await conn.query.deliveryNotes.findFirst({
    where: and(eq(deliveryNotes.orgId, orgId), eq(deliveryNotes.id, id)),
    with: { lines: true },
  });

  if (!result) {
    return err('NOT_FOUND', `Delivery note not found: ${id}`, requestId);
  }

  const { lines, ...header } = result;
  return ok({ header, lines: lines ?? [] }, requestId);
}
