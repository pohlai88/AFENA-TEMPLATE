/**
 * Standardized Schema Error Codes
 * 
 * All custom validation errors use these codes for consistency.
 * Prefixed with CANON_ to avoid conflicts with application error codes.
 * 
 * @module schemas/error-codes
 */

/**
 * Schema validation error codes
 * 
 * Organized by category for easy discovery:
 * - Data Types: Field configuration validation
 * - Audit: Audit log invariants
 * - Meta: Metadata and asset key validation
 * - JSON: JSON structure validation
 * - Selection: Multi-select and enum validation
 */
export const SCHEMA_ERROR_CODES = {
  // ── Data Type Validation ──────────────────────────────────
  /** Decimal scale exceeds precision (scale must be <= precision) */
  DECIMAL_SCALE_GT_PRECISION: 'CANON_DECIMAL_SCALE_GT_PRECISION',
  
  /** Integer min >= max (min must be < max) */
  INTEGER_MIN_GTE_MAX: 'CANON_INTEGER_MIN_GTE_MAX',
  
  /** Date minDate >= maxDate (minDate must be < maxDate) */
  DATE_MIN_GTE_MAX: 'CANON_DATE_MIN_GTE_MAX',
  
  // ── Audit Validation ──────────────────────────────────────
  /** Version regression detected (versionAfter must be > versionBefore) */
  AUDIT_VERSION_REGRESSION: 'CANON_AUDIT_VERSION_REGRESSION',
  
  // ── Metadata Validation ───────────────────────────────────
  /** Asset key prefix doesn't match asset type */
  META_PREFIX_MISMATCH: 'CANON_META_PREFIX_MISMATCH',
  
  // ── JSON Validation ───────────────────────────────────────
  /** JSON nesting depth exceeds limit (max: 32 levels) */
  JSON_DEPTH_EXCEEDED: 'CANON_JSON_DEPTH_EXCEEDED',
  
  // ── Selection Validation ──────────────────────────────────
  /** Multi-enum maxSelections exceeds choices length */
  MULTIENUM_MAX_GT_CHOICES: 'CANON_MULTIENUM_MAX_GT_CHOICES',
  
  /** Multi-select maxSelections exceeds choices length */
  MULTISELECT_MAX_GT_CHOICES: 'CANON_MULTISELECT_MAX_GT_CHOICES',
} as const;

/**
 * Type-safe schema error code
 * 
 * Use this type for error handling and logging.
 */
export type SchemaErrorCode = typeof SCHEMA_ERROR_CODES[keyof typeof SCHEMA_ERROR_CODES];

/**
 * Check if a string is a valid schema error code
 * 
 * @param code - String to check
 * @returns True if code is a valid SchemaErrorCode
 */
export function isSchemaErrorCode(code: string): code is SchemaErrorCode {
  return Object.values(SCHEMA_ERROR_CODES).includes(code as SchemaErrorCode);
}
