import { NextRequest } from 'next/server';

import { ENTITY_TYPES } from 'afenda-canon';
import { loadFieldDefs } from 'afenda-crud/internal';

import { generateEntityActions } from '@/lib/actions/entity-actions';

import { withAuthOrApiKey } from './with-auth-or-api-key';

import type { EntityType, JsonValue } from 'afenda-canon';
import type { AuthSession } from './with-auth';

/**
 * Validate that a string is a registered entity type.
 */
function parseEntityType(raw: string | undefined): EntityType | null {
  if (!raw) return null;
  if ((ENTITY_TYPES as readonly string[]).includes(raw)) return raw as EntityType;
  return null;
}

/**
 * Extract path segments from the URL.
 * /api/entities/contacts/abc-123 → { entityType: 'contacts', id: 'abc-123' }
 */
function parseEntityPath(pathname: string): { entityType: string | undefined; id: string | undefined } {
  const segments = pathname.split('/').filter(Boolean);
  // Expected: ['api', 'entities', entityType, ...rest]
  const apiIdx = segments.indexOf('entities');
  return {
    entityType: segments[apiIdx + 1],
    id: segments[apiIdx + 2],
  };
}

// ── Collection routes: GET /api/entities/:type + POST /api/entities/:type ──

export const listEntitiesHandler = withAuthOrApiKey(async (request: NextRequest, session: AuthSession) => {
  const { entityType: raw } = parseEntityPath(request.nextUrl.pathname);
  const entityType = parseEntityType(raw);
  if (!entityType) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: `Unknown entity type: ${raw}`, status: 404 };
  }

  const actions = generateEntityActions(entityType);
  const includeDeleted = request.nextUrl.searchParams.get('includeDeleted') === 'true';
  const includeCount = request.nextUrl.searchParams.get('includeCount') === 'true';
  const includeLegacyRef = request.nextUrl.searchParams.get('includeLegacyRef') === 'true';
  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') ?? '50'), 200);
  const offset = Number(request.nextUrl.searchParams.get('offset') ?? '0');
  const cursor = request.nextUrl.searchParams.get('cursor');

  const result = await actions.list({
    includeDeleted,
    includeCount,
    includeLegacyRef,
    limit,
    offset,
    ...(cursor ? { cursor } : {}),
    orgId: session.orgId,
  });
  if (!result.ok) {
    const code = result.error?.code ?? 'INTERNAL_ERROR';
    const message = result.error?.message ?? 'Failed to list entities';
    return { ok: false as const, code, message, ...(code === 'VALIDATION_FAILED' ? { status: 400 } : {}) };
  }
  const meta: { totalCount?: number; nextCursor?: string } = {};
  if (result.meta?.totalCount !== undefined) meta.totalCount = result.meta.totalCount;
  if (result.meta?.nextCursor) meta.nextCursor = result.meta.nextCursor;
  return { ok: true as const, data: result.data, ...(Object.keys(meta).length ? { meta } : {}) };
});

export const createEntityHandler = withAuthOrApiKey(async (request: NextRequest, _session: AuthSession) => {
  const { entityType: raw } = parseEntityPath(request.nextUrl.pathname);
  const entityType = parseEntityType(raw);
  if (!entityType) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: `Unknown entity type: ${raw}`, status: 404 };
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'Invalid JSON body' };
  }

  const actions = generateEntityActions(entityType);
  const result = await actions.create(body as JsonValue);
  if (!result.ok) {
    return { ok: false as const, code: result.error?.code ?? 'INTERNAL_ERROR', message: result.error?.message ?? 'Create failed' };
  }
  return { ok: true as const, data: result.data };
});

// ── Item routes: GET/PATCH/DELETE /api/entities/:type/:id ──

export const readEntityHandler = withAuthOrApiKey(async (request: NextRequest, _session: AuthSession) => {
  const { entityType: raw, id } = parseEntityPath(request.nextUrl.pathname);
  const entityType = parseEntityType(raw);
  if (!entityType) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: `Unknown entity type: ${raw}`, status: 404 };
  }
  if (!id) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'Missing entity ID' };
  }

  const includeLegacyRef = request.nextUrl.searchParams.get('includeLegacyRef') === 'true';
  const actions = generateEntityActions(entityType);
  const result = await actions.read(id, { includeLegacyRef });
  if (!result.ok) {
    return { ok: false as const, code: result.error?.code ?? 'NOT_FOUND', message: result.error?.message ?? 'Entity not found', status: 404 };
  }
  return { ok: true as const, data: result.data };
});

