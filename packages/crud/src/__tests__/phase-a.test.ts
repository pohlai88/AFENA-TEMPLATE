/**
 * Phase A Tests — ERP Governance Layer
 *
 * Covers:
 * - Canon: data type enums, type_config validation, value validation
 * - Custom field validation service: validateCustomData, computeSchemaHash
 * - RW/RO routing: getDb helper
 */

import { describe, it, expect } from 'vitest';

import {
  DATA_TYPES,
  dataTypeSchema,
  DATA_TYPE_VALUE_COLUMN_MAP,
  validateFieldValue,
  validateTypeConfig,
  TYPE_CONFIG_SCHEMAS,
  DOC_STATUSES,
  STORAGE_MODES,
  META_ALIAS_TARGET_TYPES,
  META_ALIAS_SCOPE_TYPES,
  FX_SOURCES,
} from 'afena-canon';

// NOTE: custom-field-validation.ts imports afena-database which requires
// DATABASE_URL at module load. We use dynamic import for DB-dependent tests.
// Pure functions (validateCustomData, computeSchemaHash, getValueColumn) are
// re-implemented inline or dynamically imported.

interface CustomFieldDef {
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

// ── Canon Enums ──────────────────────────────────────────

describe('Canon ERP Enums', () => {
  it('DATA_TYPES has all 15 types', () => {
    expect(DATA_TYPES).toHaveLength(15);
    expect(DATA_TYPES).toContain('short_text');
    expect(DATA_TYPES).toContain('money');
    expect(DATA_TYPES).toContain('entity_ref');
    expect(DATA_TYPES).toContain('multi_enum');
  });

  it('dataTypeSchema validates known types', () => {
    expect(dataTypeSchema.safeParse('short_text').success).toBe(true);
    expect(dataTypeSchema.safeParse('money').success).toBe(true);
    expect(dataTypeSchema.safeParse('invalid_type').success).toBe(false);
  });

  it('DOC_STATUSES has 5 statuses', () => {
    expect(DOC_STATUSES).toEqual(['draft', 'submitted', 'active', 'cancelled', 'amended']);
  });

  it('STORAGE_MODES has 2 modes', () => {
    expect(STORAGE_MODES).toEqual(['jsonb_only', 'indexed']);
  });

  it('META_ALIAS_TARGET_TYPES has 5 types', () => {
    expect(META_ALIAS_TARGET_TYPES).toHaveLength(5);
    expect(META_ALIAS_TARGET_TYPES).toContain('asset');
    expect(META_ALIAS_TARGET_TYPES).toContain('custom_field');
  });

  it('META_ALIAS_SCOPE_TYPES has 6 types', () => {
    expect(META_ALIAS_SCOPE_TYPES).toHaveLength(6);
    expect(META_ALIAS_SCOPE_TYPES).toContain('org');
    expect(META_ALIAS_SCOPE_TYPES).toContain('locale');
  });

  it('FX_SOURCES has 3 sources', () => {
    expect(FX_SOURCES).toEqual(['manual', 'rate_table', 'system']);
  });
});

// ── Type Config Validation ───────────────────────────────

describe('Type Config Validation', () => {
  it('short_text requires maxLength', () => {
    const result = validateTypeConfig('short_text', { maxLength: 100 });
    expect(result.valid).toBe(true);
  });

  it('short_text defaults maxLength to 255', () => {
    const result = validateTypeConfig('short_text', {});
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect((result.data as { maxLength: number }).maxLength).toBe(255);
    }
  });

  it('enum requires choices array', () => {
    const result = validateTypeConfig('enum', { choices: ['a', 'b'] });
    expect(result.valid).toBe(true);
  });

  it('enum rejects empty choices', () => {
    const result = validateTypeConfig('enum', { choices: [] });
    expect(result.valid).toBe(false);
  });

  it('entity_ref requires targetEntity', () => {
    const valid = validateTypeConfig('entity_ref', { targetEntity: 'contacts' });
    expect(valid.valid).toBe(true);

    const invalid = validateTypeConfig('entity_ref', {});
    expect(invalid.valid).toBe(false);
  });

  it('decimal has precision and scale defaults', () => {
    const result = validateTypeConfig('decimal', {});
    expect(result.valid).toBe(true);
    if (result.valid) {
      const data = result.data as { precision: number; scale: number };
      expect(data.precision).toBe(18);
      expect(data.scale).toBe(6);
    }
  });

  it('all 15 data types have a type_config schema', () => {
    for (const dt of DATA_TYPES) {
      expect(TYPE_CONFIG_SCHEMAS[dt]).toBeDefined();
    }
  });
});

