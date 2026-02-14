import type { RouteFileEntry } from './route-types';

/**
 * SSOT: every app/api/.../route.ts must be listed.
 * Tier 1 (contract) only in OpenAPI. Paths use canonical Next token form.
 */
export const ROUTE_MANIFEST: RouteFileEntry[] = [
  // --- Tier 1 Contract (entities) ---
  {
    file: 'app/api/entities/[entityType]/route.ts',
    kind: 'entity',
    path: '/api/entities/[entityType]',
    methods: ['GET', 'POST'],
    tier: 'contract',
    version: 'v1',
    exposeInOpenApi: true,
  },
  {
    file: 'app/api/entities/[entityType]/[id]/route.ts',
    kind: 'entity',
    path: '/api/entities/[entityType]/[id]',
    methods: ['GET', 'PATCH', 'DELETE'],
    tier: 'contract',
    version: 'v1',
    exposeInOpenApi: true,
  },
  {
    file: 'app/api/entities/[entityType]/[id]/restore/route.ts',
    kind: 'entity',
    path: '/api/entities/[entityType]/[id]/restore',
    methods: ['POST'],
    tier: 'contract',
    version: 'v1',
    exposeInOpenApi: true,
  },
  {
    file: 'app/api/entities/[entityType]/[id]/versions/route.ts',
    kind: 'entity',
    path: '/api/entities/[entityType]/[id]/versions',
    methods: ['GET'],
    tier: 'contract',
    version: 'v1',
    exposeInOpenApi: true,
  },
  {
    file: 'app/api/entities/[entityType]/[id]/audit/route.ts',
    kind: 'entity',
    path: '/api/entities/[entityType]/[id]/audit',
    methods: ['GET'],
    tier: 'contract',
    version: 'v1',
    exposeInOpenApi: true,
  },
  // --- Tier 1 Contract (webhooks) ---
  {
    file: 'app/api/webhooks/[source]/route.ts',
    kind: 'webhook',
    path: '/api/webhooks/[source]',
    methods: ['POST'],
    tier: 'contract',
    version: 'v1',
    exposeInOpenApi: true,
  },
  // --- Tier 2 BFF ---
  {
    file: 'app/api/search/route.ts',
    kind: 'bff',
    path: '/api/search',
    methods: ['GET'],
    tier: 'bff',
    exposeInOpenApi: false,
  },
  {
    file: 'app/api/storage/presign/route.ts',
    kind: 'bff',
    path: '/api/storage/presign',
    methods: ['POST'],
    tier: 'bff',
    exposeInOpenApi: false,
  },
  {
    file: 'app/api/storage/metadata/route.ts',
    kind: 'bff',
    path: '/api/storage/metadata',
    methods: ['GET', 'POST'],
    tier: 'bff',
    exposeInOpenApi: false,
  },
  {
    file: 'app/api/views/[entityType]/route.ts',
    kind: 'bff',
    path: '/api/views/[entityType]',
    methods: ['GET'],
    tier: 'bff',
    exposeInOpenApi: false,
  },
  {
    file: 'app/api/custom-fields/[entityType]/route.ts',
    kind: 'bff',
    path: '/api/custom-fields/[entityType]',
    methods: ['GET'],
    tier: 'bff',
    exposeInOpenApi: false,
  },
  // --- Tier 3 Admin ---
  {
    file: 'app/api/docs/route.ts',
    kind: 'docs',
    path: '/api/docs',
    methods: ['GET'],
    tier: 'admin',
    exposeInOpenApi: false,
  },
  {
    file: 'app/api/meta/capabilities/route.ts',
    kind: 'admin',
    path: '/api/meta/capabilities',
    methods: ['GET'],
    tier: 'admin',
    exposeInOpenApi: false,
  },
  {
    file: 'app/api/meta/capabilities/flags/route.ts',
    kind: 'admin',
    path: '/api/meta/capabilities/flags',
    methods: ['GET', 'POST'],
    tier: 'admin',
    exposeInOpenApi: false,
  },
  // --- Tier 4 Auth (delegated) ---
  {
    file: 'app/api/auth/[...path]/route.ts',
    kind: 'admin',
    path: '/api/auth/[...path]',
    methods: ['GET', 'POST'],
    tier: 'auth',
    exposeInOpenApi: false,
  },
];
