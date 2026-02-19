/**
 * Capability Verbs and Verb-to-Kind Mapping
 * 
 * Defines allowed verbs per capability kind and provides O(1) lookup.
 */

import type { CapabilityKind } from './kinds';

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
