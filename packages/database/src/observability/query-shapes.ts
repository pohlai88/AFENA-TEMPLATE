/**
 * Query Shape Registry
 * 
 * Defines all known query shapes for observability and monitoring.
 * Every production query MUST be tagged with a shape key from this registry.
 * 
 * Shape IDs follow the pattern: Q.<domain>.<operation>.v<version>
 */

/**
 * Query shape definition
 */
export interface QueryShape {
  /** Unique shape identifier */
  id: string;
  /** Whether this is a hot path query (requires plan validation) */
  hot: boolean;
  /** Warning threshold in milliseconds */
  warnMs?: number;
  /** Expected maximum rows returned */
  maxRows?: number;
  /** Description of what this query does */
  description?: string;
}

/**
 * Query shape registry
 * 
 * Add new shapes here as queries are added to the system.
 * Hot path queries (hot: true) will be validated by PLAN-01 gate in CI.
 */
export const QUERY_SHAPES = {
  // Invoice queries
  'invoices.list': {
    id: 'Q.invoices.list.v1',
    hot: true,
    warnMs: 500,
    maxRows: 100,
    description: 'List invoices for organization with pagination',
  },
  'invoices.getById': {
    id: 'Q.invoices.getById.v1',
    hot: true,
    warnMs: 200,
    maxRows: 1,
    description: 'Get single invoice by ID',
  },
  'invoices.create': {
    id: 'Q.invoices.create.v1',
    hot: true,
    warnMs: 500,
    maxRows: 1,
    description: 'Create new invoice',
  },
  'invoices.update': {
    id: 'Q.invoices.update.v1',
    hot: true,
    warnMs: 500,
    maxRows: 1,
    description: 'Update existing invoice',
  },

  // Customer queries
  'customers.list': {
    id: 'Q.customers.list.v1',
    hot: true,
    warnMs: 500,
    maxRows: 100,
    description: 'List customers for organization',
  },
  'customers.getById': {
    id: 'Q.customers.getById.v1',
    hot: true,
    warnMs: 200,
    maxRows: 1,
    description: 'Get single customer by ID',
  },
  'customers.search': {
    id: 'Q.customers.search.v1',
    hot: true,
    warnMs: 1000,
    maxRows: 50,
    description: 'Search customers by name/email',
  },

  // Contact queries
  'contacts.list': {
    id: 'Q.contacts.list.v1',
    hot: true,
    warnMs: 500,
    maxRows: 100,
    description: 'List contacts for organization',
  },
  'contacts.getById': {
    id: 'Q.contacts.getById.v1',
    hot: true,
    warnMs: 200,
    maxRows: 1,
    description: 'Get single contact by ID',
  },

  // Product queries
  'products.list': {
    id: 'Q.products.list.v1',
    hot: true,
    warnMs: 500,
    maxRows: 100,
    description: 'List products for organization',
  },
  'products.search': {
    id: 'Q.products.search.v1',
    hot: true,
    warnMs: 1000,
    maxRows: 50,
    description: 'Search products by name/SKU',
  },

  // Audit log queries
  'auditLogs.list': {
    id: 'Q.auditLogs.list.v1',
    hot: false,
    warnMs: 2000,
    maxRows: 100,
    description: 'List audit logs (not hot path)',
  },

  // Search queries
  'search.fullText': {
    id: 'Q.search.fullText.v1',
    hot: false,
    warnMs: 1000,
    maxRows: 50,
    description: 'Full-text search across entities',
  },

  // Workflow queries
  'workflows.listActive': {
    id: 'Q.workflows.listActive.v1',
    hot: true,
    warnMs: 500,
    maxRows: 50,
    description: 'List active workflows for organization',
  },

  // Entity version queries
  'entityVersions.getHistory': {
    id: 'Q.entityVersions.getHistory.v1',
    hot: false,
    warnMs: 1000,
    maxRows: 100,
    description: 'Get version history for entity',
  },
} as const;

/**
 * Query shape key type (derived from registry keys)
 */
export type QueryShapeKey = keyof typeof QUERY_SHAPES;

/**
 * Shape ID type (derived from registry values)
 */
export type ShapeId = (typeof QUERY_SHAPES)[QueryShapeKey]['id'];

/**
 * Get query shape by key
 */
export function getQueryShape(key: QueryShapeKey): QueryShape {
  return QUERY_SHAPES[key];
}

/**
 * Get all hot path query shapes (for CI validation)
 */
export function getHotPathShapes(): Array<[QueryShapeKey, QueryShape]> {
  return Object.entries(QUERY_SHAPES).filter(
    ([_, shape]) => shape.hot
  ) as Array<[QueryShapeKey, QueryShape]>;
}

/**
 * Validate that a shape key exists
 */
export function isValidShapeKey(key: string): key is QueryShapeKey {
  return key in QUERY_SHAPES;
}