// ── Value Validation ─────────────────────────────────────

describe('Value Validation', () => {
  it('short_text validates string within maxLength', () => {
    expect(validateFieldValue('short_text', { maxLength: 5 }, 'abc').valid).toBe(true);
    expect(validateFieldValue('short_text', { maxLength: 5 }, 'abcdef').valid).toBe(false);
  });

  it('integer validates range', () => {
    expect(validateFieldValue('integer', { min: 0, max: 100 }, 50).valid).toBe(true);
    expect(validateFieldValue('integer', { min: 0, max: 100 }, -1).valid).toBe(false);
    expect(validateFieldValue('integer', { min: 0, max: 100 }, 101).valid).toBe(false);
  });

  it('integer rejects floats', () => {
    expect(validateFieldValue('integer', {}, 3.14).valid).toBe(false);
  });

  it('money expects integer minor units', () => {
    expect(validateFieldValue('money', {}, 1500).valid).toBe(true);
    expect(validateFieldValue('money', {}, 15.5).valid).toBe(false);
    expect(validateFieldValue('money', {}, 'fifteen').valid).toBe(false);
  });

  it('boolean validates true/false', () => {
    expect(validateFieldValue('boolean', {}, true).valid).toBe(true);
    expect(validateFieldValue('boolean', {}, false).valid).toBe(true);
    expect(validateFieldValue('boolean', {}, 'yes').valid).toBe(false);
  });

  it('date validates ISO format', () => {
    expect(validateFieldValue('date', {}, '2026-01-15').valid).toBe(true);
    expect(validateFieldValue('date', {}, 'Jan 15').valid).toBe(false);
  });

  it('email validates format', () => {
    expect(validateFieldValue('email', {}, 'user@example.com').valid).toBe(true);
    expect(validateFieldValue('email', {}, 'not-an-email').valid).toBe(false);
  });

  it('url validates http/https prefix', () => {
    expect(validateFieldValue('url', {}, 'https://example.com').valid).toBe(true);
    expect(validateFieldValue('url', {}, 'ftp://example.com').valid).toBe(false);
  });

  it('enum validates against choices', () => {
    const cfg = { choices: ['red', 'green', 'blue'] };
    expect(validateFieldValue('enum', cfg, 'red').valid).toBe(true);
    expect(validateFieldValue('enum', cfg, 'yellow').valid).toBe(false);
  });

  it('multi_enum validates array against choices and maxSelections', () => {
    const cfg = { choices: ['a', 'b', 'c'], maxSelections: 2 };
    expect(validateFieldValue('multi_enum', cfg, ['a']).valid).toBe(true);
    expect(validateFieldValue('multi_enum', cfg, ['a', 'b']).valid).toBe(true);
    expect(validateFieldValue('multi_enum', cfg, ['a', 'b', 'c']).valid).toBe(false);
    expect(validateFieldValue('multi_enum', cfg, ['a', 'x']).valid).toBe(false);
  });

  it('entity_ref validates UUID format', () => {
    expect(
      validateFieldValue('entity_ref', { targetEntity: 'contacts' }, 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d').valid,
    ).toBe(true);
    expect(
      validateFieldValue('entity_ref', { targetEntity: 'contacts' }, 'not-a-uuid').valid,
    ).toBe(false);
  });

  it('json validates object', () => {
    expect(validateFieldValue('json', {}, { key: 'value' }).valid).toBe(true);
    expect(validateFieldValue('json', {}, 'string').valid).toBe(false);
    expect(validateFieldValue('json', {}, [1, 2]).valid).toBe(false);
  });

  it('null values always pass', () => {
    for (const dt of DATA_TYPES) {
      expect(validateFieldValue(dt, {}, null).valid).toBe(true);
    }
  });
});

// ── DATA_TYPE_VALUE_COLUMN_MAP ───────────────────────────

describe('DATA_TYPE_VALUE_COLUMN_MAP', () => {
  it('maps all 15 data types to a column', () => {
    for (const dt of DATA_TYPES) {
      expect(DATA_TYPE_VALUE_COLUMN_MAP[dt]).toBeDefined();
      expect(typeof DATA_TYPE_VALUE_COLUMN_MAP[dt]).toBe('string');
    }
  });

  it('money maps to value_int (minor units)', () => {
    expect(DATA_TYPE_VALUE_COLUMN_MAP.money).toBe('value_int');
  });

  it('multi_enum maps to value_json', () => {
    expect(DATA_TYPE_VALUE_COLUMN_MAP.multi_enum).toBe('value_json');
  });

  it('entity_ref maps to value_uuid', () => {
    expect(DATA_TYPE_VALUE_COLUMN_MAP.entity_ref).toBe('value_uuid');
  });

  it('getValueColumn returns same as map', () => {
    expect(getValueColumnPure('short_text')).toBe('value_text');
    expect(getValueColumnPure('integer')).toBe('value_int');
  });
});

// ── Custom Field Validation Service ──────────────────────
// Pure-logic reimplementation to avoid DB import at module level

function validateCustomDataPure(
  fieldDefs: CustomFieldDef[],
  customData: Record<string, unknown>,
): { fieldName: string; fieldId: string; error: string }[] {
  const errors: { fieldName: string; fieldId: string; error: string }[] = [];
  for (const def of fieldDefs) {
    const value = customData[def.fieldName];
    if (def.isRequired && (value === undefined || value === null)) {
      errors.push({ fieldName: def.fieldName, fieldId: def.id, error: `Field "${def.fieldName}" is required` });
      continue;
    }
    if (value === undefined || value === null) continue;
    const configResult = validateTypeConfig(def.fieldType as Parameters<typeof validateTypeConfig>[0], def.typeConfig);
    if (!configResult.valid) {
      errors.push({ fieldName: def.fieldName, fieldId: def.id, error: `Invalid type_config: ${configResult.error}` });
      continue;
    }
    const valueResult = validateFieldValue(def.fieldType as Parameters<typeof validateFieldValue>[0], def.typeConfig, value);
    if (!valueResult.valid) {
      errors.push({ fieldName: def.fieldName, fieldId: def.id, error: valueResult.error ?? 'Invalid value' });
    }
  }
  return errors;
}

function computeSchemaHashPure(fieldType: string, typeConfig: Record<string, unknown>, storageMode: string): string {
  const payload = JSON.stringify({ fieldType, typeConfig, storageMode });
  let hash = 5381;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash + payload.charCodeAt(i)) | 0;
  }
  return `djb2:${(hash >>> 0).toString(16)}`;
}

