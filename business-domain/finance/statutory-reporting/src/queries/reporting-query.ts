/**
 * Statutory Reporting Queries
 *
 * Read operations against statement_layouts and statement_lines tables.
 */
import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { statementLayouts, statementLines } from 'afenda-database';
import { and, asc, eq } from 'drizzle-orm';

/* ---------- Read Models ---------- */

export interface StatementLayoutReadModel {
  id: string;
  orgId: string;
  layoutCode: string;
  name: string;
  statementType: 'balance-sheet' | 'income-statement' | 'cash-flow' | 'equity-changes';
  standard: 'ifrs' | 'local-gaap' | 'tax' | 'management';
  layoutVersion: number;
  isActive: boolean;
}

export interface StatementLineReadModel {
  id: string;
  orgId: string;
  layoutId: string;
  lineNumber: number;
  label: string;
  lineType: 'header' | 'detail' | 'subtotal' | 'total' | 'blank';
  indentLevel: number;
  parentLineId: string | null;
  accountRanges: unknown;
  signConvention: 'normal' | 'reversed';
  formula: string | null;
  isBold: boolean;
  showIfZero: boolean;
}

/* ---------- Queries ---------- */

export async function getStatementLayout(
  db: DbSession,
  ctx: DomainContext,
  layoutId: string,
): Promise<StatementLayoutReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(statementLayouts)
      .where(and(eq(statementLayouts.orgId, ctx.orgId), eq(statementLayouts.id, layoutId), eq(statementLayouts.isDeleted, false))),
  );
  if (rows.length === 0) throw new Error(`Statement layout ${layoutId} not found`);
  return rows[0] as StatementLayoutReadModel;
}

export async function getActiveLayouts(
  db: DbSession,
  ctx: DomainContext,
  statementType?: string,
): Promise<StatementLayoutReadModel[]> {
  const rows = await db.read((tx) => {
    const conditions = [eq(statementLayouts.orgId, ctx.orgId), eq(statementLayouts.isActive, true), eq(statementLayouts.isDeleted, false)];
    if (statementType) {
      conditions.push(eq(statementLayouts.statementType, statementType));
    }
    return tx
      .select()
      .from(statementLayouts)
      .where(and(...conditions));
  });
  return rows as StatementLayoutReadModel[];
}

export async function getStatementLines(
  db: DbSession,
  ctx: DomainContext,
  layoutId: string,
): Promise<StatementLineReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(statementLines)
      .where(and(eq(statementLines.orgId, ctx.orgId), eq(statementLines.layoutId, layoutId), eq(statementLines.isDeleted, false)))
      .orderBy(asc(statementLines.lineNumber)),
  );
  return rows as StatementLineReadModel[];
}
