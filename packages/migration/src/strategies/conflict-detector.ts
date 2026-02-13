import type { MatchExplanation } from '../types/match-explanation.js';
import type { EntityType, TransformedRecord } from '../types/migration-job.js';
import type { MatchCandidate } from '../types/upsert-plan.js';

/**
 * Bulk query function injected into conflict detectors.
 * Executes a single query: SELECT id, ...matchFields FROM <table>
 * WHERE org_id = :orgId AND (<field> IN (:values) OR ...)
 *
 * The caller (app layer) provides this using Drizzle or raw SQL.
 * This keeps conflict-detector.ts free of direct DB imports.
 */
export interface DetectorQueryFn {
  (params: {
    entityType: string;
    orgId: string;
    matchFields: string[];
    matchValues: Record<string, unknown[]>;
  }): Promise<Array<Record<string, unknown>>>;
}

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
  queryFn?: DetectorQueryFn;
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
    records: TransformedRecord[],
    ctx: DetectorContext
  ): Promise<Conflict[]> {
    if (!ctx.queryFn || records.length === 0) return [];

    // 1. Collect match values from batch
    const emails = records.map((r) => r.data['email']).filter(Boolean) as unknown[];
    const phones = records.map((r) => r.data['phone']).filter(Boolean) as unknown[];

    if (emails.length === 0 && phones.length === 0) return [];

    // 2. Single bulk query
    const candidates = await ctx.queryFn({
      entityType: 'contacts',
      orgId: ctx.orgId,
      matchFields: ['id', 'email', 'phone', 'name'],
      matchValues: { email: emails, phone: phones },
    });

    if (candidates.length === 0) return [];

    // 3. Build lookup maps
    const byEmail = new Map<string, Array<Record<string, unknown>>>();
    const byPhone = new Map<string, Array<Record<string, unknown>>>();
    for (const c of candidates) {
      if (c['email']) {
        const key = String(c['email']).toLowerCase();
        if (!byEmail.has(key)) byEmail.set(key, []);
        byEmail.get(key)!.push(c);
      }
      if (c['phone']) {
        const key = String(c['phone']);
        if (!byPhone.has(key)) byPhone.set(key, []);
        byPhone.get(key)!.push(c);
      }
    }

    // 4. Match records to candidates with scoring + explanations
    const conflicts: Conflict[] = [];
    for (const record of records) {
      const matchSet = new Map<string, { entity: Record<string, unknown>; score: number; explanations: MatchExplanation[] }>();
      const email = record.data['email'] ? String(record.data['email']).toLowerCase() : null;
      const phone = record.data['phone'] ? String(record.data['phone']) : null;

      if (email && byEmail.has(email)) {
        for (const c of byEmail.get(email)!) {
          const id = String(c['id']);
          const existing = matchSet.get(id) ?? { entity: c, score: 0, explanations: [] };
          existing.score += 40;
          existing.explanations.push({
            field: 'email',
            matchType: 'normalized',
            scoreContribution: 40,
            legacyValue: email,
            candidateValue: String(c['email']),
          });
          matchSet.set(id, existing);
        }
      }
      if (phone && byPhone.has(phone)) {
        for (const c of byPhone.get(phone)!) {
          const id = String(c['id']);
          const existing = matchSet.get(id) ?? { entity: c, score: 0, explanations: [] };
          existing.score += 20;
          existing.explanations.push({
            field: 'phone',
            matchType: 'exact',
            scoreContribution: 20,
            legacyValue: phone,
            candidateValue: String(c['phone']),
          });
          matchSet.set(id, existing);
        }
      }

      if (matchSet.size > 0) {
        const matches: MatchCandidate[] = Array.from(matchSet.entries())
          .map(([entityId, m]) => ({ entityId, entity: m.entity, score: m.score, explanations: m.explanations }))
          .sort((a, b) => b.score - a.score);

        const bestScore = matches[0]!.score;
        conflicts.push({
          id: crypto.randomUUID(),
          legacyRecord: record,
          matches,
          confidence: bestScore >= 40 ? 'high' : bestScore >= 20 ? 'medium' : 'low',
        });
      }
    }

    return conflicts;
  }
}

// ── Invoices (invoice_number + vendor) ──────────────────────

