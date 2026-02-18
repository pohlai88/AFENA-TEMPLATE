import { z } from 'zod';

import type { DataType } from '../enums/data-types';

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
  }),
  decimal: z.object({
    precision: z.coerce.number().int().min(1).max(38).default(18),
    scale: z.coerce.number().int().min(0).max(18).default(6),
  }),
  money: z.object({
    currencyField: z.string().optional(),
  }),
  boolean: z.object({}),
  date: z.object({
    minDate: z.string().optional(),
    maxDate: z.string().optional(),
  }),
  datetime: z.object({}),
  enum: z.object({
    choices: z.array(z.string().min(1)).min(1).max(100),
  }),
  multi_enum: z.object({
    choices: z.array(z.string().min(1)).min(1).max(100),
    maxSelections: z.coerce.number().int().min(1).optional(),
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
