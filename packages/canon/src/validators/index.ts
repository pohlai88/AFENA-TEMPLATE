/**
 * Canon Validators Module
 * 
 * Pure functional validation with structured error reporting.
 * All validators are deterministic and side-effect free.
 */

// Core primitives
export type {
  ValidationSeverity,
  ValidationIssue,
  ValidationResult,
  ValidationContext,
  Validator,
  NormalizingValidator,
} from './core/types';

export {
  isOk,
  isError,
  unwrap,
  unwrapOr,
} from './core/types';

export {
  VAL_CODES,
  type ValidationCode,
  isValidationCode,
} from './core/codes';

export {
  issue,
  error,
  warn,
  ok,
  fail,
} from './core/issue';

export {
  pipe,
  all,
  any,
  optional,
  when,
  transform,
  withPath,
} from './core/compose';

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
} from './core/normalize';

// Validation rules
export {
  minLength,
  maxLength,
  pattern,
  ascii,
  slug,
  emailFormat,
  urlFormat,
  phoneFormat,
  notEmpty,
  isString,
} from './rules/string';

export {
  min,
  max,
  integer,
  precision,
  scale,
  positive,
  nonNegative,
  finite,
  isNumber,
} from './rules/number';

export {
  isoDate,
  isoDatetime,
  dateRange,
  pastDate,
  futureDate,
} from './rules/temporal';

export {
  inChoices,
  maxSelections,
  minSelections,
  allInChoices,
  uniqueItems,
} from './rules/enum';

export {
  uuidFormat,
  entityRefFormat,
  uuidArray,
  jsonSerializable,
  plainObject,
  isArray,
} from './rules/reference';

// Composed presets
export {
  CUSTOM_FIELD_VALIDATORS,
  getFieldValidator,
  validateCustomFieldValue,
} from './presets/custom-field-value';
