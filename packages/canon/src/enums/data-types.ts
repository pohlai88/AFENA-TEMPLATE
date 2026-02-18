import { z } from 'zod';

export const DATA_TYPES = [
  'short_text',
  'long_text',
  'integer',
  'decimal',
  'money',
  'boolean',
  'date',
  'datetime',
  'enum',
  'multi_enum',
  'email',
  'phone',
  'url',
  'entity_ref',
  'json',
  'binary',
  'file',
  'single_select',
  'multi_select',
  'rich_text',
  'currency',
  'formula',
  'relation',
] as const;

export type DataType = (typeof DATA_TYPES)[number];
export const dataTypeSchema = z.enum(DATA_TYPES);
