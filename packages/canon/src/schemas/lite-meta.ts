/**
 * Zod Schemas for LiteMetadata
 *
 * JSON Schema validation for asset keys, quality rules, and quality dimensions.
 * Uses Zod v4 idioms and `.meta()` for JSON Schema generation.
 */

import { z } from 'zod';

import { parseAssetKey, type AssetKeyPrefix } from '../lite-meta/core/asset-keys';
import { ASSET_TYPE_PREFIXES } from '../lite-meta/types/asset-type-prefixes';
import { SCHEMA_ERROR_CODES } from './error-codes';

/**
 * Asset Key Schema (CANONICAL - strict validation)
 * 
 * Use for internal canonical values and storage.
 * No normalization - expects already-canonical input.
 * 
 * Phase 2 optimization: Parsing is cached internally.
 * Phase 3 optimization: Parse once in superRefine.
 */
export const assetKeySchema = z
  .string()
  .min(3, 'Asset key must be at least 3 characters')
  .superRefine((key, ctx) => {
    // Parse once (Phase 3 optimization - no double-validation)
    const parsed = parseAssetKey(key);

    if (!parsed.valid) {
      // Attach structured issues (one per error)
      parsed.errors.forEach((error: string) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error,
          path: [],
        });
      });
    }
  })
  .brand<'AssetKey'>()
  .meta({
    id: 'AssetKey',
    description: 'Canonical asset key (strict validation, no normalization)',
    examples: [
      'db.rec.afenda.public.invoices',
      'db.field.afenda.public.invoices.total_amount',
      'db.bo.finance.invoice',
      'metric:revenue.monthly',
    ],
  });

/**
 * Asset Key Input Schema (normalize then validate)
 * 
 * Use for external inputs (forms, env vars, query params).
 * Normalizes (trim + lowercase) before strict validation.
 * 
 * **When to use:**
 * - ✅ Form inputs, query parameters, environment variables
 * - ✅ Any external/user-provided data
 * - ❌ Internal values, database reads (use `assetKeySchema` instead)
 * 
 * @example
 * ```typescript
 * // External input - normalizes automatically
 * const userInput = assetKeyInputSchema.parse('  DB.REC.AFENDA.PUBLIC.INVOICES  ');
 * // Result: 'db.rec.afenda.public.invoices' (trimmed + lowercased)
 * 
 * // Internal validation - strict, no normalization
 * const dbValue = assetKeySchema.parse('db.rec.afenda.public.invoices');
 * ```
 */
export const assetKeyInputSchema = z
  .string()
  .transform(key => key.trim().toLowerCase())
  .pipe(assetKeySchema)
  .meta({
    id: 'AssetKeyInput',
    description: 'Asset key input with automatic normalization',
  });

/**
 * Quality Rule Type Schema
 */
export const qualityRuleTypeSchema = z
  .enum([
    'not_null',
    'unique',
    'range',
    'regex',
    'fk_exists',
    'enum_set',
    'sum_matches_total',
    'debits_equal_credits',
  ] as const)
  .meta({
    id: 'QualityRuleType',
    description: 'Executable quality check type',
  });

/**
 * Quality Dimension Schema
 */
export const qualityDimensionSchema = z
  .enum(['completeness', 'validity', 'uniqueness', 'consistency', 'accuracy'] as const)
  .meta({
    id: 'QualityDimension',
    description: 'Business-level quality dimension',
  });

/**
 * Quality Rule Schema
 */
export const qualityRuleSchema = z
  .object({
    ruleType: qualityRuleTypeSchema,
    targetAssetKey: assetKeySchema,
    config: z.record(z.string(), z.unknown()),
    severity: z.enum(['error', 'warning', 'info']),
  })
  .meta({
    id: 'QualityRule',
    description: 'Executable data quality rule with configuration',
  });

/**
 * Asset Descriptor Schema
 */
export const assetDescriptorSchema = z
  .object({
    // Identity Aspect
    assetKey: assetKeySchema,
    assetType: z.enum([
      'table',
      'column',
      'view',
      'pipeline',
      'report',
      'api',
      'business_object',
      'policy',
      'metric',
    ]),
    displayName: z.string().min(1),
    description: z.string().optional(),

    // Ownership Aspect
    owner: z.string().optional(),
    steward: z.string().optional(),

    // Classification Aspect
    classification: z.enum(['pii', 'financial', 'internal', 'public']).optional(),
    tags: z.array(z.string()).optional(),

    // Quality Aspect
    qualityTier: z.enum(['gold', 'silver', 'bronze']).optional(),

    // Lineage Aspect
    upstream: z.array(assetKeySchema).optional(),
    downstream: z.array(assetKeySchema).optional(),

    // Glossary Aspect
    glossaryTerms: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    // INV-META-01: Asset key prefix must match asset type
    const parsed = parseAssetKey(data.assetKey);
    if (!parsed.valid) return; // Let assetKeySchema handle invalid keys

    const allowedPrefixes = ASSET_TYPE_PREFIXES[data.assetType];
    if (!allowedPrefixes) return; // Unknown asset type, skip validation

    const hasValidPrefix = allowedPrefixes.some((prefix: AssetKeyPrefix) =>
      data.assetKey.startsWith(prefix)
    );

    if (!hasValidPrefix) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${SCHEMA_ERROR_CODES.META_PREFIX_MISMATCH}: asset key prefix must match type (expected: ${allowedPrefixes.join(' or ')})`,
        path: ['assetKey'],
      });
    }
  })
  .meta({
    id: 'AssetDescriptor',
    description: 'Complete metadata descriptor for an asset',
  });

/**
 * Parsed Asset Key Schema
 */
export const parsedAssetKeySchema = z
  .object({
    prefix: z
      .enum([
        'db.rec',
        'db.field',
        'db.bo',
        'db.view',
        'db.pipe',
        'db.report',
        'db.api',
        'db.policy',
        'metric:',
      ])
      .nullable(),
    segments: z.array(z.string()),
    valid: z.boolean(),
    errors: z.array(z.string()),
  })
  .meta({
    id: 'ParsedAssetKey',
    description: 'Result of parsing an asset key',
  });