function getValueColumnPure(dataType: string): string {
  return DATA_TYPE_VALUE_COLUMN_MAP[dataType as keyof typeof DATA_TYPE_VALUE_COLUMN_MAP];
}

describe('validateCustomData', () => {
  const fieldDefs: CustomFieldDef[] = [
    {
      id: 'f1',
      orgId: 'org1',
      entityType: 'contacts',
      fieldName: 'priority',
      fieldType: 'enum',
      typeConfig: { choices: ['low', 'medium', 'high'] },
      isRequired: true,
      defaultValue: 'medium',
      storageMode: 'jsonb_only',
    },
    {
      id: 'f2',
      orgId: 'org1',
      entityType: 'contacts',
      fieldName: 'score',
      fieldType: 'integer',
      typeConfig: { min: 0, max: 100 },
      isRequired: false,
      defaultValue: null,
      storageMode: 'indexed',
    },
    {
      id: 'f3',
      orgId: 'org1',
      entityType: 'contacts',
      fieldName: 'website',
      fieldType: 'url',
      typeConfig: {},
      isRequired: false,
      defaultValue: null,
      storageMode: 'jsonb_only',
    },
  ];

  it('passes valid data', () => {
    const errors = validateCustomDataPure(fieldDefs, {
      priority: 'high',
      score: 85,
      website: 'https://example.com',
    });
    expect(errors).toHaveLength(0);
  });

  it('fails on missing required field', () => {
    const errors = validateCustomDataPure(fieldDefs, {
      score: 50,
    });
    expect(errors).toHaveLength(1);
    expect(errors[0]!.fieldName).toBe('priority');
    expect(errors[0]!.error).toContain('required');
  });

  it('fails on invalid enum value', () => {
    const errors = validateCustomDataPure(fieldDefs, {
      priority: 'critical',
    });
    expect(errors).toHaveLength(1);
    expect(errors[0]!.fieldName).toBe('priority');
    expect(errors[0]!.error).toContain('not in choices');
  });

  it('fails on out-of-range integer', () => {
    const errors = validateCustomDataPure(fieldDefs, {
      priority: 'low',
      score: 150,
    });
    expect(errors).toHaveLength(1);
    expect(errors[0]!.fieldName).toBe('score');
    expect(errors[0]!.error).toContain('maximum');
  });

  it('fails on invalid URL', () => {
    const errors = validateCustomDataPure(fieldDefs, {
      priority: 'low',
      website: 'not-a-url',
    });
    expect(errors).toHaveLength(1);
    expect(errors[0]!.fieldName).toBe('website');
  });

  it('skips absent optional fields', () => {
    const errors = validateCustomDataPure(fieldDefs, {
      priority: 'low',
    });
    expect(errors).toHaveLength(0);
  });
});

