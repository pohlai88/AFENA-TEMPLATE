import { withAuth } from '@/lib/api/with-auth';

import type { RouteMetaStrict } from '@/lib/api/route-types';

export const ROUTE_META = {
  path: '/api/storage/metadata',
  methods: ['GET', 'POST'],
  tier: 'bff',
  exposeInOpenApi: false,
} as const satisfies RouteMetaStrict;

export const CAPABILITIES = ['storage.files.save', 'storage.files.metadata'] as const;

export const POST = withAuth(async (_request) => {
  return { ok: false, code: 'NOT_IMPLEMENTED', message: 'Storage schema not yet provisioned', status: 503 };
});

export const GET = withAuth(async (_request) => {
  return { ok: false, code: 'NOT_IMPLEMENTED', message: 'Storage schema not yet provisioned', status: 503 };
});
