import { customFieldsHandler } from '@/lib/api/entity-route-handlers';
import { withAuth } from '@/lib/api/with-auth';

import type { RouteMetaStrict } from '@/lib/api/route-types';

export const ROUTE_META = {
  path: '/api/custom-fields/[entityType]',
  methods: ['GET'],
  tier: 'bff',
  exposeInOpenApi: false,
} as const satisfies RouteMetaStrict;

export const CAPABILITIES = ['custom_fields.read'] as const;

/**
 * GET /api/custom-fields/:entityType
 *
 * Returns active custom field definitions for the given entity type.
 * Used by DynamicForm and DataTable to render custom fields.
 */
export const GET = withAuth(customFieldsHandler);
