import type { CalculatorResult } from 'afenda-canon';

/**
 * @see TR-10 — Cash flow statement (indirect method) auto-generation
 * @see FC-08 — Cash flow statement: indirect method (IAS 7)
 * @see SR-04 — Cash flow statement: indirect method (IAS 7)
 */
export type CashFlowInput = {
  netIncomeMinor: number;
  depreciationMinor: number;
  amortizationMinor: number;
  changeInReceivablesMinor: number;
  changeInPayablesMinor: number;
  changeInInventoryMinor: number;
  otherOperatingMinor: number;
  capexMinor: number;
  investmentPurchasesMinor: number;
  investmentProceedsMinor: number;
  debtIssuedMinor: number;
  debtRepaidMinor: number;
  dividendsPaidMinor: number;
  equityIssuedMinor: number;
};

export type CashFlowStatementResult = {
  operatingMinor: number;
  investingMinor: number;
  financingMinor: number;
  netChangeMinor: number;
};

export function computeCashFlowIndirect(
  input: CashFlowInput,
): CalculatorResult<CashFlowStatementResult> {
  const operating =
    input.netIncomeMinor +
    input.depreciationMinor +
    input.amortizationMinor -
    input.changeInReceivablesMinor +
    input.changeInPayablesMinor -
    input.changeInInventoryMinor +
    input.otherOperatingMinor;

  const investing =
    -input.capexMinor -
    input.investmentPurchasesMinor +
    input.investmentProceedsMinor;

  const financing =
    input.debtIssuedMinor -
    input.debtRepaidMinor -
    input.dividendsPaidMinor +
    input.equityIssuedMinor;

  const netChange = operating + investing + financing;

  return {
    result: { operatingMinor: operating, investingMinor: investing, financingMinor: financing, netChangeMinor: netChange },
    inputs: { netIncomeMinor: input.netIncomeMinor },
    explanation: `Cash flow (indirect): Operating ${operating}, Investing ${investing}, Financing ${financing}. Net change: ${netChange}.`,
  };
}
