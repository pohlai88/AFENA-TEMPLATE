/**
 * Asset Fingerprinting for Canon Metadata
 *
 * Generates deterministic canonical string representations of asset descriptors.
 * Used for:
 * - Change detection in migrations
 * - Idempotency checks
 * - Deduplication
 *
 * Pure function - no cryptographic imports (hashing is service-layer responsibility)
 */

import type { MetaAssetType } from '../enums/meta-asset-type';
import type { MetaClassification } from '../enums/meta-classification';
import type { MetaQualityTier } from '../enums/meta-quality-tier';

/**
 * Asset descriptor - canonical shape for metadata
 * Maps to the aspects defined in canon.architecture.md §7.2
 */
export interface AssetDescriptor {
  // ── Identity Aspect ──
  assetKey: string;
  assetType: MetaAssetType;
  displayName: string;
  description?: string;

  // ── Ownership Aspect ──
  owner?: string;
  steward?: string;

  // ── Classification Aspect ──
  classification?: MetaClassification;
  tags?: string[];

  // ── Quality Aspect ──
  qualityTier?: MetaQualityTier;

  // ── Lineage Aspect ──
  upstream?: string[];
  downstream?: string[];

  // ── Glossary Aspect ──
  glossaryTerms?: string[];
}

/**
 * Generate a deterministic canonical fingerprint of an asset descriptor
 *
 * Canonicalization rules:
 * 1. Sort all object keys alphabetically
 * 2. Sort all arrays alphabetically (for determinism)
 * 3. JSON.stringify with sorted keys
 * 4. Result is stable regardless of input field order or array order
 *
 * Use case: Detect if a descriptor has changed (idempotency)
 * Cryptographic hashing (SHA-256) is service-layer responsibility
 *
 * @returns Canonical string representation (invariant under input reordering)
 */
export function assetFingerprint(descriptor: AssetDescriptor): string {
  const canonical = {
    assetKey: descriptor.assetKey,
    assetType: descriptor.assetType,
    displayName: descriptor.displayName,
    ...(descriptor.description && { description: descriptor.description }),
    ...(descriptor.owner && { owner: descriptor.owner }),
    ...(descriptor.steward && { steward: descriptor.steward }),
    ...(descriptor.classification && { classification: descriptor.classification }),
    ...(descriptor.tags && descriptor.tags.length > 0 && {
      tags: [...descriptor.tags].sort(),
    }),
    ...(descriptor.qualityTier && { qualityTier: descriptor.qualityTier }),
    ...(descriptor.upstream && descriptor.upstream.length > 0 && {
      upstream: [...descriptor.upstream].sort(),
    }),
    ...(descriptor.downstream && descriptor.downstream.length > 0 && {
      downstream: [...descriptor.downstream].sort(),
    }),
    ...(descriptor.glossaryTerms && descriptor.glossaryTerms.length > 0 && {
      glossaryTerms: [...descriptor.glossaryTerms].sort(),
    }),
  };

  return JSON.stringify(canonical, Object.keys(canonical).sort());
}

/**
 * Compare two asset descriptors for equality via fingerprint
 * Ignores field order and array order
 */
export function descriptorsEqual(a: AssetDescriptor, b: AssetDescriptor): boolean {
  return assetFingerprint(a) === assetFingerprint(b);
}