export class InvoicesConflictDetector implements ConflictDetector {
  readonly name = 'invoices_number_vendor';
  readonly entityType: EntityType = 'invoices';
  readonly matchKeys = ['invoiceNumber', 'vendorId'] as const;

  async detectBulk(
    records: TransformedRecord[],
    ctx: DetectorContext
  ): Promise<Conflict[]> {
    if (!ctx.queryFn || records.length === 0) return [];

    const invoiceNumbers = records.map((r) => r.data['invoiceNumber']).filter(Boolean) as unknown[];
    if (invoiceNumbers.length === 0) return [];

    const candidates = await ctx.queryFn({
      entityType: 'invoices',
      orgId: ctx.orgId,
      matchFields: ['id', 'invoiceNumber', 'vendorId'],
      matchValues: { invoiceNumber: invoiceNumbers },
    });

    if (candidates.length === 0) return [];

    const byInvoiceNum = new Map<string, Array<Record<string, unknown>>>();
    for (const c of candidates) {
      const key = String(c['invoiceNumber']);
      if (!byInvoiceNum.has(key)) byInvoiceNum.set(key, []);
      byInvoiceNum.get(key)!.push(c);
    }

    const conflicts: Conflict[] = [];
    for (const record of records) {
      const invNum = record.data['invoiceNumber'] ? String(record.data['invoiceNumber']) : null;
      if (!invNum || !byInvoiceNum.has(invNum)) continue;

      const matchList = byInvoiceNum.get(invNum)!;
      const matches: MatchCandidate[] = matchList.map((c) => {
        let score = 50;
        const explanations: MatchExplanation[] = [{
          field: 'invoiceNumber',
          matchType: 'exact',
          scoreContribution: 50,
          legacyValue: invNum,
          candidateValue: String(c['invoiceNumber']),
        }];
        if (record.data['vendorId'] && String(record.data['vendorId']) === String(c['vendorId'])) {
          score += 40;
          explanations.push({
            field: 'vendorId',
            matchType: 'exact',
            scoreContribution: 40,
            legacyValue: String(record.data['vendorId']),
            candidateValue: String(c['vendorId']),
          });
        }
        return { entityId: String(c['id']), entity: c, score, explanations };
      }).sort((a, b) => b.score - a.score);

      conflicts.push({
        id: crypto.randomUUID(),
        legacyRecord: record,
        matches,
        confidence: matches[0]!.score >= 90 ? 'high' : 'medium',
      });
    }

    return conflicts;
  }
}

// ── Products (sku) ──────────────────────────────────────────

export class ProductsConflictDetector implements ConflictDetector {
  readonly name = 'products_sku';
  readonly entityType: EntityType = 'products';
  readonly matchKeys = ['sku'] as const;

  async detectBulk(
    records: TransformedRecord[],
    ctx: DetectorContext
  ): Promise<Conflict[]> {
    if (!ctx.queryFn || records.length === 0) return [];

    const skus = records.map((r) => r.data['sku']).filter(Boolean) as unknown[];
    if (skus.length === 0) return [];

    const candidates = await ctx.queryFn({
      entityType: 'products',
      orgId: ctx.orgId,
      matchFields: ['id', 'sku', 'name'],
      matchValues: { sku: skus },
    });

    if (candidates.length === 0) return [];

    const bySku = new Map<string, Record<string, unknown>>();
    for (const c of candidates) {
      bySku.set(String(c['sku']), c);
    }

    const conflicts: Conflict[] = [];
    for (const record of records) {
      const sku = record.data['sku'] ? String(record.data['sku']) : null;
      if (!sku || !bySku.has(sku)) continue;

      const candidate = bySku.get(sku)!;
      conflicts.push({
        id: crypto.randomUUID(),
        legacyRecord: record,
        matches: [{
          entityId: String(candidate['id']),
          entity: candidate,
          score: 100,
          explanations: [{
            field: 'sku',
            matchType: 'exact',
            scoreContribution: 100,
            legacyValue: sku,
            candidateValue: String(candidate['sku']),
          }],
        }],
        confidence: 'high',
      });
    }

    return conflicts;
  }
}

// ── Fallback (no conflict detection, lineage-only) ──────────

export class NoConflictDetector implements ConflictDetector {
  readonly name = 'no_conflict';
  readonly matchKeys: readonly string[] = [];

  constructor(public readonly entityType: EntityType) { }

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
