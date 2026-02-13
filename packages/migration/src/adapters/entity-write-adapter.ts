import type { EntityType } from '../types/migration-job.js';

/**
 * Fix 4: Canonized write-shape snapshots.
 *
 * Kernel-owned writable field lists — never guess system columns.
 * toWriteShape() picks ONLY canonized fields from a raw DB row,
 * producing a shape that mutate() will accept for update.
 */

// ── Canonized writable fields (kernel-owned SSOT) ───────────

export const ENTITY_WRITABLE_CORE_FIELDS: Record<string, readonly string[]> = {
  contacts: ['name', 'email', 'phone', 'status', 'notes', 'tags'],
  companies: ['name', 'registrationNo', 'taxId', 'industry', 'status'],
  invoices: ['invoiceNumber', 'issueDate', 'dueDate', 'amount', 'status', 'vendorId'],
  products: ['sku', 'name', 'description', 'price', 'category', 'status'],
  sites: ['name', 'code', 'address', 'status'],
  currencies: ['code', 'name', 'symbol', 'decimalPlaces'],
  uom: ['code', 'name', 'category'],
} as const;

// ── Interface ───────────────────────────────────────────────

export interface EntityWriteAdapter {
  readonly entityType: EntityType;
  toWriteShape(rawRow: Record<string, unknown>): {
    core: Record<string, unknown>;
    custom: Record<string, unknown>;
  };
}

// ── Canon adapter (uses ENTITY_WRITABLE_CORE_FIELDS) ────────

export class CanonEntityWriteAdapter implements EntityWriteAdapter {
  constructor(public readonly entityType: EntityType) {}

  toWriteShape(rawRow: Record<string, unknown>): {
    core: Record<string, unknown>;
    custom: Record<string, unknown>;
  } {
    const fields = ENTITY_WRITABLE_CORE_FIELDS[this.entityType];
    if (!fields) {
      throw new Error(`No writable fields defined for entity type: ${this.entityType}`);
    }

    const core: Record<string, unknown> = {};
    for (const field of fields) {
      if (field in rawRow) {
        core[field] = rawRow[field];
      }
    }

    const custom = (rawRow['custom_data'] as Record<string, unknown>) ?? {};

    return { core, custom };
  }
}

// ── Total registry ──────────────────────────────────────────

export const ENTITY_WRITE_ADAPTER_REGISTRY: Record<string, EntityWriteAdapter> = {
  contacts: new CanonEntityWriteAdapter('contacts'),
  companies: new CanonEntityWriteAdapter('companies'),
  invoices: new CanonEntityWriteAdapter('invoices'),
  products: new CanonEntityWriteAdapter('products'),
  sites: new CanonEntityWriteAdapter('sites'),
  currencies: new CanonEntityWriteAdapter('currencies'),
  uom: new CanonEntityWriteAdapter('uom'),
};

export function getEntityWriteAdapter(entityType: EntityType): EntityWriteAdapter {
  const adapter = ENTITY_WRITE_ADAPTER_REGISTRY[entityType];
  if (!adapter) {
    throw new Error(`No write adapter for entity type: ${entityType}`);
  }
  return adapter;
}
