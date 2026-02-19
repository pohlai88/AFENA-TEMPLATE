/**
 * Capability Catalog
 * 
 * The single source of truth for what the system can do.
 * This is a larger data table file (tree-shakeable).
 */

import { getActionFamily } from '../action';
import type { CapabilityKind } from './kinds';
import { validateCapabilityKey } from './parser';
import { ACTION_FAMILY_TO_TIER, KIND_TO_SCOPE, KIND_TO_TIER, type RbacScope, type RbacTier } from './rbac';
import { inferKindFromVerb } from './verbs';

export type CapabilityStatus = 'planned' | 'active' | 'deprecated';
export type CapabilityScope = 'org' | 'company' | 'site' | 'global';
export type CapabilityRisk = 'financial' | 'pii' | 'audit' | 'irreversible';

export interface CapabilityDescriptor {
  key: string;
  intent: string;
  kind?: CapabilityKind;
  scope: CapabilityScope;
  status: CapabilityStatus;
  entities?: string[];
  tags?: string[];
  headlessOnly?: boolean;
  requires?: string[];
  produces?: string[];
  risks?: CapabilityRisk[];
  rbacTier?: RbacTier;
  rbacScope?: RbacScope;
}

/**
 * CAPABILITY_CATALOG — the single source of truth for what the system can do.
 * Every key is validated at module init. Flat map keyed by capability key.
 */
