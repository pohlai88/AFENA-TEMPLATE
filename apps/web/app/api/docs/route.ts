import { NextResponse } from 'next/server';

import { generateOpenApiSpec } from '@/lib/api/openapi-spec';

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
