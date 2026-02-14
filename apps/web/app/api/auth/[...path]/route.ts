import { auth } from '@/lib/auth/server';

import type { RouteMetaStrict } from '@/lib/api/route-types';

export const ROUTE_META = {
  path: '/api/auth/[...path]',
  methods: ['GET', 'POST'],
  tier: 'auth',
  exposeInOpenApi: false,
} as const satisfies RouteMetaStrict;

export const CAPABILITIES = ['auth.sign_in', 'auth.sign_out'] as const;

export const { GET, POST } = auth.handler();
