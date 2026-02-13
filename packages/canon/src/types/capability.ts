/**
 * Capability Truth Ledger — Canon types, enums, parser, validator, and derivation maps.
 *
 * This file is the SSOT for what the system can do. Every capability key,
 * domain, namespace, verb, and kind is governed here.
 *
 * ACTION_TYPES ⊂ CAPABILITY_KEYS — every ActionType is a capability,
 * but not every capability is an ActionType.
 */

import { getActionFamily } from './action';

import type { ActionFamily } from './action';

// ── Capability Kind ─────────────────────────────────────────

export const CAPABILITY_KINDS = [
  'mutation',
  'read',
  'search',
  'admin',
  'system',
  'auth',
  'storage',
] as const;
export type CapabilityKind = (typeof CAPABILITY_KINDS)[number];

// ── RBAC Types ──────────────────────────────────────────────

export const RBAC_TIERS = [
  'public',
  'viewer',
  'editor',
  'manager',
  'admin',
  'system',
] as const;
export type RbacTier = (typeof RBAC_TIERS)[number];

export const RBAC_SCOPES = ['read', 'write', 'admin', 'system'] as const;
export type RbacScope = (typeof RBAC_SCOPES)[number];

// ── Domains & Namespaces ────────────────────────────────────

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

// ── Governed Verb Sets ──────────────────────────────────────

export const CAPABILITY_VERBS = {
  mutation: [
    'create',
    'update',
    'delete',
    'restore',
    'submit',
    'cancel',
    'amend',
    'post',
    'close',
    'reopen',
    'merge',
    'archive',
    'duplicate',
    'approve',
    'reject',
    'lock',
    'unlock',
    'reassign',
    'transfer',
    'comment',
    'attach',
    'import',
  ],
  read: ['read', 'list', 'versions', 'audit'],
  search: ['search', 'global'],
  admin: ['define', 'manage', 'configure', 'seed', 'sync', 'resolve'],
  system: ['evaluate', 'run', 'explain', 'detect', 'forecast'],
  auth: ['sign_in', 'sign_out', 'refresh'],
  storage: ['upload', 'download', 'metadata', 'save'],
} as const satisfies Record<CapabilityKind, readonly string[]>;

// ── Precomputed Verb→Kind Map ───────────────────────────────

/** O(1) lookup from verb to kind. Built once at module init. */
export const VERB_TO_KIND: Readonly<Record<string, CapabilityKind>> =
  Object.freeze(
    Object.fromEntries(
      (
        Object.entries(CAPABILITY_VERBS) as [
          CapabilityKind,
          readonly string[],
        ][]
      ).flatMap(([kind, verbs]) => verbs.map((v) => [v, kind])),
    ),
  ) as Readonly<Record<string, CapabilityKind>>;

// Module-init safety: throw if any verb appears in two kinds
(() => {
  const seen = new Map<string, string>();
  for (const [kind, verbs] of Object.entries(CAPABILITY_VERBS)) {
    for (const v of verbs) {
      if (seen.has(v))
        throw new Error(`Verb "${v}" in both "${seen.get(v)}" and "${kind}"`);
      seen.set(v, kind);
    }
  }
})();

/** Deterministic kind inference from verb. Throws on unknown verb. */
export function inferKindFromVerb(verb: string): CapabilityKind {
  const kind = VERB_TO_KIND[verb];
  if (!kind) throw new Error(`Unknown verb: "${verb}"`);
  return kind;
}

// ── Key Parser ──────────────────────────────────────────────

/**
 * Discriminated union for parsed capability keys.
 * Three shapes prevent subtle bugs in validation, RBAC derivation, and grouping.
 */
export type ParsedCapabilityKey =
  | { shape: 'domain'; ns: null; domain: CapabilityDomain; verb: string }
  | {
    shape: 'namespace';
    ns: CapabilityNamespace;
    domain: null;
    verb: string;
  }
  | {
    shape: 'namespaced-domain';
    ns: CapabilityNamespace;
    domain: CapabilityDomain;
    verb: string;
  };

/**
 * Parse a capability key into its constituent parts.
 * Does NOT validate domain/namespace/verb membership — use `validateCapabilityKey()` for that.
 */
export function parseCapabilityKey(key: string): ParsedCapabilityKey {
  const parts = key.split('.');
  if (parts.length === 2) {
    const [seg, verb] = parts as [string, string];
    if (
      (CAPABILITY_NAMESPACES as readonly string[]).includes(seg)
    )
      return {
        shape: 'namespace',
        ns: seg as CapabilityNamespace,
        domain: null,
        verb,
      };
    return {
      shape: 'domain',
      ns: null,
      domain: seg as CapabilityDomain,
      verb,
    };
  }
  if (parts.length === 3) {
    const [ns, domain, verb] = parts as [string, string, string];
    return {
      shape: 'namespaced-domain',
      ns: ns as CapabilityNamespace,
      domain: domain as CapabilityDomain,
      verb,
    };
  }
  throw new Error(`Invalid capability key: "${key}" (must be 2 or 3 parts)`);
}

/**
 * Parse AND validate a capability key. Throws with developer-friendly errors
 * including the key and the specific validation failure.
 */
export function validateCapabilityKey(key: string): ParsedCapabilityKey {
  const parsed = parseCapabilityKey(key);
  if (!VERB_TO_KIND[parsed.verb])
    throw new Error(`Unknown verb "${parsed.verb}" in key "${key}"`);
  if (
    parsed.domain !== null &&
    !(CAPABILITY_DOMAINS as readonly string[]).includes(parsed.domain)
  )
    throw new Error(`Unknown domain "${parsed.domain}" in key "${key}"`);
  if (
    parsed.ns !== null &&
    !(CAPABILITY_NAMESPACES as readonly string[]).includes(parsed.ns)
  )
    throw new Error(`Unknown namespace "${parsed.ns}" in key "${key}"`);
  return parsed;
}

// ── RBAC Derivation Maps ────────────────────────────────────

/** Maps ACTION_FAMILY → RBAC tier for mutation capabilities. */
export const ACTION_FAMILY_TO_TIER: Record<ActionFamily, RbacTier> = {
  field_mutation: 'editor',
  lifecycle: 'editor',
  state_transition: 'manager',
  ownership: 'admin',
  annotation: 'editor',
  system: 'system',
};

/** Maps CapabilityKind → default RBAC tier (non-mutations, or mutation fallback). */
export const KIND_TO_TIER: Record<CapabilityKind, RbacTier> = {
  mutation: 'editor',
  read: 'viewer',
  search: 'viewer',
  admin: 'admin',
  system: 'system',
  auth: 'public',
  storage: 'editor',
};

/** Maps CapabilityKind → RBAC scope for backend policy. */
export const KIND_TO_SCOPE: Record<CapabilityKind, RbacScope> = {
  mutation: 'write',
  read: 'read',
  search: 'read',
  admin: 'admin',
  system: 'system',
  auth: 'system',
  storage: 'system',
};

// ── VIS Policy ──────────────────────────────────────────────

/** Phase-aware enforcement policy. Bump `phase` + update `uiSeverity` when ready. */
export const VIS_POLICY = {
  phase: 3,
  rules: {
    mutation: {
      kernelRequired: true,
      appRequired: true,
      uiSeverity: 'error',
    },
    read: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
    search: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
    admin: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
    system: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
    auth: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
    storage: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
  },
} as const;

export type VisPolicy = typeof VIS_POLICY;

// ── Capability Descriptor ───────────────────────────────────

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

// ── Capability Catalog ──────────────────────────────────────

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
