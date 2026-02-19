import { z } from 'zod';

import { DATA_TYPES, type DataType } from '../enums/data-types';
import { SCHEMA_ERROR_CODES } from './error-codes';

export const TYPE_CONFIG_SCHEMAS = {
  short_text: z.object({
    maxLength: z.coerce.number().int().min(1).max(4000).default(255),
  }),
  long_text: z.object({
    maxLength: z.coerce.number().int().min(1).max(100000).optional(),
  }),
  integer: z.object({
    min: z.coerce.number().int().optional(),
    max: z.coerce.number().int().optional(),
  }).superRefine((data, ctx) => {
    // INV-DT-04: Min must be < max
    if (data.min !== undefined && data.max !== undefined && data.min >= data.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${SCHEMA_ERROR_CODES.INTEGER_MIN_GTE_MAX}: min must be < max`,
        path: ['max'],
      });
    }
  }),
  decimal: z.object({
    precision: z.coerce.number().int().min(1).max(38).default(18),
    scale: z.coerce.number().int().min(0).max(18).default(6),
  }).superRefine((data, ctx) => {
    // INV-DT-02: Scale must be <= precision
    if (data.scale > data.precision) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${SCHEMA_ERROR_CODES.DECIMAL_SCALE_GT_PRECISION}: scale must be <= precision`,
        path: ['scale'],
      });
    }
  }),
  money: z.object({
    currencyField: z.string().optional(),
  }),
  boolean: z.object({}),
  date: z.object({
    minDate: z.string().optional(),
    maxDate: z.string().optional(),
  }).superRefine((data, ctx) => {
    // INV-DT-05: MinDate must be < maxDate
    if (data.minDate && data.maxDate && data.minDate >= data.maxDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${SCHEMA_ERROR_CODES.DATE_MIN_GTE_MAX}: minDate must be < maxDate`,
        path: ['maxDate'],
      });
    }
  }),
  datetime: z.object({}),
  enum: z.object({
    choices: z.array(z.string().min(1)).min(1).max(100),
  }),
  multi_enum: z.object({
    choices: z.array(z.string().min(1)).min(1).max(100),
    maxSelections: z.coerce.number().int().min(1).optional(),
  }).superRefine((data, ctx) => {
    // INV-DT-07: MaxSelections must be <= choices.length
    if (data.maxSelections && data.maxSelections > data.choices.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${SCHEMA_ERROR_CODES.MULTIENUM_MAX_GT_CHOICES}: maxSelections cannot exceed choices length`,
        path: ['maxSelections'],
      });
    }
  }),
  email: z.object({}),
  phone: z.object({}),
  url: z.object({}),
  entity_ref: z.object({
    targetEntity: z.string().min(1),
  }),
  json: z.object({
    schema: z.record(z.string(), z.unknown()).optional(),
  }),
  binary: z.object({
    maxBytes: z.coerce.number().int().min(1).optional(),
  }),
  file: z.object({
    maxBytes: z.coerce.number().int().min(1).optional(),
    allowedMimeTypes: z.array(z.string()).optional(),
  }),
  single_select: z.object({
    choices: z.array(z.string().min(1)).min(1).max(100),
  }),
  multi_select: z.object({
    choices: z.array(z.string().min(1)).min(1).max(100),
    maxSelections: z.coerce.number().int().min(1).optional(),
  }).superRefine((data, ctx) => {
    // INV-DT-06: MaxSelections must be <= choices.length
    if (data.maxSelections && data.maxSelections > data.choices.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${SCHEMA_ERROR_CODES.MULTISELECT_MAX_GT_CHOICES}: maxSelections cannot exceed choices length`,
        path: ['maxSelections'],
      });
    }
  }),
  rich_text: z.object({
    maxLength: z.coerce.number().int().min(1).max(100000).optional(),
  }),
  currency: z.object({
    currencyCode: z.string().length(3).default('USD'),
    precision: z.coerce.number().int().min(0).max(10).default(2),
  }),
  formula: z.object({
    expression: z.string().min(1),
    resultType: z.string().min(1),
  }),
  relation: z.object({
    targetEntity: z.string().min(1),
    relationshipType: z.enum(['one_to_one', 'one_to_many', 'many_to_many']).optional(),
  }),
} as const satisfies Record<DataType, z.ZodType>;

export type TypeConfigSchemas = typeof TYPE_CONFIG_SCHEMAS;

export function getTypeConfigSchema(dataType: DataType): z.ZodType {
  return TYPE_CONFIG_SCHEMAS[dataType];
}

export function validateTypeConfig(
  dataType: DataType,
  config: unknown,
): { valid: true; data: unknown } | { valid: false; error: string } {
  const schema = TYPE_CONFIG_SCHEMAS[dataType];
  const result = schema.safeParse(config);
  if (result.success) {
    return { valid: true, data: result.data };
  }
  return { valid: false, error: result.error.message };
}

// Runtime exhaustiveness validation (dev-only)
// Ensures TYPE_CONFIG_SCHEMAS covers all DataType enum values
if (process.env.NODE_ENV !== 'production') {
  const schemaKeys = Object.keys(TYPE_CONFIG_SCHEMAS).sort();
  const dataTypes = [...DATA_TYPES].sort();

  // Check for missing schemas
  const missing = dataTypes.filter(dt => !schemaKeys.includes(dt));
  if (missing.length > 0) {
    throw new Error(
      `TYPE_CONFIG_SCHEMAS is incomplete. Missing schemas for: ${missing.join(', ')}`
    );
  }

  // Check for extra schemas
  const extra = schemaKeys.filter(key => !dataTypes.includes(key as DataType));
  if (extra.length > 0) {
    throw new Error(
      `TYPE_CONFIG_SCHEMAS has unexpected schemas: ${extra.join(', ')}`
    );
  }
}