export const updateEntityHandler = withAuthOrApiKey(async (request: NextRequest, _session: AuthSession) => {
  const { entityType: raw, id } = parseEntityPath(request.nextUrl.pathname);
  const entityType = parseEntityType(raw);
  if (!entityType) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: `Unknown entity type: ${raw}`, status: 404 };
  }
  if (!id) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'Missing entity ID' };
  }

  let body: { expectedVersion?: number; input?: JsonValue };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'Invalid JSON body' };
  }

  if (typeof body.expectedVersion !== 'number') {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'expectedVersion is required (number)' };
  }

  const actions = generateEntityActions(entityType);
  const result = await actions.update(id, body.expectedVersion, (body.input ?? {}) as JsonValue);
  if (!result.ok) {
    return { ok: false as const, code: result.error?.code ?? 'INTERNAL_ERROR', message: result.error?.message ?? 'Update failed' };
  }
  return { ok: true as const, data: result.data };
});

export const deleteEntityHandler = withAuthOrApiKey(async (request: NextRequest, _session: AuthSession) => {
  const { entityType: raw, id } = parseEntityPath(request.nextUrl.pathname);
  const entityType = parseEntityType(raw);
  if (!entityType) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: `Unknown entity type: ${raw}`, status: 404 };
  }
  if (!id) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'Missing entity ID' };
  }

  const versionParam = request.nextUrl.searchParams.get('expectedVersion');
  const expectedVersion = versionParam ? Number(versionParam) : undefined;
  if (typeof expectedVersion !== 'number' || Number.isNaN(expectedVersion)) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'expectedVersion query param is required' };
  }

  const actions = generateEntityActions(entityType);
  const result = await actions.remove(id, expectedVersion);
  if (!result.ok) {
    return { ok: false as const, code: result.error?.code ?? 'INTERNAL_ERROR', message: result.error?.message ?? 'Delete failed' };
  }
  return { ok: true as const, data: result.data };
});

// ── Restore: POST /api/entities/:type/:id/restore ──

export const restoreEntityHandler = withAuthOrApiKey(async (request: NextRequest, _session: AuthSession) => {
  // Parse from: /api/entities/:type/:id/restore
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const apiIdx = segments.indexOf('entities');
  const raw = segments[apiIdx + 1];
  const id = segments[apiIdx + 2];

  const entityType = parseEntityType(raw);
  if (!entityType) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: `Unknown entity type: ${raw}`, status: 404 };
  }
  if (!id) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'Missing entity ID' };
  }

  let body: { expectedVersion?: number };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'Invalid JSON body' };
  }

  if (typeof body.expectedVersion !== 'number') {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'expectedVersion is required (number)' };
  }

  const actions = generateEntityActions(entityType);
  const result = await actions.restore(id, body.expectedVersion);
  if (!result.ok) {
    return { ok: false as const, code: result.error?.code ?? 'INTERNAL_ERROR', message: result.error?.message ?? 'Restore failed' };
  }
  return { ok: true as const, data: result.data };
});

// ── Versions: GET /api/entities/:type/:id/versions ──

export const versionsHandler = withAuthOrApiKey(async (request: NextRequest, _session: AuthSession) => {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const apiIdx = segments.indexOf('entities');
  const raw = segments[apiIdx + 1];
  const id = segments[apiIdx + 2];

  const entityType = parseEntityType(raw);
  if (!entityType) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: `Unknown entity type: ${raw}`, status: 404 };
  }
  if (!id) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'Missing entity ID' };
  }

  const actions = generateEntityActions(entityType);
  const result = await actions.getVersions(id);
  if (!result.ok) {
    return { ok: false as const, code: result.error?.code ?? 'INTERNAL_ERROR', message: result.error?.message ?? 'Failed to fetch versions' };
  }
  return { ok: true as const, data: result.data };
});

// ── Audit: GET /api/entities/:type/:id/audit ──

export const auditHandler = withAuthOrApiKey(async (request: NextRequest, _session: AuthSession) => {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const apiIdx = segments.indexOf('entities');
  const raw = segments[apiIdx + 1];
  const id = segments[apiIdx + 2];

  const entityType = parseEntityType(raw);
  if (!entityType) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: `Unknown entity type: ${raw}`, status: 404 };
  }
  if (!id) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'Missing entity ID' };
  }

  const actions = generateEntityActions(entityType);
  const result = await actions.getAuditLogs(id);
  if (!result.ok) {
    return { ok: false as const, code: result.error?.code ?? 'INTERNAL_ERROR', message: result.error?.message ?? 'Failed to fetch audit logs' };
  }
  return { ok: true as const, data: result.data };
});

// ── Custom fields: GET /api/custom-fields/:entityType ──

export async function customFieldsHandler(request: NextRequest, session: AuthSession) {
  const entityType = request.nextUrl.pathname.split('/').pop();
  if (!entityType) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'entityType is required' };
  }

  const fieldDefs = await loadFieldDefs(session.orgId, entityType);
  return { ok: true as const, data: fieldDefs };
}
