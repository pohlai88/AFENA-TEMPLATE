import type { EntityType, TransformedRecord } from '../types/migration-job.js';
import type { MatchCandidate } from '../types/upsert-plan.js';

/**
 * Conflict detected during migration
 */
export interface Conflict {
  id: string;
  legacyRecord: TransformedRecord;
  matches: MatchCandidate[];
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Context passed to conflict detectors
 */
export interface DetectorContext {
  orgId: string;
}

/**
 * Fix 3: Entity-agnostic conflict detection as Strategy.
 *
 * - matchKeys: declares which fields the detector relies on (for signed report fingerprint)
 * - detectBulk: single query for all candidates in a batch (no N+1)
 * - Registry must be total (every EntityType has an entry)
 */
export interface ConflictDetector {
  readonly name: string;
  readonly entityType: EntityType;
  readonly matchKeys: readonly string[];
  detectBulk(records: TransformedRecord[], ctx: DetectorContext): Promise<Conflict[]>;
}

// ── Contacts (email + phone) ────────────────────────────────

export class ContactsConflictDetector implements ConflictDetector {
  readonly name = 'contacts_email_phone';
  readonly entityType: EntityType = 'contacts';
  readonly matchKeys = ['email', 'phone'] as const;

  async detectBulk(
    _records: TransformedRecord[],
    _ctx: DetectorContext
  ): Promise<Conflict[]> {
    // Concrete implementation requires DB access.
    // This is the structural skeleton; the real implementation
    // will be injected via a factory that receives the DB instance.
    //
    // Pattern:
    //   1. Collect emails/phones from records
    //   2. Single bulk query: WHERE email IN (...) OR phone IN (...)
    //   3. Build lookup maps, match records to candidates
    //   4. Return Conflict[] with scores
    return [];
  }
}

// ── Invoices (invoice_number + vendor) ──────────────────────

export class InvoicesConflictDetector implements ConflictDetector {
  readonly name = 'invoices_number_vendor';
  readonly entityType: EntityType = 'invoices';
  readonly matchKeys = ['invoiceNumber', 'vendorId'] as const;

  async detectBulk(
    _records: TransformedRecord[],
    _ctx: DetectorContext
  ): Promise<Conflict[]> {
    return [];
  }
}

// ── Products (sku) ──────────────────────────────────────────

export class ProductsConflictDetector implements ConflictDetector {
  readonly name = 'products_sku';
  readonly entityType: EntityType = 'products';
  readonly matchKeys = ['sku'] as const;

  async detectBulk(
    _records: TransformedRecord[],
    _ctx: DetectorContext
  ): Promise<Conflict[]> {
    return [];
  }
}

// ── Fallback (no conflict detection, lineage-only) ──────────

export class NoConflictDetector implements ConflictDetector {
  readonly name = 'no_conflict';
  readonly matchKeys: readonly string[] = [];

  constructor(public readonly entityType: EntityType) {}

  async detectBulk(): Promise<Conflict[]> {
    return [];
  }
}

// ── Total registry (canonized + exhaustive) ─────────────────

export const CONFLICT_DETECTOR_REGISTRY: Record<string, ConflictDetector> = {
  contacts: new ContactsConflictDetector(),
  companies: new NoConflictDetector('companies'),
  invoices: new InvoicesConflictDetector(),
  products: new ProductsConflictDetector(),
  sites: new NoConflictDetector('sites'),
  currencies: new NoConflictDetector('currencies'),
  uom: new NoConflictDetector('uom'),
};

export function getConflictDetector(entityType: EntityType): ConflictDetector {
  const detector = CONFLICT_DETECTOR_REGISTRY[entityType];
  if (!detector) {
    throw new Error(`No conflict detector for entity type: ${entityType}`);
  }
  if (detector.entityType !== entityType) {
    throw new Error(
      `Detector entity type mismatch: expected ${entityType}, got ${detector.entityType}`
    );
  }
  return detector;
}
