/**
 * Validator Core Module
 * 
 * Pure functional validation primitives with structured error reporting.
 */

// Types
export type {
  ValidationSeverity,
  ValidationIssue,
  ValidationResult,
  ValidationContext,
  Validator,
  NormalizingValidator,
} from './types';

export {
  isOk,
  isError,
  unwrap,
  unwrapOr,
} from './types';

// Error Codes
export {
  VAL_CODES,
  type ValidationCode,
  isValidationCode,
} from './codes';

// Issue Builder
export {
  issue,
  error,
  warn,
  ok,
  fail,
} from './issue';

// Composition
export {
  pipe,
  all,
  any,
  optional,
  when,
  transform,
  withPath,
} from './compose';

// Normalization
export {
  trimWhitespace,
  collapseWhitespace,
  lowercase,
  uppercase,
  toSlug,
  normalizeEmail,
  normalizePhone,
  normalizeUrl,
  normalizeNumber,
  normalizeBoolean,
  normalizeDate,
  normalizeDatetime,
  normalizer,
} from './normalize';
