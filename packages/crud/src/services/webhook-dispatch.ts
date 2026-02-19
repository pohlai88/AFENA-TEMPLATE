import { and, eq, sql, webhookDeliveries, webhookEndpoints } from 'afenda-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Webhook dispatch result for a single endpoint.
 */
export interface WebhookDeliveryResult {
  endpointId: string;
  deliveryId: string;
  statusCode: number | null;
  success: boolean;
  error?: string;
  durationMs: number;
}

/**
 * Dispatch result for an event across all matching endpoints.
 */
export interface WebhookDispatchResult {
  eventType: string;
  endpointCount: number;
  deliveries: WebhookDeliveryResult[];
}

/**
 * Compute HMAC-SHA256 signature for webhook payload verification.
 *
 * Uses Web Crypto API (available in Node 18+ and edge runtimes).
 */
async function computeHmacSignature(
  secret: string,
  payload: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Dispatch a webhook event to all matching active endpoints.
 *
 * PRD Phase C #11:
 * - Finds all active endpoints subscribed to the event type
 * - Sends POST with HMAC-SHA256 signature header
 * - Logs delivery attempt in webhook_deliveries (append-only)
 * - Fire-and-forget: errors are logged, never thrown
 *
 * @param db - Database handle (top-level, not tx — deliveries are independent)
 * @param orgId - Tenant org ID
 * @param eventType - Event type string (e.g., 'invoice.posted', 'payment.created')
 * @param payload - Event payload object
 */
export async function dispatchWebhookEvent(
  db: NeonHttpDatabase,
  orgId: string,
  eventType: string,
  payload: Record<string, unknown>,
): Promise<WebhookDispatchResult> {
  // 1. Find all active endpoints subscribed to this event
  const endpoints = await (db as any)
    .select({
      id: webhookEndpoints.id,
      url: webhookEndpoints.url,
      secret: webhookEndpoints.secret,
    })
    .from(webhookEndpoints)
    .where(
      and(
        eq(webhookEndpoints.orgId, orgId),
        eq(webhookEndpoints.isActive, true),
        sql`${webhookEndpoints.subscribedEvents} @> ${JSON.stringify([eventType])}::jsonb`,
      ),
    );

  if (endpoints.length === 0) {
    return { eventType, endpointCount: 0, deliveries: [] };
  }

  type EndpointRow = { id: string; url: string; secret: string };
  const typedEndpoints = endpoints as EndpointRow[];

  // 2. Dispatch to each endpoint
  const deliveries: WebhookDeliveryResult[] = [];

  for (const ep of typedEndpoints) {
    const payloadStr = JSON.stringify(payload);
    const start = Date.now();
    let statusCode: number | null = null;
    let responseBody: string | null = null;
    let error: string | undefined;
    let success = false;

    try {
      const signature = await computeHmacSignature(ep.secret, payloadStr);

      const response = await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-afenda-Signature': `sha256=${signature}`,
          'X-afenda-Event': eventType,
        },
        body: payloadStr,
        signal: AbortSignal.timeout(10_000), // 10s timeout
      });

      statusCode = response.status;
      success = response.ok;

      // Read response body (truncate to 4KB)
      const text = await response.text();
      responseBody = text.slice(0, 4096);
    } catch (err: any) {
      error = err?.message ?? 'Unknown error';
    }

    const durationMs = Date.now() - start;

    // 3. Log delivery attempt (fire-and-forget)
    try {
      const [row] = await (db as any)
        .insert(webhookDeliveries)
        .values({
          orgId,
          endpointId: ep.id,
          eventType,
          payload,
          statusCode: statusCode?.toString() ?? null,
          responseBody,
          attemptNumber: '1',
          durationMs: String(durationMs),
          error: error ?? null,
        })
        .returning({ id: webhookDeliveries.id });

      deliveries.push({
        endpointId: ep.id,
        deliveryId: row.id,
        statusCode,
        success,
        ...(error ? { error } : {}),
        durationMs,
      });
    } catch {
      // Delivery logging failure must not affect dispatch
      deliveries.push({
        endpointId: ep.id,
        deliveryId: '',
        statusCode,
        success,
        error: error ?? 'delivery log failed',
        durationMs,
      });
    }

    // 4. Update endpoint last delivery stats (ep.id is string from EndpointRow)
    try {
      await (db as any)
        .update(webhookEndpoints)
        .set({
          lastDeliveredAt: new Date(),
          lastStatusCode: statusCode?.toString() ?? null,
          failureCount: success
            ? '0'
            : sql`(${webhookEndpoints.failureCount}::int + 1)::text`,
        })
        .where(
          and(
            eq(webhookEndpoints.orgId, orgId),
            eq(webhookEndpoints.id, ep.id),
          ),
        );
    } catch {
      // Stats update failure must not affect dispatch
    }
  }

  return { eventType, endpointCount: endpoints.length, deliveries };
}

/**
 * Verify an incoming webhook signature.
 *
 * Used by API routes that receive webhooks from external systems.
 */
export async function verifyWebhookSignature(
  secret: string,
  payload: string,
  signatureHeader: string,
): Promise<boolean> {
  const expected = await computeHmacSignature(secret, payload);
  const received = signatureHeader.replace('sha256=', '');

  // Constant-time comparison
  if (expected.length !== received.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ received.charCodeAt(i);
  }
  return mismatch === 0;
}