export const CAPABILITY_CATALOG: Record<string, CapabilityDescriptor> = {
  // ── Contacts (mutations) ────────────────────────────────
  'contacts.create': {
    key: 'contacts.create',
    intent: 'Create a new contact',
    scope: 'org',
    status: 'active',
    entities: ['contacts'],
    tags: ['crm'],
    produces: ['contact.created'],
  },
  'contacts.update': {
    key: 'contacts.update',
    intent: 'Update an existing contact',
    scope: 'org',
    status: 'active',
    entities: ['contacts'],
    tags: ['crm'],
    produces: ['contact.updated'],
  },
  'contacts.delete': {
    key: 'contacts.delete',
    intent: 'Soft-delete a contact',
    scope: 'org',
    status: 'active',
    entities: ['contacts'],
    tags: ['crm'],
    produces: ['contact.deleted'],
    risks: ['irreversible'],
  },
  'contacts.restore': {
    key: 'contacts.restore',
    intent: 'Restore a soft-deleted contact',
    scope: 'org',
    status: 'active',
    entities: ['contacts'],
    tags: ['crm'],
    produces: ['contact.restored'],
  },

  // ── Contacts (reads) ───────────────────────────────────
  'contacts.read': {
    key: 'contacts.read',
    intent: 'Read a single contact',
    scope: 'org',
    status: 'active',
    entities: ['contacts'],
    tags: ['crm'],
  },
  'contacts.list': {
    key: 'contacts.list',
    intent: 'List contacts with filtering and pagination',
    scope: 'org',
    status: 'active',
    entities: ['contacts'],
    tags: ['crm'],
  },
  'contacts.versions': {
    key: 'contacts.versions',
    intent: 'View version history of a contact',
    scope: 'org',
    status: 'active',
    entities: ['contacts'],
    tags: ['crm', 'audit'],
  },
  'contacts.audit': {
    key: 'contacts.audit',
    intent: 'View audit trail for a contact',
    scope: 'org',
    status: 'active',
    entities: ['contacts'],
    tags: ['crm', 'audit'],
  },

  // ── Contacts (search) ──────────────────────────────────
  'contacts.search': {
    key: 'contacts.search',
    intent: 'Full-text search across contacts',
    scope: 'org',
    status: 'active',
    entities: ['contacts'],
    tags: ['crm', 'search'],
    headlessOnly: true,
  },

  // ── Search (cross-entity) ──────────────────────────────
  'search.global': {
    key: 'search.global',
    intent: 'Global search across all entity types',
    scope: 'org',
    status: 'active',
    tags: ['search'],
    headlessOnly: true,
  },

  // ── Custom Fields (reads) ──────────────────────────────
  'custom_fields.read': {
    key: 'custom_fields.read',
    intent: 'Load custom field definitions for an entity type',
    scope: 'org',
    status: 'active',
    entities: ['custom_fields'],
    tags: ['admin'],
    headlessOnly: true,
  },

  // ── Admin (custom fields) ─────────────────────────────
  'admin.custom_fields.define': {
    key: 'admin.custom_fields.define',
    intent: 'Define a custom field for an entity type',
    scope: 'org',
    status: 'active',
    entities: ['custom_fields'],
    tags: ['admin'],
    headlessOnly: true,
  },
  'admin.custom_fields.sync': {
    key: 'admin.custom_fields.sync',
    intent: 'Sync custom field values after schema change',
    scope: 'org',
    status: 'active',
    entities: ['custom_fields'],
    tags: ['admin'],
    headlessOnly: true,
  },

  // ── Admin (aliases) ───────────────────────────────────
  'admin.aliases.resolve': {
    key: 'admin.aliases.resolve',
    intent: 'Resolve entity aliases to canonical IDs',
    scope: 'org',
    status: 'active',
    entities: ['aliases'],
    tags: ['admin'],
    headlessOnly: true,
  },

  // ── Views (reads) ──────────────────────────────────────
  'views.read': {
    key: 'views.read',
    intent: 'Load entity view definitions (columns, ordering, visibility)',
    scope: 'org',
    status: 'active',
    entities: ['views'],
    tags: ['admin'],
    headlessOnly: true,
  },

  // ── Admin (views) ─────────────────────────────────────
  'admin.views.manage': {
    key: 'admin.views.manage',
    intent: 'Create and manage entity views',
    scope: 'org',
    status: 'active',
    entities: ['views'],
    tags: ['admin'],
    headlessOnly: true,
  },

  // ── System (workflows) ────────────────────────────────
  'system.workflows.evaluate': {
    key: 'system.workflows.evaluate',
    intent: 'Evaluate workflow rules against a mutation',
    scope: 'org',
    status: 'active',
    entities: ['workflows'],
    tags: ['system', 'automation'],
    headlessOnly: true,
  },
  'system.workflows.manage': {
    key: 'system.workflows.manage',
    intent: 'Create and manage workflow rules',
    scope: 'org',
    status: 'active',
    entities: ['workflows'],
    tags: ['system', 'automation'],
    headlessOnly: true,
  },

  // ── System (advisory) ─────────────────────────────────
  'system.advisory.detect': {
    key: 'system.advisory.detect',
    intent: 'Run anomaly detection on entity metrics',
    scope: 'org',
    status: 'active',
    entities: ['advisory'],
    tags: ['system', 'analytics'],
    headlessOnly: true,
  },
  'system.advisory.forecast': {
    key: 'system.advisory.forecast',
    intent: 'Generate statistical forecasts for entity metrics',
    scope: 'org',
    status: 'active',
    entities: ['advisory'],
    tags: ['system', 'analytics'],
    headlessOnly: true,
  },
  'system.advisory.explain': {
    key: 'system.advisory.explain',
    intent: 'Generate plain-English explanations for advisories',
    scope: 'org',
    status: 'active',
    entities: ['advisory'],
    tags: ['system', 'analytics'],
    headlessOnly: true,
  },

  // ── Auth ──────────────────────────────────────────────
  'auth.sign_in': {
    key: 'auth.sign_in',
    intent: 'Authenticate a user',
    scope: 'global',
    status: 'active',
    tags: ['auth'],
  },
  'auth.sign_out': {
    key: 'auth.sign_out',
    intent: 'End a user session',
    scope: 'global',
    status: 'active',
    tags: ['auth'],
  },

  // ── Storage ───────────────────────────────────────────
  'storage.files.upload': {
    key: 'storage.files.upload',
    intent: 'Upload a file to storage',
    scope: 'org',
    status: 'active',
    entities: ['files'],
    tags: ['storage'],
    headlessOnly: true,
  },
  'storage.files.metadata': {
    key: 'storage.files.metadata',
    intent: 'Retrieve file metadata',
    scope: 'org',
    status: 'active',
    entities: ['files'],
    tags: ['storage'],
    headlessOnly: true,
  },
  'storage.files.save': {
    key: 'storage.files.save',
    intent: 'Save file metadata after upload',
    scope: 'org',
    status: 'active',
    entities: ['files'],
    tags: ['storage'],
    headlessOnly: true,
  },
  'companies.create': { key: 'companies.create', intent: 'Create a new company', scope: 'org', status: 'active', entities: ['companies'], tags: ['companies'] },
  'companies.update': { key: 'companies.update', intent: 'Update an existing company', scope: 'org', status: 'active', entities: ['companies'], tags: ['companies'] },
  'companies.delete': { key: 'companies.delete', intent: 'Soft-delete a company', scope: 'org', status: 'active', entities: ['companies'], tags: ['companies'], risks: ['irreversible'] },
  'companies.restore': { key: 'companies.restore', intent: 'Restore a soft-deleted company', scope: 'org', status: 'active', entities: ['companies'], tags: ['companies'] },
  'companies.read': { key: 'companies.read', intent: 'Read a single company', scope: 'org', status: 'active', entities: ['companies'], tags: ['companies'] },
  'companies.list': { key: 'companies.list', intent: 'List companies', scope: 'org', status: 'active', entities: ['companies'], tags: ['companies'] },
  'companies.versions': { key: 'companies.versions', intent: 'View version history', scope: 'org', status: 'active', entities: ['companies'], tags: ['companies', 'audit'] },
  'companies.audit': { key: 'companies.audit', intent: 'View audit trail', scope: 'org', status: 'active', entities: ['companies'], tags: ['companies', 'audit'] },
  // @entity-gen:capability-catalog
};

