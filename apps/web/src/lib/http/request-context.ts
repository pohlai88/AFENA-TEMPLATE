import type { RequestContext as LoggerRequestContext } from 'afenda-logger';

/**
 * BFF-level request context — shared by route handlers and server actions.
 * Populated into ALS by both `createRouteHandler()` and `withActionAuth()`.
 */
export interface BffRequestContext {
  requestId: string;
  orgId: string;
  actorId: string;
  actorType: 'user' | 'apiKey' | 'system';
  authMode: 'session' | 'apiKey';
  ip: string | null;
  userAgent: string | null;
  path: string;
  method: string;
  apiVersion?: 'v1';
  tier: 'rest' | 'bff' | 'admin' | 'sdk';
}

/**
 * Convert BFF context to the logger's ALS RequestContext (snake_case).
 * This is the bridge between the BFF layer and the logger package.
 */
export function toLoggerContext(ctx: BffRequestContext): LoggerRequestContext {
  return {
    request_id: ctx.requestId,
    org_id: ctx.orgId,
    actor_id: ctx.actorId,
    actor_type: ctx.actorType === 'apiKey' ? 'service' : ctx.actorType,
    service: 'web',
  };
}
