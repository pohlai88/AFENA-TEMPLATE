/**
 * Custom Field Value Validators
 * 
 * Composed validators for all 22 data types with frozen registry.
 * Enables introspection and coverage checks (VAL-06).
 */

import type { DataType } from '../../enums/data-types';
import { VAL_CODES } from '../core/codes';
import { optional, pipe } from '../core/compose';
import { issue } from '../core/issue';
import type { ValidationContext, ValidationResult, Validator } from '../core/types';
import { allInChoices, inChoices, maxSelections } from '../rules/enum';
import { jsonSerializable } from '../rules/json';
import { finite, integer, isNumber, max, min } from '../rules/number';
import { uuidFormat } from '../rules/reference';
import { emailFormat, isString, maxLength, urlFormat } from '../rules/string';
import { isoDate, isoDatetime } from '../rules/temporal';

/**
 * Frozen registry of validators for all 22 data types.
 * Enables introspection and coverage checks (VAL-06).
 */
export const CUSTOM_FIELD_VALIDATORS: Readonly<Record<DataType, (config: Record<string, unknown>) => Validator<unknown>>> = Object.freeze({
  short_text: (config) => pipe(
    isString(),
    maxLength((config.maxLength as number) ?? 255),
  ),

  long_text: (config) => config.maxLength
    ? pipe(isString(), maxLength(config.maxLength as number))
    : isString(),

  integer: (config) => {
    const validators: Validator<unknown>[] = [isNumber(), integer()];
    if (config.min !== undefined) validators.push(min(config.min as number));
    if (config.max !== undefined) validators.push(max(config.max as number));
    return pipe(...validators);
  },

  decimal: () => pipe(isNumber(), finite()),

  money: () => pipe(isNumber(), integer()),

  email: () => pipe(isString(), emailFormat()),

  url: () => pipe(isString(), urlFormat()),

  entity_ref: () => pipe(isString(), uuidFormat()),

  date: () => pipe(isString(), isoDate()),

  datetime: () => pipe(isString(), isoDatetime()),

  json: () => jsonSerializable(),

  boolean: () => (value, context) => {
    if (typeof value !== 'boolean') {
      return { ok: false, issues: [issue(VAL_CODES.TYPE_MISMATCH, context, { expected: 'boolean', actual: typeof value })] };
    }
    return { ok: true, value };
  },

  phone: () => isString(),

  enum: (config) => config.choices
    ? pipe(isString(), inChoices(config.choices as string[]))
    : isString(),

  multi_enum: (config) => {
    const validators: Validator<unknown>[] = [];
    if (config.choices) validators.push(allInChoices(config.choices as string[]));
    if (config.maxSelections) validators.push(maxSelections(config.maxSelections as number));
    return validators.length > 0 ? pipe(...validators) : (value) => ({ ok: true, value });
  },

  single_select: (config) => config.choices
    ? pipe(isString(), inChoices(config.choices as string[]))
    : isString(),

  multi_select: (config) => {
    const validators: Validator<unknown>[] = [];
    if (config.choices) validators.push(allInChoices(config.choices as string[]));
    if (config.maxSelections) validators.push(maxSelections(config.maxSelections as number));
    return validators.length > 0 ? pipe(...validators) : (value) => ({ ok: true, value });
  },

  rich_text: (config) => config.maxLength
    ? pipe(isString(), maxLength(config.maxLength as number))
    : isString(),

  currency: () => pipe(isNumber(), finite()),

  formula: () => (value) => ({ ok: true, value }),

  relation: () => pipe(isString(), uuidFormat()),

  binary: () => (value, context) => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [issue(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }
    return { ok: true, value };
  },

  file: () => (value, context) => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [issue(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }
    return { ok: true, value };
  },
});

/**
 * Get validator for a data type with config.
 */
export function getFieldValidator(
  dataType: DataType,
  typeConfig: Record<string, unknown>,
): Validator<unknown> {
  const factory = CUSTOM_FIELD_VALIDATORS[dataType];
  if (!factory) {
    return (_value, context) => ({
      ok: false,
      issues: [issue(VAL_CODES.UNKNOWN_DATA_TYPE, context, { dataType })],
    });
  }
  return factory(typeConfig);
}

/**
 * Validate custom field value with normalization.
 */
export function validateCustomFieldValue(
  dataType: DataType,
  typeConfig: Record<string, unknown>,
  value: unknown,
  context: ValidationContext,
): ValidationResult<unknown> {
  const validator = optional(getFieldValidator(dataType, typeConfig));
  return validator(value, context);
}
