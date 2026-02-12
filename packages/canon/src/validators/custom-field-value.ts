import type { DataType } from '../enums/data-types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export interface FieldValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFieldValue(
  dataType: DataType,
  typeConfig: Record<string, unknown>,
  value: unknown,
): FieldValidationResult {
  if (value === null || value === undefined) {
    return { valid: true };
  }

  switch (dataType) {
    case 'short_text': {
      if (typeof value !== 'string') return { valid: false, error: 'Expected string' };
      const maxLen = (typeConfig.maxLength as number) ?? 255;
      if (value.length > maxLen)
        return { valid: false, error: `Exceeds max length ${maxLen}` };
      return { valid: true };
    }

    case 'long_text': {
      if (typeof value !== 'string') return { valid: false, error: 'Expected string' };
      const maxLen = typeConfig.maxLength as number | undefined;
      if (maxLen !== undefined && value.length > maxLen)
        return { valid: false, error: `Exceeds max length ${maxLen}` };
      return { valid: true };
    }

    case 'integer': {
      if (typeof value !== 'number' || !Number.isInteger(value))
        return { valid: false, error: 'Expected integer' };
      const min = typeConfig.min as number | undefined;
      const max = typeConfig.max as number | undefined;
      if (min !== undefined && value < min)
        return { valid: false, error: `Below minimum ${min}` };
      if (max !== undefined && value > max)
        return { valid: false, error: `Above maximum ${max}` };
      return { valid: true };
    }

    case 'decimal': {
      if (typeof value !== 'number' || !Number.isFinite(value))
        return { valid: false, error: 'Expected finite number' };
      return { valid: true };
    }

    case 'money': {
      if (typeof value !== 'number' || !Number.isInteger(value))
        return { valid: false, error: 'Expected integer (minor units)' };
      return { valid: true };
    }

    case 'boolean': {
      if (typeof value !== 'boolean') return { valid: false, error: 'Expected boolean' };
      return { valid: true };
    }

    case 'date': {
      if (typeof value !== 'string' || !ISO_DATE_REGEX.test(value))
        return { valid: false, error: 'Expected ISO date (YYYY-MM-DD)' };
      return { valid: true };
    }

    case 'datetime': {
      if (typeof value !== 'string') return { valid: false, error: 'Expected ISO datetime string' };
      const d = new Date(value);
      if (isNaN(d.getTime())) return { valid: false, error: 'Invalid datetime' };
      return { valid: true };
    }

    case 'enum': {
      if (typeof value !== 'string') return { valid: false, error: 'Expected string' };
      const choices = typeConfig.choices as string[] | undefined;
      if (choices && !choices.includes(value))
        return { valid: false, error: `Value not in choices: ${choices.join(', ')}` };
      return { valid: true };
    }

    case 'multi_enum': {
      if (!Array.isArray(value)) return { valid: false, error: 'Expected array' };
      const choices = typeConfig.choices as string[] | undefined;
      const maxSel = typeConfig.maxSelections as number | undefined;
      if (maxSel !== undefined && value.length > maxSel)
        return { valid: false, error: `Exceeds max selections ${maxSel}` };
      for (const item of value) {
        if (typeof item !== 'string')
          return { valid: false, error: 'Array items must be strings' };
        if (choices && !choices.includes(item))
          return { valid: false, error: `Value "${item}" not in choices` };
      }
      return { valid: true };
    }

    case 'email': {
      if (typeof value !== 'string') return { valid: false, error: 'Expected string' };
      if (!EMAIL_REGEX.test(value)) return { valid: false, error: 'Invalid email format' };
      return { valid: true };
    }

    case 'phone': {
      if (typeof value !== 'string') return { valid: false, error: 'Expected string' };
      if (value.length === 0) return { valid: false, error: 'Phone cannot be empty' };
      return { valid: true };
    }

    case 'url': {
      if (typeof value !== 'string') return { valid: false, error: 'Expected string' };
      if (!value.startsWith('http://') && !value.startsWith('https://'))
        return { valid: false, error: 'URL must start with http:// or https://' };
      return { valid: true };
    }

    case 'entity_ref': {
      if (typeof value !== 'string') return { valid: false, error: 'Expected UUID string' };
      if (!UUID_REGEX.test(value)) return { valid: false, error: 'Invalid UUID format' };
      return { valid: true };
    }

    case 'json': {
      if (typeof value !== 'object' || value === null || Array.isArray(value))
        return { valid: false, error: 'Expected object' };
      return { valid: true };
    }

    default:
      return { valid: false, error: `Unknown data type: ${dataType as string}` };
  }
}

export const DATA_TYPE_VALUE_COLUMN_MAP: Record<DataType, string> = {
  short_text: 'value_text',
  long_text: 'value_text',
  integer: 'value_int',
  decimal: 'value_numeric',
  money: 'value_int',
  boolean: 'value_bool',
  date: 'value_date',
  datetime: 'value_ts',
  enum: 'value_text',
  multi_enum: 'value_json',
  email: 'value_text',
  phone: 'value_text',
  url: 'value_text',
  entity_ref: 'value_uuid',
  json: 'value_json',
};