// ── Catalog Validation + RBAC Derivation (module init) ──────

// Validate every key and auto-populate rbacTier + rbacScope
for (const [key, descriptor] of Object.entries(CAPABILITY_CATALOG)) {
  if (descriptor.key !== key) {
    throw new Error(
      `CAPABILITY_CATALOG key mismatch: map key "${key}" !== descriptor.key "${descriptor.key}"`,
    );
  }
  const parsed = validateCapabilityKey(key);
  const kind = descriptor.kind ?? inferKindFromVerb(parsed.verb);

  // Auto-populate rbacTier if not explicitly set
  if (!descriptor.rbacTier) {
    if (kind === 'mutation') {
      const family = getActionFamily(key);
      descriptor.rbacTier = ACTION_FAMILY_TO_TIER[family];
    } else {
      descriptor.rbacTier = KIND_TO_TIER[kind];
    }
  }

  // Auto-populate rbacScope if not explicitly set
  descriptor.rbacScope ??= KIND_TO_SCOPE[kind];
}

// ── Derived CAPABILITY_KEYS + CapabilityKey type ────────────

/** All valid capability keys, derived from the catalog. Never hand-edited. */
export const CAPABILITY_KEYS = Object.keys(CAPABILITY_CATALOG);

/** Type-safe union of all capability keys. */
export type CapabilityKey = keyof typeof CAPABILITY_CATALOG;

// ── Capability Resolution API ───────────────────────────────

/**
 * Resolve a capability descriptor from the catalog.
 * Returns undefined if the capability is not registered.
 *
 * Used by enforcePolicyV2 to validate against Canon vocabulary.
 *
 * @example
 * ```ts
 * const cap = resolveCapabilityDescriptor('contacts', 'create');
 * if (cap) {
 *   console.log(cap.scope, cap.risks);
 * }
 * ```
 */
export function resolveCapabilityDescriptor(
  entityType: string,
  verb: string,
): CapabilityDescriptor | undefined {
  const key = `${entityType}.${verb}`;
  return CAPABILITY_CATALOG[key];
}

/**
 * Check if a capability key exists in the catalog.
 *
 * @example
 * ```ts
 * if (hasCapability('contacts', 'create')) {
 *   // proceed with policy check using Canon vocabulary
 * }
 * ```
 */
export function hasCapability(entityType: string, verb: string): boolean {
  return `${entityType}.${verb}` in CAPABILITY_CATALOG;
}

/**
 * Get all registered capabilities for an entity type.
 * Returns an array of capability descriptors.
 *
 * @example
 * ```ts
 * const contactCaps = getCapabilitiesForEntity('contacts');
 * // => [contacts.create, contacts.update, contacts.delete, ...]
 * ```
 */
export function getCapabilitiesForEntity(entityType: string): CapabilityDescriptor[] {
  return Object.values(CAPABILITY_CATALOG).filter(
    (cap) => cap.entities?.includes(entityType) || cap.key.startsWith(`${entityType}.`),
  );
}
