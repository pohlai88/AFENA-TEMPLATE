/**
 * Validation Rules Module
 * 
 * Pure functional validation rules for common constraints.
 */

// String rules
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
} from './string';

// Number rules
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
} from './number';

// Temporal rules
export {
  isoDate,
  isoDatetime,
  dateRange,
  pastDate,
  futureDate,
} from './temporal';

// Enum rules
export {
  inChoices,
  maxSelections,
  minSelections,
  allInChoices,
  uniqueItems,
} from './enum';

// Reference rules
export {
  uuidFormat,
  entityRefFormat,
  uuidArray,
  jsonSerializable,
  plainObject,
  isArray,
} from './reference';
