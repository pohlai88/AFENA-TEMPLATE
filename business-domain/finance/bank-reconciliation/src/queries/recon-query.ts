import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { reconciliationItems } from 'afenda-database';
import { and, asc, eq } from 'drizzle-orm';

// ── Read Models ─────────────────────────────────────────────

export type ReconciliationItemReadModel = {
  itemId: string;
  bankStatementId: string;
  transactionDate: string;
  valueDate: string | null;
  amountMinor: number;
  currencyCode: string;
  bankReference: string | null;
  bankDescription: string | null;
  matchStatus: string;
  matchedDocumentId: string | null;
  matchedDocumentType: string | null;
  matchConfidence: string | null;
  matchedBy: string | null;
};

// ── Select shape (DRY) ─────────────────────────────────────

const selectShape = {
  itemId: reconciliationItems.id,
  bankStatementId: reconciliationItems.bankStatementId,
  transactionDate: reconciliationItems.transactionDate,
  valueDate: reconciliationItems.valueDate,
  amountMinor: reconciliationItems.amountMinor,
  currencyCode: reconciliationItems.currencyCode,
  bankReference: reconciliationItems.bankReference,
  bankDescription: reconciliationItems.bankDescription,
  matchStatus: reconciliationItems.matchStatus,
  matchedDocumentId: reconciliationItems.matchedDocumentId,
  matchedDocumentType: reconciliationItems.matchedDocumentType,
  matchConfidence: reconciliationItems.matchConfidence,
  matchedBy: reconciliationItems.matchedBy,
} as const;

// ── Queries ─────────────────────────────────────────────────

/**
 * Get a single reconciliation item by ID.
 */
export async function getReconciliationItemById(
  db: DbSession,
  ctx: DomainContext,
  itemId: string,
): Promise<ReconciliationItemReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select(selectShape)
      .from(reconciliationItems)
      .where(
        and(
          eq(reconciliationItems.orgId, ctx.orgId),
          eq(reconciliationItems.id, itemId),
          eq(reconciliationItems.isDeleted, false),
        ),
      )
      .limit(1),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Reconciliation item not found: ${itemId}`, { itemId });
  }

  return toReadModel(rows[0]!);
}

/**
 * Load unmatched bank statement items for reconciliation review.
 *
 * @see BR-01 — Bank reconciliation matching engine
 */
export async function getUnmatchedBankItems(
  db: DbSession,
  ctx: DomainContext,
  input: { bankStatementId: string },
): Promise<ReconciliationItemReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select(selectShape)
      .from(reconciliationItems)
      .where(
        and(
          eq(reconciliationItems.orgId, ctx.orgId),
          eq(reconciliationItems.bankStatementId, input.bankStatementId),
          eq(reconciliationItems.matchStatus, 'unmatched'),
          eq(reconciliationItems.isDeleted, false),
        ),
      )
      .orderBy(asc(reconciliationItems.transactionDate)),
  );

  return rows.map(toReadModel);
}

/**
 * Load all reconciliation items for a bank statement (all statuses).
 */
export async function getItemsByStatement(
  db: DbSession,
  ctx: DomainContext,
  input: { bankStatementId: string },
): Promise<ReconciliationItemReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select(selectShape)
      .from(reconciliationItems)
      .where(
        and(
          eq(reconciliationItems.orgId, ctx.orgId),
          eq(reconciliationItems.bankStatementId, input.bankStatementId),
          eq(reconciliationItems.isDeleted, false),
        ),
      )
      .orderBy(asc(reconciliationItems.transactionDate)),
  );

  return rows.map(toReadModel);
}

// ── Helpers ─────────────────────────────────────────────────

function toReadModel(
  r: typeof selectShape extends infer S ? { [K in keyof S]: unknown } : never,
): ReconciliationItemReadModel {
  return {
    itemId: r.itemId as string,
    bankStatementId: r.bankStatementId as string,
    transactionDate: String(r.transactionDate),
    valueDate: r.valueDate ? String(r.valueDate) : null,
    amountMinor: Number(r.amountMinor),
    currencyCode: r.currencyCode as string,
    bankReference: r.bankReference as string | null,
    bankDescription: r.bankDescription as string | null,
    matchStatus: r.matchStatus as string,
    matchedDocumentId: r.matchedDocumentId as string | null,
    matchedDocumentType: r.matchedDocumentType as string | null,
    matchConfidence: r.matchConfidence as string | null,
    matchedBy: r.matchedBy as string | null,
  };
}
