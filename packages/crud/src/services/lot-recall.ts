import { and, eq, lotTracking, inventoryTraceLinks } from 'afena-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Affected movement in a recall trace.
 */
export interface AffectedMovement {
  movementId: string;
  qty: string;
  traceType: string;
  depth: number;
}

/**
 * Recall trace result — all movements affected by a lot recall.
 */
export interface RecallTraceResult {
  lotTrackingId: string;
  trackingNo: string;
  itemId: string;
  direction: 'forward' | 'backward';
  affectedMovements: AffectedMovement[];
  totalAffected: number;
}

/**
 * Trace forward from a lot — find all downstream movements.
 *
 * PRD G0.14 — Recall model:
 * - Uses inventory_trace_links DAG to walk forward from source movements
 * - BFS traversal with depth tracking
 * - Returns all affected movements for recall scope determination
 *
 * @param db - Database handle
 * @param orgId - Tenant org ID
 * @param lotTrackingId - Lot tracking UUID to trace from
 * @param maxDepth - Maximum traversal depth (default 10)
 */
export async function traceForward(
  db: NeonHttpDatabase,
  orgId: string,
  lotTrackingId: string,
  maxDepth: number = 10,
): Promise<AffectedMovement[]> {
  // Get initial movements linked to this lot
  const seedLinks = await (db as any)
    .select({
      toMovementId: inventoryTraceLinks.toMovementId,
      qty: inventoryTraceLinks.qty,
      traceType: inventoryTraceLinks.traceType,
    })
    .from(inventoryTraceLinks)
    .where(
      and(
        eq(inventoryTraceLinks.orgId, orgId),
        eq(inventoryTraceLinks.lotTrackingId, lotTrackingId),
      ),
    );

  const visited = new Set<string>();
  const result: AffectedMovement[] = [];
  let frontier: AffectedMovement[] = seedLinks.map((l: { toMovementId: unknown; qty: string; traceType: string }) => ({
    movementId: String(l.toMovementId),
    qty: l.qty,
    traceType: l.traceType,
    depth: 1,
  }));

  while (frontier.length > 0) {
    const nextDepth = frontier[0]?.depth ?? Infinity;
    if (nextDepth > maxDepth) break;
    const nextFrontier: AffectedMovement[] = [];

    for (const item of frontier) {
      if (visited.has(item.movementId)) continue;
      visited.add(item.movementId);
      result.push(item);

      // Find downstream links
      const downstream = await (db as any)
        .select({
          toMovementId: inventoryTraceLinks.toMovementId,
          qty: inventoryTraceLinks.qty,
          traceType: inventoryTraceLinks.traceType,
        })
        .from(inventoryTraceLinks)
        .where(
          and(
            eq(inventoryTraceLinks.orgId, orgId),
            eq(inventoryTraceLinks.fromMovementId, item.movementId),
          ),
        );

      for (const d of downstream) {
        const toId = String(d.toMovementId);
        if (!visited.has(toId)) {
          nextFrontier.push({
            movementId: toId,
            qty: d.qty,
            traceType: d.traceType,
            depth: item.depth + 1,
          });
        }
      }
    }

    frontier = nextFrontier;
  }

  return result;
}

/**
 * Trace backward from a lot — find all upstream source movements.
 *
 * @param db - Database handle
 * @param orgId - Tenant org ID
 * @param lotTrackingId - Lot tracking UUID to trace from
 * @param maxDepth - Maximum traversal depth (default 10)
 */
export async function traceBackward(
  db: NeonHttpDatabase,
  orgId: string,
  lotTrackingId: string,
  maxDepth: number = 10,
): Promise<AffectedMovement[]> {
  // Get initial movements linked to this lot
  const seedLinks = await (db as any)
    .select({
      fromMovementId: inventoryTraceLinks.fromMovementId,
      qty: inventoryTraceLinks.qty,
      traceType: inventoryTraceLinks.traceType,
    })
    .from(inventoryTraceLinks)
    .where(
      and(
        eq(inventoryTraceLinks.orgId, orgId),
        eq(inventoryTraceLinks.lotTrackingId, lotTrackingId),
      ),
    );

  const visited = new Set<string>();
  const result: AffectedMovement[] = [];
  let frontier: AffectedMovement[] = seedLinks.map((l: { fromMovementId: unknown; qty: string; traceType: string }) => ({
    movementId: String(l.fromMovementId),
    qty: l.qty,
    traceType: l.traceType,
    depth: 1,
  }));

  while (frontier.length > 0) {
    const nextDepth = frontier[0]?.depth ?? Infinity;
    if (nextDepth > maxDepth) break;
    const nextFrontier: AffectedMovement[] = [];

    for (const item of frontier) {
      if (visited.has(item.movementId)) continue;
      visited.add(item.movementId);
      result.push(item);

      // Find upstream links
      const upstream = await (db as any)
        .select({
          fromMovementId: inventoryTraceLinks.fromMovementId,
          qty: inventoryTraceLinks.qty,
          traceType: inventoryTraceLinks.traceType,
        })
        .from(inventoryTraceLinks)
        .where(
          and(
            eq(inventoryTraceLinks.orgId, orgId),
            eq(inventoryTraceLinks.toMovementId, item.movementId),
          ),
        );

      for (const u of upstream) {
        const fromId = String(u.fromMovementId);
        if (!visited.has(fromId)) {
          nextFrontier.push({
            movementId: fromId,
            qty: u.qty,
            traceType: u.traceType,
            depth: item.depth + 1,
          });
        }
      }
    }

    frontier = nextFrontier;
  }

  return result;
}

/**
 * Execute a full recall trace for a lot/batch/serial number.
 *
 * Combines forward + backward trace and marks the lot as recalled.
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param lotTrackingId - Lot tracking UUID
 */
export async function traceRecall(
  tx: NeonHttpDatabase,
  orgId: string,
  lotTrackingId: string,
): Promise<RecallTraceResult> {
  // Get lot details
  const [lot] = await (tx as any)
    .select({
      id: lotTracking.id,
      trackingNo: lotTracking.trackingNo,
      itemId: lotTracking.itemId,
    })
    .from(lotTracking)
    .where(
      and(
        eq(lotTracking.orgId, orgId),
        eq(lotTracking.id, lotTrackingId),
      ),
    );

  if (!lot) {
    throw new Error(`Lot tracking record not found: ${lotTrackingId}`);
  }

  // Trace forward (downstream — where did this lot go?)
  const forwardMovements = await traceForward(tx, orgId, lotTrackingId);

  // Mark lot as recalled
  await (tx as any)
    .update(lotTracking)
    .set({ status: 'recalled' })
    .where(
      and(
        eq(lotTracking.orgId, orgId),
        eq(lotTracking.id, lotTrackingId),
      ),
    );

  return {
    lotTrackingId,
    trackingNo: lot.trackingNo,
    itemId: lot.itemId,
    direction: 'forward',
    affectedMovements: forwardMovements,
    totalAffected: forwardMovements.length,
  };
}
