/**
 * Asset Key System for Canon Metadata
 *
 * Asset keys are dot-delimited identifiers that uniquely identify any metadata asset.
 * All functions are pure deterministic operations with no side effects.
 *
 * Invariants (locked - see canon.architecture.md §7.1):
 * K1: Round-trip identity
 * K2: Canonicalization idempotence
 * K3: Segment count validation
 * K4: Character validation (lowercase, no empty segments)
 * K5: Delimiter enforcement (no . or : inside segments)
 * K6: Prefix-namespace integrity
 * K7: Hierarchical and template support (/ and {})
 * K8: Never-throw parsing API
 * K9: No duplicate validation logic
 */

import type { MetaAssetType } from '../../enums/meta-asset-type';
import { assetKeyCache, typeDerivationCache } from '../cache/lru-enhanced';

/**
 * Asset key prefix type - enforces V1 grammar
 */
export type AssetKeyPrefix =
  | 'db.rec'
  | 'db.field'
  | 'db.bo'
  | 'db.view'
  | 'db.pipe'
  | 'db.report'
  | 'db.api'
  | 'db.policy'
  | 'metric:';

/**
 * Prefix specification for V1 grammar enforcement.
 * Maps each prefix to segment count rules and description.
 */
export const ASSET_KEY_PREFIX_SPECS: Record<
  AssetKeyPrefix,
  {
    afterPrefixMin: number;
    afterPrefixMax?: number;
    description?: string;
  }
> = {
  'db.rec': {
    afterPrefixMin: 3,
    afterPrefixMax: 3,
    description: 'Database record type (system.schema.table)',
  },
  'db.field': {
    afterPrefixMin: 4,
    afterPrefixMax: 4,
    description: 'Database field (system.schema.table.column)',
  },
  'db.bo': {
    afterPrefixMin: 2,
    afterPrefixMax: 2,
    description: 'Business object (module.name)',
  },
  'db.view': {
    afterPrefixMin: 2,
    afterPrefixMax: 2,
    description: 'UI view (module.name)',
  },
  'db.pipe': {
    afterPrefixMin: 1,
    afterPrefixMax: 1,
    description: 'Pipeline/process (name)',
  },
  'db.report': {
    afterPrefixMin: 2,
    afterPrefixMax: 2,
    description: 'Report/KPI (module.name)',
  },
  'db.api': {
    afterPrefixMin: 2,
    afterPrefixMax: 2,
    description: 'API contract (module.name)',
  },
  'db.policy': {
    afterPrefixMin: 2,
    afterPrefixMax: 2,
    description: 'Governance policy (module.name)',
  },
  'metric:': {
    afterPrefixMin: 1,
    description: 'KPI/metric (dot-delimited after colon)',
  },
};

/**
 * Result of parsing an asset key
 * Never throws - always returns complete ParsedAssetKey with validation errors included
 */
export interface ParsedAssetKey {
  prefix: AssetKeyPrefix | null; // null if structural parse fails
  segments: string[]; // always present, even if invalid
  valid: boolean; // true iff everything passes
  errors: string[]; // structural + validation errors
}

/**
 * Maps asset key prefix to its corresponding MetaAssetType
 * Used for validating that key prefix matches assetType field
 */
const PREFIX_TO_ASSET_TYPE: Record<AssetKeyPrefix, MetaAssetType> = {
  'db.rec': 'table',
  'db.field': 'column',
  'db.bo': 'business_object',
  'db.view': 'view',
  'db.pipe': 'pipeline',
  'db.report': 'report',
  'db.api': 'api',
  'db.policy': 'policy',
  'metric:': 'metric',
};

/**
 * Segment character rules - allowed characters in segments
 * Forbidden: . : (reserved delimiters), uppercase (canonicalize), empty segments
 */
const SEGMENT_CHAR_PATTERN = /^[a-z0-9_\-/{}]+$/;

/**
 * Build an asset key from prefix and segments
 * Validates segment count before joining
 *
 * @throws If segment count doesn't match prefix spec
 * @example
 * buildAssetKey('db.rec', 'afenda', 'public', 'invoices')
 * // => 'db.rec.afenda.public.invoices'
 */
