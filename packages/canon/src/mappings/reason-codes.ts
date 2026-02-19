/**
 * Mapping Reason Codes
 *
 * Structured reason codes for type mapping operations.
 * Used for telemetry aggregation and audit trails.
 */

/**
 * Reason codes for type mapping operations
 * Exactly one primary classification code required per result
 */
export type MappingReasonCode =
  // Primary classification (exactly one required)
  | 'EXACT_MATCH'
  | 'SEMANTIC_EQUIV'
  | 'NARROWING_WITH_METADATA'
  | 'LOSSY_FALLBACK'
  // PostgreSQL-specific
  | 'UNKNOWN_PG_TYPE'
  | 'DOMAIN_TYPE_DETECTED'
  | 'COMPOSITE_TYPE_DETECTED'
  | 'ARRAY_TYPE_DETECTED'
  | 'PG_ALIAS_NORMALIZED' // int4 → integer
  // CSV-specific
  | 'CSV_HINT_MATCH'
  | 'CSV_HINT_CONFLICT'
  | 'MOSTLY_EMPTY'
  | 'LOW_DISTINCT_VALUES' // Enum candidate
  | 'HIGH_DISTINCT_VALUES' // Text candidate
  // Custom registry
  | 'CUSTOM_MAPPING';

/**
 * Primary classification codes (exactly one required per result)
 */
export type PrimaryReasonCode =
  | 'EXACT_MATCH'
  | 'SEMANTIC_EQUIV'
  | 'NARROWING_WITH_METADATA'
  | 'LOSSY_FALLBACK';

/**
 * Build deterministic reason code arrays
 * Ensures stable ordering and deduplication
 *
 * @param opts.primary - Primary classification (required)
 * @param opts.flags - Additional context flags (optional)
 * @returns Deterministically ordered reason code array
 */
export function buildReasonCodes(opts: {
  primary: PrimaryReasonCode;
  flags?: MappingReasonCode[];
}): MappingReasonCode[] {
  const codes: MappingReasonCode[] = [opts.primary];
  
  if (opts.flags && opts.flags.length > 0) {
    // Deduplicate and sort flags alphabetically for determinism
    const uniqueFlags = [...new Set(opts.flags)].sort();
    codes.push(...uniqueFlags);
  }
  
  return codes;
}
