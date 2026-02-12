import {
  validateFieldValue,
  validateTypeConfig,
  DATA_TYPE_VALUE_COLUMN_MAP,
} from 'afena-canon';
import { db, dbRo, customFields } from 'afena-database';
import { eq, and } from 'drizzle-orm';

import type { DataType } from 'afena-canon';
import type { DbInstance } from 'afena-database';

export interface CustomFieldDef {
  id: string;
  orgId: string;
  entityType: string;
  fieldName: string;
  fieldType: string;
  typeConfig: Record<string, unknown>;
  isRequired: boolean;
  defaultValue: unknown;
  storageMode: string;
}

export interface ValidationError {
  fieldName: string;
  fieldId: string;
  error: string;
}

/**
 * Load active custom field definitions for an entity type.
 * Uses RO compute by default.
 */
export async function loadFieldDefs(
  orgId: string,
  entityType: string,
  options?: { forcePrimary?: boolean },
): Promise<CustomFieldDef[]> {
  const conn: DbInstance = options?.forcePrimary ? db : dbRo;
  const rows = await conn
    .select()
    .from(customFields)
    .where(
      and(
        eq(customFields.orgId, orgId),
        eq(customFields.entityType, entityType),
        eq(customFields.isActive, true),
        eq(customFields.isDeprecated, false),
      ),
    );

  return rows.map((r) => ({
    id: r.id,
    orgId: r.orgId,
    entityType: r.entityType,
    fieldName: r.fieldName,
    fieldType: r.fieldType,
    typeConfig: (r.typeConfig ?? {}) as Record<string, unknown>,
    isRequired: r.isRequired,
    defaultValue: r.defaultValue,
    storageMode: r.storageMode,
  }));
}

/**
 * Validate a custom_data blob against the field definitions.
 * Returns an array of validation errors (empty = valid).
 */
export function validateCustomData(
  fieldDefs: CustomFieldDef[],
  customData: Record<string, unknown>,
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const def of fieldDefs) {
    const value = customData[def.fieldName];

    // Required check
    if (def.isRequired && (value === undefined || value === null)) {
      errors.push({
        fieldName: def.fieldName,
        fieldId: def.id,
        error: `Field "${def.fieldName}" is required`,
      });
      continue;
    }

    // Skip validation if value is absent and not required
    if (value === undefined || value === null) continue;

    // Type config validation (one-time, should be done on field creation)
    const configResult = validateTypeConfig(def.fieldType as DataType, def.typeConfig);
    if (!configResult.valid) {
      errors.push({
        fieldName: def.fieldName,
        fieldId: def.id,
        error: `Invalid type_config: ${configResult.error}`,
      });
      continue;
    }

    // Value validation
    const valueResult = validateFieldValue(
      def.fieldType as DataType,
      def.typeConfig,
      value,
    );
    if (!valueResult.valid) {
      errors.push({
        fieldName: def.fieldName,
        fieldId: def.id,
        error: valueResult.error ?? 'Invalid value',
      });
    }
  }

  return errors;
}

/**
 * Determine which typed column to use for a given data type.
 */
export function getValueColumn(dataType: DataType): string {
  return DATA_TYPE_VALUE_COLUMN_MAP[dataType];
}

/**
 * Compute schema_hash for a custom field definition.
 * Deterministic hash of (fieldType + typeConfig + isRequired + isUnique + storageMode).
 * PRD: schema_hash tracks {field_type, type_config, is_required, is_unique, storage_mode}.
 */
export function computeSchemaHash(
  fieldType: string,
  typeConfig: Record<string, unknown>,
  storageMode: string,
  isRequired?: boolean,
  isUnique?: boolean,
): string {
  const payload = JSON.stringify({
    fieldType,
    typeConfig,
    isRequired: isRequired ?? false,
    isUnique: isUnique ?? false,
    storageMode,
  });
  // Simple djb2 hash — sufficient for drift detection
  let hash = 5381;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash + payload.charCodeAt(i)) | 0;
  }
  return `djb2:${(hash >>> 0).toString(16)}`;
}
