/**
 * Statutory Reporting Commands
 *
 * Statement generation is primarily a read operation (rendering layouts with balances).
 * This module provides helpers for packaging rendered statements as output artifacts.
 *
 * Note: No dedicated statutory-reporting intent type exists in the current canon union.
 * When statement publication is needed, downstream consumers may use a journal posting
 * or a custom extension point.
 */

export interface StatementArtifact {
  layoutId: string;
  layoutCode: string;
  statementType: string;
  standard: string;
  generatedAt: string;
  periodKey: string;
  lines: Array<{
    lineNumber: number;
    label: string;
    lineType: string;
    amountMinor: number;
    isBold: boolean;
  }>;
}

/**
 * Package rendered statement lines into a publishable artifact.
 */
export function buildStatementArtifact(input: {
  layoutId: string;
  layoutCode: string;
  statementType: string;
  standard: string;
  periodKey: string;
  generatedAt: string;
  renderedLines: Array<{
    lineNumber: number;
    label: string;
    lineType: string;
    amountMinor: number;
    isBold: boolean;
    visible: boolean;
  }>;
}): StatementArtifact {
  return {
    layoutId: input.layoutId,
    layoutCode: input.layoutCode,
    statementType: input.statementType,
    standard: input.standard,
    generatedAt: input.generatedAt,
    periodKey: input.periodKey,
    lines: input.renderedLines
      .filter((l) => l.visible)
      .map((l) => ({
        lineNumber: l.lineNumber,
        label: l.label,
        lineType: l.lineType,
        amountMinor: l.amountMinor,
        isBold: l.isBold,
      })),
  };
}
