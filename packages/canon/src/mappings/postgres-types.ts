/**
 * PostgreSQL Type Mapping
 *
 * V1 deterministic mappings from Postgres types to Canon DataTypes.
 * Maps instance types and generates confidence scores for migration pipelines.
 *
 * Invariants (locked - see canon.architecture.md §8.1):
 * M1: Full coverage of known Postgres types
 * M2: Strict mode throws on unknown types
 * M3: Confidence tracking per CONFIDENCE_SEMANTICS
 */

import type { DataType } from '../enums/data-types';

/**
 * Postgres type to Canon DataType mapping (V1)
 * M1 invariant: Complete coverage for all known PostgreSQL types
 */
export const POSTGRES_TO_CANON: Record<string, DataType> = {
  // Text types
  text: 'long_text',
  varchar: 'short_text',
  'character varying': 'short_text',
  char: 'short_text',
  character: 'short_text',
  name: 'short_text',
  citext: 'long_text',

  // Numeric types
  int2: 'integer',
  int4: 'integer',
  int8: 'integer',
  smallint: 'integer',
  integer: 'integer',
  bigint: 'integer',
  float4: 'decimal',
  float8: 'decimal',
  real: 'decimal',
  'double precision': 'decimal',
  numeric: 'decimal',
  money: 'decimal',
  serial: 'integer',
  bigserial: 'integer',
  smallserial: 'integer',

  // Boolean
  bool: 'boolean',
  boolean: 'boolean',

  // Date/Time
  date: 'date',
  timestamp: 'datetime',
  'timestamp without time zone': 'datetime',
  'timestamp with time zone': 'datetime',
  timestamptz: 'datetime',
  time: 'short_text',
  'time without time zone': 'short_text',
  'time with time zone': 'short_text',
  timetz: 'short_text',
  interval: 'short_text',

  // JSON
  json: 'json',
  jsonb: 'json',

  // Binary
  bytea: 'binary',

  // UUID
  uuid: 'entity_ref',

  // Array
  'text[]': 'multi_select',
  'varchar[]': 'multi_select',
  'integer[]': 'json',
  'int4[]': 'json',
  'jsonb[]': 'json',

  // Geometric (GIS)
  point: 'json',
  line: 'json',
  lseg: 'json',
  box: 'json',
  path: 'json',
  polygon: 'json',
  circle: 'json',

  // Network
  inet: 'short_text',
  cidr: 'short_text',
  macaddr: 'short_text',
  macaddr8: 'short_text',

  // Range types
  int4range: 'json',
  int8range: 'json',
  numrange: 'json',
  tsrange: 'json',
  tstzrange: 'json',
  daterange: 'json',

  // Search
  tsvector: 'long_text',
  tsquery: 'short_text',

  // Other
  xml: 'long_text',
  bit: 'short_text',
  'bit varying': 'short_text',
  varbit: 'short_text',
  oid: 'integer',
  regclass: 'short_text',
  regtype: 'short_text',
};

/**
 * Input for mapping a PostgreSQL column
 */
export interface MapPostgresColumnInput {
  columnName: string;
  udtName: string; // pg type from information_schema
  isNullable: boolean;
  characterMaximumLength?: number;
  numericPrecision?: number;
  numericScale?: number;
}

/**
 * Output of mapping a PostgreSQL column
 */
export interface MapPostgresColumnOutput {
  canonType: DataType;
  isRequired: boolean;
  maxLength?: number;
  precision?: number;
  scale?: number;
  confidence?: number; // 1.0 = exact, <1.0 = lossy/narrowing
  notes?: string; // explanation if lossy or narrowed
}

/**
 * Confidence semantics for type mappings
 * Shared with inferCsvColumnType and other mapping functions
 */
export const CONFIDENCE_SEMANTICS = {
  EXACT: 1.0, // Lossless, semantically equivalent
  SEMANTIC_EQUIV: 0.95, // Semantically equivalent, representation differs
  NARROWING_WITH_METADATA: 0.8, // Narrowing or depends on external metadata
  LOSSY_FALLBACK: 0.4, // Lossy fallback / informational
} as const;

/**
 * Normalize PostgreSQL type before mapping
 * Handles arrays (_text, text[]), domains, composite types, and user-defined types
 */
export function normalizePgType(pgType: string): {
  baseType: string;
  isArray: boolean;
  isDomain: boolean;
  isComposite: boolean;
} {
  const lower = pgType.toLowerCase().trim();

  // Check for array syntax
  const isArray = lower.endsWith('[]') || lower.startsWith('_');
  const base = isArray ? lower.replace(/\[\]$/, '').replace(/^_/, '') : lower;

  // Check for composite/record type (contains .)
  const isComposite = base.includes('.');

  // Check for domain (UDT that might reference a base type)
  // In v1, we cannot resolve domains without schema info
  const isDomain = !POSTGRES_TO_CANON[base] && !isComposite;

  return { baseType: base, isArray, isDomain, isComposite };
}

