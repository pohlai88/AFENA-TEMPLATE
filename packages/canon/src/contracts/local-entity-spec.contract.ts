/**
 * LocalEntitySpec — SSOT contract for adopted entities.
 * Refactor (Adaptee) → Adapter pipeline → LocalEntitySpec (Target).
 * All outputs (Zod, Drizzle, form config) are derived from or validated against this.
 *
 * Invariants:
 * - TENANCY-01: Every entity has org_id, composite PK (org_id, id), tenantPolicy
 * - MONEY-01: Money fields use bigint minor units
 * - MAP-01: Reserved words mapped via reservedWordMap
 */

import { z } from 'zod';

// ── Slug (entityType) ────────────────────────────────────
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be lowercase slug (e.g. video-settings)');

// ── Kind classification ──────────────────────────────────
export const entityKindSchema = z.enum(['config', 'master', 'doc']);
export type EntityKind = z.infer<typeof entityKindSchema>;

// ── Field type system (closed set) ────────────────────────
const primitiveTypeSchema = z.enum([
  'string',
  'text',
  'boolean',
  'int',
  'bigint',
  'decimal',
  'uuid',
  'date',
  'timestamptz',
  'json',
  'enum',
]);
const dataSubFormatSchema = z.enum(['data:email', 'data:phone', 'data:iban']);
const linkTypeSchema = z.object({
  type: z.literal('link'),
  targetEntityType: z.string().optional(), // optional when staged=true
  cardinality: z.enum(['one', 'many']).default('one'),
  staged: z.boolean(),
  storage: z.enum(['uuid', 'text']).default('uuid'), // text for staged/unresolved
  refSource: z.enum(['doctype', 'options', 'manifest']).optional(),
});

export const fieldTypeSchema = z.union([
  primitiveTypeSchema,
  dataSubFormatSchema,
  linkTypeSchema,
]);
export type FieldType = z.infer<typeof fieldTypeSchema>;

const fieldDefSchema = z.object({
  fieldname: z.string(),
  fieldType: fieldTypeSchema,
  label: z.string(),
  required: z.boolean().default(false),
  dbName: z.string().optional(), // from reservedWordMap when fieldname is reserved
  source: z.enum(['refactor', 'local']).default('refactor'),
  enumChoices: z.array(z.string()).optional(), // when fieldType is enum
});

export type FieldDef = z.infer<typeof fieldDefSchema>;

// ── Table config ──────────────────────────────────────────
const tableConfigSchema = z.object({
  name: z.string(), // snake plural, e.g. video_settings
  pk: z.tuple([z.literal('org_id'), z.literal('id')]),
  tenancy: z.literal(true), // TENANCY-01: always true
  reservedWordMap: z.record(z.string(), z.string()), // fieldname → db column name
  indexes: z.array(z.object({ columns: z.array(z.string()), unique: z.boolean().optional() })).optional(),
});

// ── UI config ─────────────────────────────────────────────
const uiConfigSchema = z.object({
  groups: z.array(z.string()).optional(),
  order: z.array(z.string()).optional(),
  dependsOn: z.array(z.string()).optional(),
});

// ── Doc config (only when kind=doc) ──────────────────────
const docConfigSchema = z
  .object({
    postingStatus: z.string().optional(),
    numberingField: z.string().optional(),
  })
  .optional();

// ── Source map (per-field provenance) ─────────────────────
const sourceMapSchema = z.record(z.string(), z.enum(['refactor', 'local'])).optional();

// ── Meta block (debbuggable determinism) ──────────────────
const metaSchema = z.object({
  adapterVersion: z.string(),
  inputsHash: z.string(),
  generatedAt: z.string().datetime().optional(),
  source: z.object({
    doctypeId: z.string(),
    name: z.string(),
  }),
});

// ── LocalEntitySpec (full contract) ──────────────────────
export const localEntitySpecSchema = z
  .object({
    entityType: slugSchema,
    kind: entityKindSchema,
    table: tableConfigSchema,
    fields: z.array(fieldDefSchema),
    ui: uiConfigSchema.default({}),
    doc: docConfigSchema,
    sourceMap: sourceMapSchema,
    meta: metaSchema,
  })
  .strict()
  .superRefine((spec, ctx) => {
    // TENANCY-01: table.tenancy must be true
    if (!spec.table.tenancy) {
      ctx.addIssue({ code: 'custom', message: 'TENANCY-01: table.tenancy must be true', path: ['table', 'tenancy'] });
    }
    // MONEY-01: enforced at mapping — mapper must output bigint for money; contract allows bigint
    // MAP-01: reserved words (status, type, from, to, user) must have dbName or reservedWordMap entry
    const reserved = ['status', 'type', 'from', 'to', 'user'];
    for (let i = 0; i < spec.fields.length; i++) {
      const f = spec.fields[i];
      if (reserved.includes(f.fieldname)) {
        const hasMapping = f.dbName ?? spec.table.reservedWordMap[f.fieldname];
        if (!hasMapping) {
          ctx.addIssue({
            code: 'custom',
            message: `MAP-01: reserved word '${f.fieldname}' must have dbName or reservedWordMap entry`,
            path: ['fields', i],
          });
        }
      }
    }
  });

export type LocalEntitySpec = z.infer<typeof localEntitySpecSchema>;

/**
 * Validate a spec against the contract. Returns parsed spec or throws.
 */
export function validateLocalEntitySpec(data: unknown): LocalEntitySpec {
  return localEntitySpecSchema.parse(data);
}

/**
 * Safe parse — returns result with success/error.
 */
export function safeParseLocalEntitySpec(data: unknown): { success: true; data: LocalEntitySpec } | { success: false; error: z.ZodError } {
  return localEntitySpecSchema.safeParse(data) as { success: true; data: LocalEntitySpec } | { success: false; error: z.ZodError };
}
