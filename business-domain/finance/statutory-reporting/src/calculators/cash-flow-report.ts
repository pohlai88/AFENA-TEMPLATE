import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type CashFlowLineItem = {
  label: string;
  section: 'operating' | 'investing' | 'financing';
  amountMinor: number;
};

export type CashFlowReportResult = {
  operatingMinor: number;
  investingMinor: number;
  financingMinor: number;
  netChangeMinor: number;
  openingCashMinor: number;
  closingCashMinor: number;
  lineItems: CashFlowLineItem[];
};

export function renderCashFlowStatement(
  lineItems: CashFlowLineItem[],
  openingCashMinor: number,
): CalculatorResult<CashFlowReportResult> {
  if (lineItems.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Cash flow statement must have at least one line item');
  }

  let operating = 0;
  let investing = 0;
  let financing = 0;

  for (const item of lineItems) {
    switch (item.section) {
      case 'operating': operating += item.amountMinor; break;
      case 'investing': investing += item.amountMinor; break;
      case 'financing': financing += item.amountMinor; break;
    }
  }

  const netChange = operating + investing + financing;

  return {
    result: { operatingMinor: operating, investingMinor: investing, financingMinor: financing, netChangeMinor: netChange, openingCashMinor, closingCashMinor: openingCashMinor + netChange, lineItems },
    inputs: { lineItemCount: lineItems.length, openingCashMinor },
    explanation: `Cash flow statement (IAS 7 indirect): Operating ${operating}, Investing ${investing}, Financing ${financing}. Opening ${openingCashMinor} → Closing ${openingCashMinor + netChange}.`,
  };
}
