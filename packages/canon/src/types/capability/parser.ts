/**
 * Capability Key Parser and Validator
 * 
 * Pure parsing and validation logic for capability keys.
 * Parser is small and has no data tables (tree-shakeable).
 */

import { CAPABILITY_DOMAINS, CAPABILITY_NAMESPACES, type CapabilityDomain, type CapabilityNamespace } from './domains';
import { VERB_TO_KIND } from './verbs';

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

/**
 * Build a capability key from entity type and verb.
 *
 * Standard format: `{entityType}.{verb}` (e.g., `contacts.create`)
 *
 * Used by enforcePolicyV2 to resolve required capabilities from Canon vocabulary.
 * Does NOT validate against CAPABILITY_CATALOG — use `resolveCapabilityKey()` for that.
 *
 * @example
 * ```ts
 * buildCapabilityKey('contacts', 'create') // => 'contacts.create'
 * buildCapabilityKey('sales_orders', 'approve') // => 'sales_orders.approve'
 * ```
 */
export function buildCapabilityKey(entityType: string, verb: string): string {
  return `${entityType}.${verb}`;
}
