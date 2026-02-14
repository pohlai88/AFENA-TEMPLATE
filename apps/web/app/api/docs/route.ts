import { NextResponse } from 'next/server';

import { generateOpenApiSpec } from '@/lib/api/openapi-spec';

import type { RouteMetaStrict } from '@/lib/api/route-types';

export const ROUTE_META = {
  path: '/api/docs',
  methods: ['GET'],
  tier: 'admin',
  exposeInOpenApi: false,
} as const satisfies RouteMetaStrict;

/**
 * GET /api/docs — OpenAPI 3.1 JSON spec
 *
 * Auto-generated from ENTITY_TYPES registry.
 * No auth required — spec is public.
 */
export function GET() {
  const spec = generateOpenApiSpec();
  return NextResponse.json(spec, {
    headers: {
      'Cache-Control': 'public, max-age=60',
    },
  });
}
