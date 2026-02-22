import { z } from 'zod';
import { createEnumKit, createSubset, type BaseEnumMetadata } from './_enum-kit';

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

// ============================================================================
// Metadata (SSOT)
// ============================================================================

export interface DataTypeMetadata extends BaseEnumMetadata {
  category: 'text' | 'numeric' | 'temporal' | 'reference' | 'structured' | 'binary';
  requiresValidation: boolean;
}

export const DATA_TYPE_METADATA = {
  short_text: { label: 'Short Text', description: 'Short text field', tone: 'neutral', category: 'text', requiresValidation: false, sortOrder: 1 },
  long_text: { label: 'Long Text', description: 'Long text field', tone: 'neutral', category: 'text', requiresValidation: false, sortOrder: 2 },
  rich_text: { label: 'Rich Text', description: 'Rich formatted text', tone: 'neutral', category: 'text', requiresValidation: false, sortOrder: 3 },
  integer: { label: 'Integer', description: 'Whole number', tone: 'neutral', category: 'numeric', requiresValidation: false, sortOrder: 4 },
  decimal: { label: 'Decimal', description: 'Decimal number', tone: 'neutral', category: 'numeric', requiresValidation: false, sortOrder: 5 },
  money: { label: 'Money', description: 'Monetary amount', tone: 'success', category: 'numeric', requiresValidation: false, sortOrder: 6 },
  currency: { label: 'Currency', description: 'Currency code', tone: 'info', category: 'numeric', requiresValidation: true, sortOrder: 7 },
  boolean: { label: 'Boolean', description: 'True/false value', tone: 'neutral', category: 'structured', requiresValidation: false, sortOrder: 8 },
  date: { label: 'Date', description: 'Date value', tone: 'neutral', category: 'temporal', requiresValidation: true, sortOrder: 9 },
  datetime: { label: 'Date Time', description: 'Date and time value', tone: 'neutral', category: 'temporal', requiresValidation: true, sortOrder: 10 },
  email: { label: 'Email', description: 'Email address', tone: 'info', category: 'text', requiresValidation: true, sortOrder: 11 },
  phone: { label: 'Phone', description: 'Phone number', tone: 'info', category: 'text', requiresValidation: true, sortOrder: 12 },
  url: { label: 'URL', description: 'Web URL', tone: 'info', category: 'text', requiresValidation: true, sortOrder: 13 },
  enum: { label: 'Enum', description: 'Single selection from list', tone: 'neutral', category: 'structured', requiresValidation: true, sortOrder: 14 },
  multi_enum: { label: 'Multi Enum', description: 'Multiple selections from list', tone: 'neutral', category: 'structured', requiresValidation: true, sortOrder: 15 },
  single_select: { label: 'Single Select', description: 'Single option selection', tone: 'neutral', category: 'structured', requiresValidation: true, sortOrder: 16 },
  multi_select: { label: 'Multi Select', description: 'Multiple option selection', tone: 'neutral', category: 'structured', requiresValidation: true, sortOrder: 17 },
  entity_ref: { label: 'Entity Reference', description: 'Reference to another entity', tone: 'info', category: 'reference', requiresValidation: true, sortOrder: 18 },
  relation: { label: 'Relation', description: 'Relationship to other entities', tone: 'info', category: 'reference', requiresValidation: true, sortOrder: 19 },
  json: { label: 'JSON', description: 'JSON data structure', tone: 'neutral', category: 'structured', requiresValidation: true, sortOrder: 20 },
  binary: { label: 'Binary', description: 'Binary data', tone: 'neutral', category: 'binary', requiresValidation: false, sortOrder: 21 },
  file: { label: 'File', description: 'File attachment', tone: 'neutral', category: 'binary', requiresValidation: false, sortOrder: 22 },
  formula: { label: 'Formula', description: 'Calculated formula field', tone: 'warning', category: 'structured', requiresValidation: false, sortOrder: 23 },
} as const satisfies Record<DataType, DataTypeMetadata>;

// ============================================================================
// Enum Kit
// ============================================================================

export const dataTypeKit = createEnumKit(DATA_TYPES, dataTypeSchema, DATA_TYPE_METADATA);

export const {
  isValid: isValidDataType,
  assert: assertDataType,
  getLabel: getDataTypeLabel,
  getMeta: getDataTypeMeta,
  labels: DATA_TYPE_LABELS,
} = dataTypeKit;

// ============================================================================
// Semantic Subsets
// ============================================================================

export const NUMERIC_DATA_TYPES = createSubset(['integer', 'decimal', 'money', 'currency'] as const);
export const TEXT_DATA_TYPES = createSubset(['short_text', 'long_text', 'rich_text'] as const);
export const TEMPORAL_DATA_TYPES = createSubset(['date', 'datetime'] as const);
export const REFERENCE_DATA_TYPES = createSubset(['entity_ref', 'relation'] as const);

// ============================================================================
// Semantic Predicates
// ============================================================================

export const isNumericDataType = (t: DataType) => NUMERIC_DATA_TYPES.has(t);
export const isTextDataType = (t: DataType) => TEXT_DATA_TYPES.has(t);
export const isTemporalDataType = (t: DataType) => TEMPORAL_DATA_TYPES.has(t);
export const isReferenceDataType = (t: DataType) => REFERENCE_DATA_TYPES.has(t);
export const requiresValidation = (t: DataType) => DATA_TYPE_METADATA[t].requiresValidation;