export function buildAssetKey(prefix: AssetKeyPrefix, ...segments: string[]): string {
  const spec = ASSET_KEY_PREFIX_SPECS[prefix];

  // Validate segment count
  if (
    segments.length < spec.afterPrefixMin ||
    (spec.afterPrefixMax !== undefined && segments.length > spec.afterPrefixMax)
  ) {
    throw new Error(
      `Invalid segment count for prefix '${prefix}': expected ${spec.afterPrefixMin}${spec.afterPrefixMax ? `-${spec.afterPrefixMax}` : '+'
      }, got ${segments.length}`
    );
  }

  // Validate each segment
  for (const seg of segments) {
    if (!seg) {
      throw new Error('Empty segments not allowed');
    }
    if (!SEGMENT_CHAR_PATTERN.test(seg)) {
      throw new Error(
        `Segment '${seg}' contains invalid characters (lowercase + [0-9_-/{}] only)`
      );
    }
  }

  // For db.* prefixes: join with dots; for metric: join with colon then dots
  if (prefix.startsWith('db.')) {
    return [prefix, ...segments].join('.');
  } else if (prefix === 'metric:') {
    return `${prefix}${segments.join('.')}`;
  }

  // Unreachable with typed input, but safety check
  throw new Error(`Unknown prefix: ${prefix}`);
}

/**
 * Canonicalize an asset key string
 * - Trims whitespace
 * - Lowercases all characters
 * - Rejects structural errors (double dots, trailing delimiters, empty segments)
 * - NEVER auto-corrects (fail fast on malformed input)
 *
 * @throws If key is structurally malformed
 * @returns Canonical (normalized) key string
 */
export function canonicalizeKey(key: string): string {
  // Trim whitespace
  let normalized = key.trim();

  // Lowercase
  normalized = normalized.toLowerCase();

  // Check for structural errors
  if (normalized.includes('..')) {
    throw new Error('Empty segments (double dots) not allowed');
  }

  // For db.* prefix keys
  if (normalized.startsWith('db.')) {
    if (normalized.endsWith('.')) {
      throw new Error('Trailing dot not allowed');
    }
    // Ensure no colons in db keys
    if (normalized.includes(':')) {
      throw new Error('Colon not allowed in db.* keys (reserved for metric:)');
    }
    return normalized;
  }

  // For metric: prefix keys
  if (normalized.startsWith('metric:')) {
    const remainder = normalized.slice('metric:'.length);
    if (!remainder) {
      throw new Error('Empty remainder after metric: prefix');
    }
    if (remainder.includes(':')) {
      throw new Error('Multiple colons not allowed (only one colon after metric)');
    }
    return normalized;
  }

  // Unknown or missing prefix
  throw new Error(
    `Unknown or missing prefix. Must start with 'db.' or 'metric:'. Got: ${normalized.slice(0, 20)}...`
  );
}

/**
 * Parse an asset key into its components
 * Never throws - returns ParsedAssetKey with errors embedded
 *
 * Two-phase approach:
 * 1. Structural parsing (extract prefix + segments)
 * 2. Validation (check segment count + character rules)
 *
 * Performance: Results are cached (LRU, max 1000 entries)
 *
 * @example
 * const result = parseAssetKey('db.rec.afenda.public.invoices');
 * // { prefix: 'db.rec', segments: ['afenda', 'public', 'invoices'], valid: true, errors: [] }
 */