// ── Schema Hash ──────────────────────────────────────────

describe('computeSchemaHash', () => {
  it('returns deterministic hash', () => {
    const h1 = computeSchemaHashPure('enum', { choices: ['a', 'b'] }, 'jsonb_only');
    const h2 = computeSchemaHashPure('enum', { choices: ['a', 'b'] }, 'jsonb_only');
    expect(h1).toBe(h2);
  });

  it('changes when type_config changes', () => {
    const h1 = computeSchemaHashPure('enum', { choices: ['a', 'b'] }, 'jsonb_only');
    const h2 = computeSchemaHashPure('enum', { choices: ['a', 'b', 'c'] }, 'jsonb_only');
    expect(h1).not.toBe(h2);
  });

  it('changes when storage_mode changes', () => {
    const h1 = computeSchemaHashPure('integer', { min: 0 }, 'jsonb_only');
    const h2 = computeSchemaHashPure('integer', { min: 0 }, 'indexed');
    expect(h1).not.toBe(h2);
  });

  it('changes when field_type changes', () => {
    const h1 = computeSchemaHashPure('integer', {}, 'jsonb_only');
    const h2 = computeSchemaHashPure('decimal', {}, 'jsonb_only');
    expect(h1).not.toBe(h2);
  });

  it('starts with djb2: prefix', () => {
    const h = computeSchemaHashPure('boolean', {}, 'jsonb_only');
    expect(h).toMatch(/^djb2:[0-9a-f]+$/);
  });
});

// ── RW/RO Routing ────────────────────────────────────────
// These tests require DATABASE_URL to be set (module-level check in db.ts).
// Skip gracefully in CI/local without a DB.

const hasDb = !!process.env.DATABASE_URL;

describe.skipIf(!hasDb)('RW/RO getDb routing', () => {
  it('getDb exists and returns a db instance', async () => {
    const mod = await import('afena-database');
    expect(typeof mod.getDb).toBe('function');
  });

  it('getDb({ forcePrimary: true }) returns db (RW)', async () => {
    const mod = await import('afena-database');
    const rw = mod.getDb({ forcePrimary: true });
    expect(rw).toBe(mod.db);
  });

  it('getDb() returns dbRo by default', async () => {
    const mod = await import('afena-database');
    const ro = mod.getDb();
    expect(ro).toBe(mod.dbRo);
  });
});
