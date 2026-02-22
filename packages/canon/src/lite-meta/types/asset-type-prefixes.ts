/**
 * Asset Type Prefix Mapping (Canon Constant)
 * 
 * Single source of truth for mapping asset types to their canonical key prefixes.
 * Used for cross-field validation in lite-meta schemas.
 */

import type { MetaAssetType } from '../../enums/meta-asset-type';

/**
 * Canonical mapping of asset types to their allowed key prefixes
 * 
 * Each asset type has one or more valid prefixes that must appear
 * at the start of the asset key.
 */
export const ASSET_TYPE_PREFIXES = {
  table: ['db.rec'],
  column: ['db.field'],
  business_object: ['db.bo'],
  view: ['db.view'],
  pipeline: ['db.pipe'],
  report: ['db.report'],
  api: ['db.api'],
  policy: ['db.policy'],
  metric: ['metric:'],
} as const satisfies Record<MetaAssetType, readonly string[]>;

// Runtime validation (dev-only)
if (process.env.NODE_ENV !== 'production') {
  // Check for duplicate prefixes across types
  const allPrefixes = Object.values(ASSET_TYPE_PREFIXES).flat();
  const uniquePrefixes = new Set(allPrefixes);
  
  if (allPrefixes.length !== uniquePrefixes.size) {
    const duplicates: string[] = [];
    const seen = new Set<string>();
    
    for (const prefix of allPrefixes) {
      if (seen.has(prefix)) {
        duplicates.push(prefix);
      }
      seen.add(prefix);
    }
    
    throw new Error(
      `ASSET_TYPE_PREFIXES contains duplicate prefixes: ${duplicates.join(', ')}`
    );
  }
}
