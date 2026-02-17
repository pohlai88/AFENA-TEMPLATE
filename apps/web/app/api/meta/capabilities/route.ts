import { NextRequest } from 'next/server';

import {
  CAPABILITY_CATALOG,
  CAPABILITY_KEYS,
  VIS_POLICY,
  inferKindFromVerb,
  parseCapabilityKey,
} from 'afenda-canon';

import { withAuth } from '@/lib/api/with-auth';

import type { RouteMetaStrict } from '@/lib/api/route-types';
import type { CapabilityDescriptor, CapabilityKind } from 'afenda-canon';

export const ROUTE_META = {
  path: '/api/meta/capabilities',
  methods: ['GET'],
  tier: 'admin',
  exposeInOpenApi: false,
} as const satisfies RouteMetaStrict;

export const CAPABILITIES = ['admin.views.manage'] as const;

/**
 * GET /api/meta/capabilities
 *
 * Serves the full capability catalog for admin UI.
 * Supports optional query params:
 *   ?kind=mutation    — filter by kind
 *   ?status=active    — filter by status
 *   ?tag=crm          — filter by tag
 *   ?summary=true     — return summary counts only
 */
export const GET = withAuth<unknown>((request: NextRequest) => {
  const url = request.nextUrl;
  const kindFilter = url.searchParams.get('kind');
  const statusFilter = url.searchParams.get('status');
  const tagFilter = url.searchParams.get('tag');
  const summaryOnly = url.searchParams.get('summary') === 'true';

  // Enrich entries with derived kind
  const entries: (CapabilityDescriptor & { derivedKind: CapabilityKind })[] = [];

  for (const key of CAPABILITY_KEYS) {
    const descriptor = CAPABILITY_CATALOG[key];
    if (!descriptor) continue;

    const parsed = parseCapabilityKey(key);
    const derivedKind = descriptor.kind ?? inferKindFromVerb(parsed.verb);

    // Apply filters
    if (kindFilter && derivedKind !== kindFilter) continue;
    if (statusFilter && descriptor.status !== statusFilter) continue;
    if (tagFilter && !(descriptor.tags ?? []).includes(tagFilter)) continue;

    entries.push({ ...descriptor, derivedKind });
  }

  if (summaryOnly) {
    const byKind: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    for (const e of entries) {
      byKind[e.derivedKind] = (byKind[e.derivedKind] ?? 0) + 1;
      byStatus[e.status] = (byStatus[e.status] ?? 0) + 1;
    }
    return Promise.resolve({
      ok: true as const,
      data: { total: entries.length, byKind, byStatus, phase: VIS_POLICY.phase } as unknown,
    });
  }

  return Promise.resolve({
    ok: true as const,
    data: { total: entries.length, phase: VIS_POLICY.phase, entries } as unknown,
  });
});
