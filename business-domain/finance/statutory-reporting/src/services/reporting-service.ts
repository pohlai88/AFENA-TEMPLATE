/**
 * Statutory Reporting Service
 *
 * Orchestrates financial statement generation:
 * - Fetches statement layout and line definitions
 * - Renders the statement by mapping account balances to lines
 * - Evaluates formulas for subtotals and totals
 * - Returns the rendered statement as a DomainResult
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { AccountBalance, StatementLineSpec } from '../calculators/statement-engine';
import { renderStatement } from '../calculators/statement-engine';
import { buildStatementArtifact } from '../commands/reporting-command';
import {
  getActiveLayouts,
  getStatementLayout,
  getStatementLines,
} from '../queries/reporting-query';

/* ---------- Read Operations ---------- */

export async function fetchStatementLayouts(
  db: DbSession,
  ctx: DomainContext,
  statementType?: string,
): Promise<DomainResult> {
  const layouts = await getActiveLayouts(db, ctx, statementType);
  return { kind: 'read', data: { layouts } };
}

export async function fetchStatementLayout(
  db: DbSession,
  ctx: DomainContext,
  layoutId: string,
): Promise<DomainResult> {
  const layout = await getStatementLayout(db, ctx, layoutId);
  const lines = await getStatementLines(db, ctx, layoutId);
  return { kind: 'read', data: { layout, lines } };
}

/**
 * Generate (render) a financial statement for a given layout and period balances.
 *
 * This is the main entry point: it loads the layout + line specs,
 * applies account balances, evaluates formulas, and returns the rendered output.
 */
export async function generateStatement(
  db: DbSession,
  ctx: DomainContext,
  input: {
    layoutId: string;
    periodKey: string;
    balances: AccountBalance[];
  },
): Promise<DomainResult> {
  // 1. Fetch layout metadata
  const layout = await getStatementLayout(db, ctx, input.layoutId);

  // 2. Fetch line definitions
  const lineRows = await getStatementLines(db, ctx, input.layoutId);

  // 3. Map DB rows to StatementLineSpec
  const lineSpecs: StatementLineSpec[] = lineRows.map((row) => ({
    lineNumber: row.lineNumber,
    label: row.label,
    lineType: row.lineType,
    indentLevel: row.indentLevel,
    parentLineId: row.parentLineId,
    accountRanges: row.accountRanges,
    signConvention: row.signConvention,
    formula: row.formula,
    isBold: row.isBold,
    showIfZero: row.showIfZero,
  }));

  // 4. Render statement
  const { result: rendered } = renderStatement(lineSpecs, input.balances);

  // 5. Build artifact
  const artifact = buildStatementArtifact({
    layoutId: layout.id,
    layoutCode: layout.layoutCode,
    statementType: layout.statementType,
    standard: layout.standard,
    periodKey: input.periodKey,
    generatedAt: input.generatedAt,
    renderedLines: rendered,
  });

  return {
    kind: 'read',
    data: { artifact, renderedLines: rendered },
  };
}

/**
 * @see FIN-REP-SNAP-01 — Run a reproducible report snapshot.
 *
 * Generates the statement and wraps it in a timestamped snapshot
 * that can be stored for audit trail and drill-down comparison.
 */
export type ReportSnapshot = {
  snapshotId: string;
  layoutId: string;
  periodKey: string;
  generatedAt: string;
  lineCount: number;
  totalLines: number;
  artifact: ReturnType<typeof buildStatementArtifact>;
};

export async function runReportSnapshot(
  db: DbSession,
  ctx: DomainContext,
  input: {
    snapshotId: string;
    layoutId: string;
    periodKey: string;
    balances: AccountBalance[];
    generatedAt: string;
  },
): Promise<DomainResult<ReportSnapshot>> {
  const layout = await getStatementLayout(db, ctx, input.layoutId);
  const lineRows = await getStatementLines(db, ctx, input.layoutId);

  const lineSpecs: StatementLineSpec[] = lineRows.map((row) => ({
    lineNumber: row.lineNumber,
    label: row.label,
    lineType: row.lineType,
    indentLevel: row.indentLevel,
    parentLineId: row.parentLineId,
    accountRanges: row.accountRanges,
    signConvention: row.signConvention,
    formula: row.formula,
    isBold: row.isBold,
    showIfZero: row.showIfZero,
  }));

  const { result: rendered } = renderStatement(lineSpecs, input.balances);

  const artifact = buildStatementArtifact({
    layoutId: layout.id,
    layoutCode: layout.layoutCode,
    statementType: layout.statementType,
    standard: layout.standard,
    periodKey: input.periodKey,
    generatedAt: input.generatedAt,
    renderedLines: rendered,
  });

  const snapshot: ReportSnapshot = {
    snapshotId: input.snapshotId,
    layoutId: input.layoutId,
    periodKey: input.periodKey,
    generatedAt: input.generatedAt,
    lineCount: artifact.lines.length,
    totalLines: rendered.length,
    artifact,
  };

  return { kind: 'read', data: snapshot };
}
