import { describe, expect, it, vi } from 'vitest';

import type { AccountBalance, StatementLineSpec } from '../calculators/statement-engine';
import { evaluateFormula, renderStatement } from '../calculators/statement-engine';
import { buildStatementArtifact } from '../commands/reporting-command';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
}));

/* ────────── Statement Engine ────────── */

describe('renderStatement', () => {
  const lines: StatementLineSpec[] = [
    {
      lineNumber: 10,
      label: 'Revenue',
      lineType: 'header',
      indentLevel: 0,
      parentLineId: null,
      accountRanges: null,
      signConvention: 'normal',
      formula: null,
      isBold: true,
      showIfZero: true,
    },
    {
      lineNumber: 20,
      label: 'Sales Revenue',
      lineType: 'detail',
      indentLevel: 1,
      parentLineId: null,
      accountRanges: [{ from: '4000', to: '4999' }],
      signConvention: 'normal',
      formula: null,
      isBold: false,
      showIfZero: false,
    },
    {
      lineNumber: 30,
      label: 'Cost of Sales',
      lineType: 'detail',
      indentLevel: 1,
      parentLineId: null,
      accountRanges: [{ from: '5000', to: '5999' }],
      signConvention: 'reversed',
      formula: null,
      isBold: false,
      showIfZero: false,
    },
    {
      lineNumber: 40,
      label: 'Gross Profit',
      lineType: 'subtotal',
      indentLevel: 0,
      parentLineId: null,
      accountRanges: null,
      signConvention: 'normal',
      formula: 'L20 - L30',
      isBold: true,
      showIfZero: true,
    },
  ];

  const balances: AccountBalance[] = [
    { accountCode: '4100', balanceMinor: 100000 },
    { accountCode: '4200', balanceMinor: 50000 },
    { accountCode: '5100', balanceMinor: 60000 },
  ];

  it('aggregates account balances into detail lines', () => {
    const { result: rendered } = renderStatement(lines, balances);
    const salesLine = rendered.find((r) => r.lineNumber === 20);
    expect(salesLine!.amountMinor).toBe(150000); // 100000 + 50000
  });

  it('applies reversed sign convention', () => {
    const { result: rendered } = renderStatement(lines, balances);
    const costLine = rendered.find((r) => r.lineNumber === 30);
    expect(costLine!.amountMinor).toBe(-60000); // reversed
  });

  it('evaluates subtotal formula (L20 - L30)', () => {
    const { result: rendered } = renderStatement(lines, balances);
    const grossProfit = rendered.find((r) => r.lineNumber === 40);
    // L20=150000, L30=-60000 → 150000 - (-60000) = 210000
    expect(grossProfit!.amountMinor).toBe(210000);
  });

  it('marks header lines as visible even with zero amount', () => {
    const { result: rendered } = renderStatement(lines, []);
    const header = rendered.find((r) => r.lineNumber === 10);
    expect(header!.visible).toBe(true);
    expect(header!.amountMinor).toBe(0);
  });

  it('hides detail lines with zero amount when showIfZero=false', () => {
    const { result: rendered } = renderStatement(lines, []);
    const salesLine = rendered.find((r) => r.lineNumber === 20);
    expect(salesLine!.visible).toBe(false);
  });

  it('handles empty lines list', () => {
    expect(renderStatement([], balances).result).toEqual([]);
  });

  it('handles empty balances', () => {
    const { result: rendered } = renderStatement(lines, []);
    expect(rendered).toHaveLength(4);
  });
});

/* ────────── Formula Evaluator ────────── */

describe('evaluateFormula', () => {
  const lineAmounts = new Map<number, number>([
    [10, 1000],
    [20, 500],
    [30, 200],
  ]);

  it('evaluates simple addition', () => {
    expect(evaluateFormula('L10 + L20', lineAmounts).result).toBe(1500);
  });

  it('evaluates subtraction', () => {
    expect(evaluateFormula('L10 - L30', lineAmounts).result).toBe(800);
  });

  it('evaluates multi-term formula', () => {
    expect(evaluateFormula('L10 + L20 - L30', lineAmounts).result).toBe(1300);
  });

  it('returns 0 for missing line references', () => {
    expect(evaluateFormula('L99 + L10', lineAmounts).result).toBe(1000);
  });

  it('returns 0 for empty formula', () => {
    expect(evaluateFormula('', lineAmounts).result).toBe(0);
  });
});

/* ────────── Statement Artifact ────────── */

describe('buildStatementArtifact', () => {
  it('builds artifact with visible lines only', () => {
    const artifact = buildStatementArtifact({
      layoutId: 'lay-1',
      layoutCode: 'BS-IFRS',
      statementType: 'balance-sheet',
      standard: 'ifrs',
      periodKey: '2024-P12',
      generatedAt: '2024-12-31T23:59:59Z',
      renderedLines: [
        {
          lineNumber: 10,
          label: 'Assets',
          lineType: 'header',
          amountMinor: 0,
          isBold: true,
          visible: true,
        },
        {
          lineNumber: 20,
          label: 'Cash',
          lineType: 'detail',
          amountMinor: 50000,
          isBold: false,
          visible: true,
        },
        {
          lineNumber: 30,
          label: 'Hidden',
          lineType: 'detail',
          amountMinor: 0,
          isBold: false,
          visible: false,
        },
      ],
    });

    expect(artifact.layoutCode).toBe('BS-IFRS');
    expect(artifact.lines).toHaveLength(2); // hidden line excluded
    expect(artifact.periodKey).toBe('2024-P12');
    expect(artifact.generatedAt).toBeTruthy();
  });
});
