/**
 * Statement Layout Engine
 *
 * Resolves a hierarchical statement layout into a flat list of renderable rows,
 * populates amounts from account balances, and computes subtotals/totals via formulas.
 */

export interface StatementLineSpec {
  lineNumber: number;
  label: string;
  lineType: 'header' | 'detail' | 'subtotal' | 'total' | 'blank';
  indentLevel: number;
  parentLineId: string | null;
  /** JSON array of account ranges, e.g. [{ from: '1000', to: '1999' }] */
  accountRanges: unknown;
  signConvention: 'normal' | 'reversed';
  /** Formula string referencing other line numbers, e.g. 'L10 + L20' */
  formula: string | null;
  isBold: boolean;
  showIfZero: boolean;
}

export interface AccountBalance {
  accountCode: string;
  balanceMinor: number;
}

export interface RenderedLine {
  lineNumber: number;
  label: string;
  lineType: string;
  indentLevel: number;
  amountMinor: number;
  isBold: boolean;
  visible: boolean;
}

interface AccountRange {
  from: string;
  to: string;
}

/**
 * Render a statement by populating detail lines from account balances
 * and computing formula-based subtotals/totals.
 */
export function renderStatement(
  lines: StatementLineSpec[],
  balances: AccountBalance[],
): CalculatorResult<RenderedLine[]> {
  // Build a lookup: accountCode → balance
  const balanceMap = new Map<string, number>();
  for (const b of balances) {
    balanceMap.set(b.accountCode, (balanceMap.get(b.accountCode) ?? 0) + b.balanceMinor);
  }

  // First pass: compute detail line amounts
  const lineAmounts = new Map<number, number>();
  const sorted = [...lines].sort((a, b) => a.lineNumber - b.lineNumber);

  for (const line of sorted) {
    if (line.lineType === 'detail') {
      const ranges = parseAccountRanges(line.accountRanges);
      let amount = sumAccountRange(ranges, balanceMap);
      if (line.signConvention === 'reversed') {
        amount = -amount;
      }
      lineAmounts.set(line.lineNumber, amount);
    } else if (line.lineType === 'header' || line.lineType === 'blank') {
      lineAmounts.set(line.lineNumber, 0);
    }
  }

  // Second pass: compute subtotal/total formulas
  for (const line of sorted) {
    if ((line.lineType === 'subtotal' || line.lineType === 'total') && line.formula) {
      const { result: amount } = evaluateFormula(line.formula, lineAmounts);
      lineAmounts.set(line.lineNumber, amount);
    }
  }

  // Render
  const rendered = sorted.map((line) => {
    const amount = lineAmounts.get(line.lineNumber) ?? 0;
    return {
      lineNumber: line.lineNumber,
      label: line.label,
      lineType: line.lineType,
      indentLevel: line.indentLevel,
      amountMinor: amount,
      isBold: line.isBold,
      visible:
        line.showIfZero || amount !== 0 || line.lineType === 'header' || line.lineType === 'blank',
    };
  });

  return {
    result: rendered,
    inputs: { lineCount: lines.length, balanceCount: balances.length },
    explanation: `Rendered ${rendered.length} statement lines from ${balances.length} account balances`,
  };
}

function parseAccountRanges(raw: unknown): AccountRange[] {
  if (!Array.isArray(raw)) return [];
  return raw as AccountRange[];
}

function sumAccountRange(ranges: AccountRange[], balanceMap: Map<string, number>): number {
  if (ranges.length === 0) return 0;

  let total = 0;
  for (const [code, balance] of balanceMap.entries()) {
    for (const range of ranges) {
      if (code >= range.from && code <= range.to) {
        total += balance;
        break; // avoid double-counting same account
      }
    }
  }
  return total;
}

/**
 * Evaluate a simple formula like 'L10 + L20 - L30'.
 * Supports + and - operators with L{number} references.
 */
export function evaluateFormula(
  formula: string,
  lineAmounts: Map<number, number>,
): CalculatorResult<number> {
  // Tokenize: split on +/- but keep the operator
  const tokens = formula.replace(/\s+/g, '').match(/[+-]?L\d+/g);
  if (!tokens) return { result: 0, inputs: { formula }, explanation: 'No valid tokens in formula' };

  let result = 0;
  for (const token of tokens) {
    const sign = token.startsWith('-') ? -1 : 1;
    const lineRef = token.replace(/^[+-]/, '');
    const lineNum = parseInt(lineRef.replace('L', ''), 10);
    result += sign * (lineAmounts.get(lineNum) ?? 0);
  }
  return {
    result,
    inputs: { formula, tokenCount: tokens.length },
    explanation: `Evaluated formula '${formula}': ${result}`,
  };
}
