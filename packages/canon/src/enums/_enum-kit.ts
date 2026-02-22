import type { z } from 'zod';

// ============================================================================
// Base Metadata Types
// ============================================================================

/** Semantic tone for UI rendering (framework-agnostic). */
export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** Base metadata that all enums must provide. */
export interface BaseEnumMetadata {
  /** Human-readable label for UI display */
  label: string;
  /** Business context description */
  description: string;

  /** Semantic tone for UI theming */
  tone?: Tone;
  /** Sort order for UI lists (lower = earlier) */
  sortOrder?: number;

  /** Deprecation flag */
  deprecated?: boolean;
  /** Replacement value if deprecated */
  replacedBy?: string;
  /** Version/date when deprecated */
  since?: string;
}

/** Type-safe metadata record that enforces completeness. */
export type EnumMetadataRecord<T extends string, M extends BaseEnumMetadata> = {
  readonly [K in T]: M;
};

// ============================================================================
// Enum Kit Types
// ============================================================================

export interface EnumKit<T extends string, M extends BaseEnumMetadata> {
  /** Original values array (SSOT values list) */
  readonly values: readonly T[];
  /** Zod schema for runtime validation */
  readonly schema: z.ZodEnum<any>;
  /** Metadata record (SSOT) */
  readonly metadata: EnumMetadataRecord<T, M>;
  /** Derived labels (from metadata) */
  readonly labels: Record<T, string>;
  /** Precomputed Set for O(1) membership checks */
  readonly valueSet: ReadonlySet<T>;

  /** O(1) type guard */
  isValid(value: unknown): value is T;
  /** Assertion helper with consistent error format */
  assert(value: unknown): asserts value is T;

  /** Get label (derived from metadata) */
  getLabel(value: T): string;
  /** Get metadata */
  getMeta(value: T): M;

  /** Non-deprecated values */
  getActive(): readonly T[];
  /** Values sorted by sortOrder (undefined => last) */
  getSorted(): readonly T[];
}

// ============================================================================
// Enum Kit Factory
// ============================================================================

/**
 * Create a complete enum kit with:
 * - metadata-first SSOT
 * - O(1) validation via Set
 * - consistent assert errors
 * - derived labels
 *
 * NOTE: avoid using `this` inside methods to keep destructuring safe:
 *   const { assert } = kit; assert(x); // ✅ works
 */
export function createEnumKit<T extends string, M extends BaseEnumMetadata>(
  values: readonly T[],
  schema: z.ZodEnum<any>,
  metadata: EnumMetadataRecord<T, M>
): EnumKit<T, M> {
  const valueSet = new Set(values as readonly T[]);
  const labels = Object.fromEntries(
    (values as readonly T[]).map((v) => [v, metadata[v].label])
  ) as Record<T, string>;

  const isValid = (value: unknown): value is T =>
    typeof value === 'string' && valueSet.has(value as T);

  const assert = (value: unknown): asserts value is T => {
    if (!isValid(value)) {
      throw new TypeError(
        `Invalid enum value: ${JSON.stringify(value)}. Expected one of: ${(values as readonly string[]).join(
          ', '
        )}`
      );
    }
  };

  const getLabel = (value: T) => labels[value];
  const getMeta = (value: T) => metadata[value];

  const getActive = (): readonly T[] =>
    (values as readonly T[]).filter((v) => !metadata[v].deprecated);

  const getSorted = (): readonly T[] =>
    [...(values as readonly T[])].sort((a, b) => {
      const orderA = metadata[a].sortOrder ?? 999;
      const orderB = metadata[b].sortOrder ?? 999;
      return orderA - orderB;
    });

  return {
    values,
    schema,
    metadata,
    labels,
    valueSet,

    isValid,
    assert,
    getLabel,
    getMeta,
    getActive,
    getSorted,
  };
}

// ============================================================================
// Subset Helper
// ============================================================================

export interface EnumSubset<T extends string, U extends T = T> {
  readonly values: readonly U[];
  readonly set: ReadonlySet<U>;
  has(value: T): value is U;
}

/**
 * Create a typed subset with precomputed Set for O(1) membership checks.
 *
 * Keep subsets readable (values array) + fast (set).
 */
export function createSubset<T extends string, S extends readonly T[]>(
  subset: S
): EnumSubset<T, S[number]> {
  const set = new Set(subset as readonly S[number][]);
  const has = (value: T): value is S[number] => set.has(value as S[number]);

  return { values: subset, set, has };
}

// ============================================================================
// Table-driven Test Descriptor
// ============================================================================

export interface EnumTestDescriptor<T extends string, M extends BaseEnumMetadata> {
  name: string;
  kit: EnumKit<T, M>;
  invalidSamples?: readonly unknown[];
}