export function parseAssetKey(key: string): ParsedAssetKey {
  // Check cache first (Phase 2 optimization)
  const cached = assetKeyCache.get(key);
  if (cached) {
    return cached as ParsedAssetKey;
  }

  // Compute if cache miss
  const errors: string[] = [];
  let prefix: AssetKeyPrefix | null = null;
  let segments: string[] = [];

  // Phase 1: Structural parsing
  if (!key || typeof key !== 'string') {
    return {
      prefix: null,
      segments: [],
      valid: false,
      errors: ['Key must be a non-empty string'],
    };
  }

  // Check for db.* prefix
  if (key.startsWith('db.')) {
    // Split on dots; prefix is first 2 tokens
    const parts = key.split('.');
    if (parts.length >= 2) {
      const prefixCandidate = `${parts[0]}.${parts[1]}`;
      // Type guard: check if it's a valid AssetKeyPrefix
      if (
        prefixCandidate === 'db.rec' ||
        prefixCandidate === 'db.field' ||
        prefixCandidate === 'db.bo' ||
        prefixCandidate === 'db.view' ||
        prefixCandidate === 'db.pipe' ||
        prefixCandidate === 'db.report' ||
        prefixCandidate === 'db.api' ||
        prefixCandidate === 'db.policy'
      ) {
        prefix = prefixCandidate as AssetKeyPrefix;
        segments = parts.slice(2);
      }
    }
  } else if (key.startsWith('metric:')) {
    // Split on colon; prefix is literal 'metric:', remainder is dot-split
    prefix = 'metric:';
    const remainder = key.slice('metric:'.length);
    segments = remainder ? remainder.split('.') : [];
  }

  // Check structural validity
  if (!prefix) {
    return {
      prefix: null,
      segments: [],
      valid: false,
      errors: ['Unknown or missing prefix. Must start with db.* or metric:'],
    };
  }

  // Phase 2: Validation
  const spec = ASSET_KEY_PREFIX_SPECS[prefix];
  const afterPrefixMin = spec?.afterPrefixMin ?? 0;
  const afterPrefixMax = spec?.afterPrefixMax ?? Infinity;

  // Segment count validation
  if (
    segments.length < afterPrefixMin ||
    (afterPrefixMax !== Infinity && segments.length > afterPrefixMax)
  ) {
    errors.push(
      `Invalid segment count for prefix '${prefix}': expected ${afterPrefixMin}${afterPrefixMax !== Infinity ? `-${afterPrefixMax}` : '+'
      }, got ${segments.length}`
    );
  }

  // Character validation for each segment
  for (const seg of segments) {
    if (!seg) {
      errors.push('Empty segments not allowed');
      continue;
    }
    if (!SEGMENT_CHAR_PATTERN.test(seg)) {
      errors.push(
        `Segment '${seg}' contains invalid characters (lowercase a-z, digits, _, -, /, {} only)`
      );
    }
  }

  // For db.* keys: ensure no colon anywhere
  if (prefix.startsWith('db.') && key.includes(':')) {
    errors.push('Colon not allowed in db.* keys (reserved for metric:)');
  }

  // Cache result before returning (Phase 2 optimization)
  const result = {
    prefix,
    segments,
    valid: errors.length === 0,
    errors,
  };
  assetKeyCache.set(key, result);
  return result;
}

/**
 * Validate an asset key without detailed parsing
 * Thin wrapper around parseAssetKey()
 *
 * @returns {valid, errors} for quick validation checks
 */
export function validateAssetKey(key: string): { valid: boolean; errors: string[] } {
  const parsed = parseAssetKey(key);
  return { valid: parsed.valid, errors: parsed.errors };
}

/**
 * Derive the MetaAssetType from an asset key prefix
 * Returns null if key is malformed
 *
 * Used to validate that assetKey prefix matches assetType field
 * Invariant: Every asset key maps to exactly one MetaAssetType
 * 
 * Performance: Results are cached (LRU, max 500 entries)
 */
export function deriveAssetTypeFromKey(key: string): MetaAssetType | null {
  // Check cache first (Phase 2 optimization)
  const cached = typeDerivationCache.get(key);
  if (cached !== undefined) {
    return cached as MetaAssetType | null;
  }

  // Compute if cache miss
  const parsed = parseAssetKey(key);
  if (!parsed.valid || !parsed.prefix) {
    typeDerivationCache.set(key, null);
    return null;
  }

  const result = PREFIX_TO_ASSET_TYPE[parsed.prefix];
  typeDerivationCache.set(key, result);
  return result;
}

/**
 * Assert that an asset key's prefix matches a given MetaAssetType
 * Throws if mismatch
 *
 * Used as service-layer gate on every meta_assets row write
 */
export function assertAssetTypeMatchesKey(
  key: string,
  assetType: MetaAssetType
): void {
  const derived = deriveAssetTypeFromKey(key);
  if (derived !== assetType) {
    throw new Error(
      `Asset key prefix does not match assetType. Key '${key}' derives type '${derived}' but assetType is '${assetType}'`
    );
  }
}

/**
 * Analyze an asset key in one pass
 * Combines parseAssetKey + deriveAssetTypeFromKey for efficiency
 */
export function analyzeAssetKey(key: string): {
  parsed: ParsedAssetKey;
  derivedType: MetaAssetType | null;
} {
  const parsed = parseAssetKey(key);
  const derivedType = !parsed.valid || !parsed.prefix ? null : PREFIX_TO_ASSET_TYPE[parsed.prefix];
  return { parsed, derivedType };
}