/**
 * Map a Postgres type to Canon DataType
 *
 * @param pgType - PostgreSQL type name
 * @param meta - Optional metadata (characterMaximumLength, numericPrecision, numericScale)
 * @param opts - Options (mode: 'strict' | 'loose')
 *
 * Strict mode: Unknown types throw
 * Loose mode: Unknown types return 'short_text' with warning
 *
 * M2 invariant: Strict mode throws on unknown types; never silent fallback
 * M3 invariant: Returns confidence per CONFIDENCE_SEMANTICS
 */
export function mapPostgresType(
  pgType: string,
  meta?: { maxLength?: number; precision?: number; scale?: number },
  opts?: { mode?: 'strict' | 'loose' }
): {
  canonType: DataType;
  confidence: number;
  notes?: string;
} {
  const mode = opts?.mode ?? 'strict';
  const normalized = normalizePgType(pgType);

  // Known type
  if (POSTGRES_TO_CANON[normalized.baseType]) {
    const canonType = POSTGRES_TO_CANON[normalized.baseType]!;

    // M3 invariant: Determine confidence
    // timestamp → datetime preserves semantics
    if (pgType === 'timestamp' || pgType === 'timestamptz') {
      return {
        canonType,
        confidence: CONFIDENCE_SEMANTICS.SEMANTIC_EQUIV,
        notes: 'Postgres timestamp types preserve full precision; timezone handling differs slightly',
      };
    }

    // varchar(n) narrowing on large n
    if (
      pgType.startsWith('varchar') &&
      meta?.maxLength &&
      meta.maxLength > 255
    ) {
      return {
        canonType,
        confidence: CONFIDENCE_SEMANTICS.NARROWING_WITH_METADATA,
        notes: `varchar(${meta.maxLength}) mapped to long_text`,
      };
    }

    // uuid → entity_ref may require external validation
    if (pgType === 'uuid') {
      return {
        canonType,
        confidence: CONFIDENCE_SEMANTICS.NARROWING_WITH_METADATA,
        notes: 'UUID mapped to entity_ref (reference semantics depend on schema context)',
      };
    }

    // Default: exact match
    return {
      canonType,
      confidence: CONFIDENCE_SEMANTICS.EXACT,
    };
  }

  // Domain type (requires schema resolution)
  if (normalized.isDomain) {
    if (mode === 'strict') {
      throw new Error(
        `Unknown PostgreSQL type: '${pgType}'. Domain types require schema resolution. Use loose mode to fallback.`
      );
    }
    return {
      canonType: 'short_text',
      confidence: CONFIDENCE_SEMANTICS.LOSSY_FALLBACK,
      notes: `Unknown domain type '${pgType}' (schema resolution required); fell back to short_text`,
    };
  }

  // Composite/record type
  if (normalized.isComposite) {
    if (mode === 'strict') {
      throw new Error(
        `Composite types not supported in strict mode: '${pgType}'. Use loose mode to map to json.`
      );
    }
    return {
      canonType: 'json',
      confidence: CONFIDENCE_SEMANTICS.LOSSY_FALLBACK,
      notes: `Composite type '${pgType}' mapped to json (loses structure)`,
    };
  }

  // Unknown type
  if (mode === 'strict') {
    throw new Error(
      `Unknown PostgreSQL type: '${pgType}'. This type is not in the v1 mapping table.`
    );
  }

  return {
    canonType: 'short_text',
    confidence: CONFIDENCE_SEMANTICS.LOSSY_FALLBACK,
    notes: `Unknown type '${pgType}'; fell back to short_text`,
  };
}

/**
 * Map a PostgreSQL column to Canon column representation
 */
export function mapPostgresColumn(input: MapPostgresColumnInput): MapPostgresColumnOutput {
  const mapped = mapPostgresType(input.udtName, {
    ...(input.characterMaximumLength !== undefined && { maxLength: input.characterMaximumLength }),
    ...(input.numericPrecision !== undefined && { precision: input.numericPrecision }),
    ...(input.numericScale !== undefined && { scale: input.numericScale }),
  });

  return {
    canonType: mapped.canonType,
    isRequired: !input.isNullable,
    ...(input.characterMaximumLength !== undefined && { maxLength: input.characterMaximumLength }),
    ...(input.numericPrecision !== undefined && { precision: input.numericPrecision }),
    ...(input.numericScale !== undefined && { scale: input.numericScale }),
    confidence: mapped.confidence,
    ...(mapped.notes && { notes: mapped.notes }),
  };
}
