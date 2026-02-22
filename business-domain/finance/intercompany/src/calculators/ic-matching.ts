import { DomainError } from 'afenda-canon';

import type { CalculatorResult } from 'afenda-canon';

/**
 * @see CO-02 — Intercompany transaction matching (IC payable = IC receivable)
 */
export type IcTransaction = {
  transactionId: string;
  fromCompanyId: string;
  toCompanyId: string;
  amountMinor: number;
  currency: string;
  reference: string;
};

export type IcMatchPair = {
  outgoing: IcTransaction;
  incoming: IcTransaction;
  isBalanced: boolean;
  differenceMinor: number;
};

export function matchIcTransactions(
  outgoing: IcTransaction[],
  incoming: IcTransaction[],
): CalculatorResult<{
  matched: IcMatchPair[];
  unmatchedOutgoing: IcTransaction[];
  unmatchedIncoming: IcTransaction[];
}> {
  const matched: IcMatchPair[] = [];
  const usedIncoming = new Set<string>();

  for (const out of outgoing) {
    if (out.fromCompanyId === out.toCompanyId) {
      throw new DomainError('VALIDATION_FAILED', 'IC transaction cannot be within same company', {
        transactionId: out.transactionId,
      });
    }

    const match = incoming.find(
      (inc) =>
        !usedIncoming.has(inc.transactionId) &&
        inc.fromCompanyId === out.toCompanyId &&
        inc.toCompanyId === out.fromCompanyId &&
        inc.currency === out.currency &&
        inc.reference === out.reference,
    );

    if (match) {
      usedIncoming.add(match.transactionId);
      const diff = out.amountMinor - match.amountMinor;
      matched.push({
        outgoing: out,
        incoming: match,
        isBalanced: diff === 0,
        differenceMinor: Math.abs(diff),
      });
    }
  }

  const unmatchedOutgoing = outgoing.filter(
    (o) => !matched.some((m) => m.outgoing.transactionId === o.transactionId),
  );
  const unmatchedIncoming = incoming.filter((i) => !usedIncoming.has(i.transactionId));

  return {
    result: { matched, unmatchedOutgoing, unmatchedIncoming },
    inputs: { outgoing, incoming },
    explanation: `IC matching: ${matched.length} matched, ${unmatchedOutgoing.length} unmatched outgoing, ${unmatchedIncoming.length} unmatched incoming`,
  };
}
