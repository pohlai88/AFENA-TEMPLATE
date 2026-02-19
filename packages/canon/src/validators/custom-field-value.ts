/**
 * Legacy Custom Field Value Validator
 * 
 * @deprecated Use validateCustomFieldValue() from presets/custom-field-value for new code.
 * This adapter preserves the legacy API for backward compatibility.
 * 
 * Migration path:
 * 1. Update imports to use new validators from presets
 * 2. Use structured ValidationResult instead of FieldValidationResult
 * 3. Remove this adapter after 2 release cycles
 */

import type { DataType } from '../enums/data-types';
import { validateCustomFieldValue as validateCustomFieldValueNew } from './presets/custom-field-value';

/**
 * @deprecated Use ValidationResult from core/types instead
 */
export interface FieldValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * @deprecated Use validateCustomFieldValue() from presets/custom-field-value for new code.
 * 
 * Legacy validator that wraps the new validation system.
 * Returns simple valid/error result for backward compatibility.
 */
export function validateFieldValue(
  dataType: DataType,
  typeConfig: Record<string, unknown>,
  value: unknown,
): FieldValidationResult {
  const context = {
    entityType: 'unknown' as const,
    fieldPath: [],
    mode: 'create' as const,
  };

  const result = validateCustomFieldValueNew(dataType, typeConfig, value, context);

  if (result.ok) {
    return { valid: true };
  }

  const errorCode = result.issues[0]?.code;
  return {
    valid: false,
    ...(errorCode && { error: errorCode }),
  };
}

/**
 * @deprecated Use DATA_TYPE_VALUE_COLUMN_MAP from presets/custom-field-value.storage instead
 * 
 * Keep column mapping export for backward compatibility.
 */
export { DATA_TYPE_VALUE_COLUMN_MAP } from './presets/custom-field-value.storage';

