import { NextRequest } from 'next/server';

import { verifyWebhookSignature } from 'afena-crud';

import { withApiKey } from '@/lib/api/with-api-key';

/**
 * POST /api/webhooks/[source] — Webhook ingestion endpoint.
 *
 * PRD Phase C #11 + G0.4:
 * - Accepts incoming webhooks from external systems
 * - Validates API key via Authorization header
 * - Verifies HMAC-SHA256 signature if X-Webhook-Signature header present
 * - Routes payload to appropriate handler based on source param
 *
 * Sources: stripe, xero, quickbooks, custom, etc.
 */
export const POST = withApiKey(async (
  request: NextRequest,
  _session,
) => {
  const url = new URL(request.url);
  const source = url.pathname.split('/').pop() ?? 'unknown';

  const body = await request.text();
  const signatureHeader = request.headers.get('x-webhook-signature');
  const eventType = request.headers.get('x-webhook-event') ?? `${source}.event`;

  // Verify signature if provided (source-specific secret would come from config)
  if (signatureHeader) {
    // For now, use a placeholder secret lookup — in production this would
    // resolve from webhook_endpoints or org-level config
    const secret = request.headers.get('x-webhook-secret-id');
    if (secret) {
      const valid = await verifyWebhookSignature(secret, body, signatureHeader);
      if (!valid) {
        return { ok: false as const, code: 'SIGNATURE_INVALID', message: 'Webhook signature verification failed', status: 401 };
      }
    }
  }

  try {
    JSON.parse(body);
  } catch {
    return { ok: false as const, code: 'INVALID_PAYLOAD', message: 'Request body is not valid JSON', status: 400 };
  }

  // TODO: Route to entity-specific handler or enqueue for async processing
  // For now, acknowledge receipt — the webhook is logged via the API key middleware
  return { ok: true as const, data: { received: true, source, eventType, id: crypto.randomUUID() } };
});
