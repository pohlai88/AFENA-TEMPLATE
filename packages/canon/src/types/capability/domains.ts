/**
 * Capability Domains and Namespaces
 * 
 * Domains are business/feature areas with entities and data.
 * Namespaces are cross-cutting concerns for non-entity capabilities.
 */

/** Business/feature domains — things that have entities, data, or user-facing features. */
export const CAPABILITY_DOMAINS = [
  'contacts',
  'companies',
  'sites',
  'invoices',
  'payments',
  'inventory',
  'sales',
  'purchases',
  'ledger',
  'custom_fields',
  'workflows',
  'advisory',
  'search',
  'aliases',
  'views',
  'files',
  'roles',
  'health',
] as const;

export type CapabilityDomain = (typeof CAPABILITY_DOMAINS)[number];

/** Cross-cutting namespaces — umbrellas for non-entity capabilities. */
export const CAPABILITY_NAMESPACES = [
  'admin',
  'system',
  'auth',
  'storage',
] as const;

export type CapabilityNamespace = (typeof CAPABILITY_NAMESPACES)[number];
