/**
 * Custom Field Value Storage Mapping
 * 
 * Maps data types to custom_field_values typed columns.
 * This is a storage concern, separate from validation logic.
 */

import type { DataType } from '../../enums/data-types';

/**
 * Maps data types to custom_field_values typed columns.
 */
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
  binary: 'value_blob',
  file: 'value_blob',
  single_select: 'value_text',
  multi_select: 'value_json',
  rich_text: 'value_text',
  currency: 'value_numeric',
  formula: 'value_text',
  relation: 'value_uuid',
};
