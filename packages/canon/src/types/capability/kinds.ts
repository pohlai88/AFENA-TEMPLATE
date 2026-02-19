/**
 * Capability Kinds
 * 
 * Defines the fundamental categories of capabilities in the system.
 */

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
