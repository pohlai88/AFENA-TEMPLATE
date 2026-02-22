import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * CO-09 — IC Netting: Offset Payables vs Receivables for Settlement
 *
 * Matches intercompany payables against receivables by company pair + currency,
 * computes net settlement amounts and residual unmatched balances.
 * Pure function — no I/O.
 */

export type IcBalance = {
  fromCompanyId: string;
  toCompanyId: string;
  currency: string;
  amountMinor: number;
  type: 'payable' | 'receivable';
};

export type NettedPair = {
  companyA: string;
  companyB: string;
  currency: string;
  grossPayableMinor: number;
  grossReceivableMinor: number;
  netSettlementMinor: number;
  direction: 'A-pays-B' | 'B-pays-A' | 'zero';
};

export type IcNettingResult = {
  nettedPairs: NettedPair[];
  totalGrossMinor: number;
  totalNetMinor: number;
  reductionPct: number;
};

export function computeIcNetting(balances: IcBalance[]): CalculatorResult<IcNettingResult> {
  if (balances.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one IC balance required');

  // Group by normalised company pair + currency
  const pairMap = new Map<string, { payableMinor: number; receivableMinor: number; companyA: string; companyB: string; currency: string }>();

  for (const b of balances) {
    if (b.amountMinor < 0) throw new DomainError('VALIDATION_FAILED', 'IC balance amounts must be non-negative');

    const sorted = [b.fromCompanyId, b.toCompanyId].sort();
    const cA = sorted[0] as string;
    const cB = sorted[1] as string;
    const key = `${cA}|${cB}|${b.currency}`;

    if (!pairMap.has(key)) {
      pairMap.set(key, { payableMinor: 0, receivableMinor: 0, companyA: cA, companyB: cB, currency: b.currency });
    }
    const pair = pairMap.get(key)!;

    if (b.type === 'payable') {
      pair.payableMinor += b.amountMinor;
    } else {
      pair.receivableMinor += b.amountMinor;
    }
  }

  let totalGross = 0;
  let totalNet = 0;

  const nettedPairs: NettedPair[] = [...pairMap.values()].map((p) => {
    const gross = p.payableMinor + p.receivableMinor;
    const net = Math.abs(p.payableMinor - p.receivableMinor);
    totalGross += gross;
    totalNet += net;

    let direction: NettedPair['direction'] = 'zero';
    if (p.payableMinor > p.receivableMinor) direction = 'A-pays-B';
    else if (p.receivableMinor > p.payableMinor) direction = 'B-pays-A';

    return {
      companyA: p.companyA,
      companyB: p.companyB,
      currency: p.currency,
      grossPayableMinor: p.payableMinor,
      grossReceivableMinor: p.receivableMinor,
      netSettlementMinor: net,
      direction,
    };
  });

  const reductionPct = totalGross > 0 ? Math.round((1 - totalNet / totalGross) * 10000) / 100 : 0;

  return {
    result: { nettedPairs, totalGrossMinor: totalGross, totalNetMinor: totalNet, reductionPct },
    inputs: { balanceCount: balances.length },
    explanation: `IC netting: ${nettedPairs.length} pairs, gross=${totalGross}, net=${totalNet}, reduction=${reductionPct}%`,
  };
}
