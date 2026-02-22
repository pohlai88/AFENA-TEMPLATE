/**
 * GL Platform Intent Builders
 *
 * Pure data construction — zero side effects.
 * Each builder returns a typed DomainIntent for the GL Platform domain.
 */
import type {
  DomainIntent,
  GlCoaPublishPayload,
  GlPeriodClosePayload,
  GlPeriodOpenPayload,
} from 'afenda-canon';

export function buildOpenPeriodIntent(
  payload: GlPeriodOpenPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'gl.period.open', payload, idempotencyKey };
}

export function buildClosePeriodIntent(
  payload: GlPeriodClosePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'gl.period.close', payload, idempotencyKey };
}

export function buildPublishCoaIntent(
  payload: GlCoaPublishPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'gl.coa.publish', payload, idempotencyKey };
}
