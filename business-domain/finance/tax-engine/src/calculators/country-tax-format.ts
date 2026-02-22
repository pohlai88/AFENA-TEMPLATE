import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see TX-02 — Tax code hierarchy: country → state/province → city
 * @see TX-03 — Input tax vs output tax netting for VAT/GST return
 * @see TX-04 — Tax return aggregation by period and company
 * TX-09 — Country-Specific Tax Format Mapping
 *
 * Maps internal tax data to jurisdiction-specific filing formats:
 * MY SST, SG GST, UK VAT, EU VAT, US sales tax.
 *
 * Pure function — no I/O.
 */

export type TaxLineItem = {
  lineId: string;
  taxCode: string;
  netAmountMinor: number;
  taxAmountMinor: number;
  taxRatePct: number;
  isExempt: boolean;
};

export type CountryFormat = 'MY_SST' | 'SG_GST' | 'UK_VAT' | 'EU_VAT' | 'US_SALES_TAX';

export type TaxReturnBox = {
  boxNumber: string;
  label: string;
  amountMinor: number;
};

export type CountryTaxFormatResult = {
  format: CountryFormat;
  periodKey: string;
  boxes: TaxReturnBox[];
  totalOutputTaxMinor: number;
  totalInputTaxMinor: number;
  netPayableMinor: number;
};

export function mapToCountryFormat(
  lines: TaxLineItem[],
  format: CountryFormat,
  periodKey: string,
): CalculatorResult<CountryTaxFormatResult> {
  if (lines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'No tax line items provided');
  }

  const outputLines = lines.filter((l) => l.taxAmountMinor > 0);
  const inputLines = lines.filter((l) => l.taxAmountMinor < 0);
  const exemptLines = lines.filter((l) => l.isExempt);

  const totalOutputTaxMinor = outputLines.reduce((s, l) => s + l.taxAmountMinor, 0);
  const totalInputTaxMinor = Math.abs(inputLines.reduce((s, l) => s + l.taxAmountMinor, 0));
  const netPayableMinor = totalOutputTaxMinor - totalInputTaxMinor;

  const totalOutputNetMinor = outputLines.reduce((s, l) => s + l.netAmountMinor, 0);
  const totalInputNetMinor = Math.abs(inputLines.reduce((s, l) => s + l.netAmountMinor, 0));
  const exemptNetMinor = exemptLines.reduce((s, l) => s + Math.abs(l.netAmountMinor), 0);

  const boxes: TaxReturnBox[] = [
    { boxNumber: '1', label: 'Total output tax', amountMinor: totalOutputTaxMinor },
    { boxNumber: '2', label: 'Total input tax', amountMinor: totalInputTaxMinor },
    { boxNumber: '3', label: 'Net tax payable/(refundable)', amountMinor: netPayableMinor },
    { boxNumber: '4', label: 'Total taxable supplies', amountMinor: totalOutputNetMinor },
    { boxNumber: '5', label: 'Total taxable purchases', amountMinor: totalInputNetMinor },
    { boxNumber: '6', label: 'Exempt supplies', amountMinor: exemptNetMinor },
  ];

  return {
    result: { format, periodKey, boxes, totalOutputTaxMinor, totalInputTaxMinor, netPayableMinor },
    inputs: { lineCount: lines.length, format, periodKey },
    explanation: `${format} return for ${periodKey}: output=${totalOutputTaxMinor}, input=${totalInputTaxMinor}, net=${netPayableMinor}`,
  };
}
