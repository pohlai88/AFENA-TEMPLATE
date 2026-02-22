import { DomainError, stableCanonicalJson } from 'afenda-canon';

import { matchIcTransactions } from '../calculators/ic-matching';
import { buildIcMatchIntent, buildIcMirrorIntent } from '../commands/ic-intent';
import { getUnmatchedIcTransactions } from '../queries/ic-query';

import type { IcMatchPair, IcTransaction } from '../calculators/ic-matching';
import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

export type IcReconciliationResult = {
  matched: IcMatchPair[];
  unmatchedOutgoing: IcTransaction[];
  unmatchedIncoming: IcTransaction[];
  totalMatched: number;
  totalUnmatched: number;
};

export function reconcileIntercompany(
  _db: DbSession,
  _ctx: DomainContext,
  input: { outgoing: IcTransaction[]; incoming: IcTransaction[] },
): DomainResult<IcReconciliationResult> {
  const calc = matchIcTransactions(input.outgoing, input.incoming);

  const intents = calc.result.matched
    .filter((m) => m.isBalanced)
    .map((m) =>
      buildIcMatchIntent(
        {
          senderTransactionId: m.outgoing.transactionId,
          receiverTransactionId: m.incoming.transactionId,
          matchConfidence: 1.0,
        },
        stableCanonicalJson({
          sender: m.outgoing.transactionId,
          receiver: m.incoming.transactionId,
        }),
      ),
    );

  const data = {
    ...calc.result,
    totalMatched: calc.result.matched.length,
    totalUnmatched: calc.result.unmatchedOutgoing.length + calc.result.unmatchedIncoming.length,
  };

  return intents.length > 0 ? { kind: 'intent+read', data, intents } : { kind: 'read', data };
}

export async function reconcileFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: { companyId: string; counterpartyCompanyId: string },
): Promise<DomainResult<IcReconciliationResult>> {
  const outgoing = await getUnmatchedIcTransactions(db, ctx, { companyId: input.companyId });
  const incoming = await getUnmatchedIcTransactions(db, ctx, {
    companyId: input.counterpartyCompanyId,
  });

  const asIcTx = (r: (typeof outgoing)[number]): IcTransaction => ({
    transactionId: r.transactionId,
    fromCompanyId: r.fromCompanyId,
    toCompanyId: r.toCompanyId,
    amountMinor: r.amountMinor,
    currency: r.currencyCode,
    reference: r.sourceDocRef ?? '',
  });

  return reconcileIntercompany(db, ctx, {
    outgoing: outgoing.map(asIcTx),
    incoming: incoming.map(asIcTx),
  });
}

/**
 * @see FIN-IC-MIRROR-01 — Create an IC transaction and its mirror in the counterparty.
 *
 * Emits two intents: one for the sender side and one for the receiver side,
 * linked by a shared reference. Auto-balancing is enforced by construction.
 */
export function createAndMirrorIc(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    senderCompanyId: string;
    receiverCompanyId: string;
    amountMinor: number;
    currency: string;
    reference: string;
    senderTransactionId: string;
    receiverTransactionId: string;
  },
): DomainResult {
  if (input.senderCompanyId === input.receiverCompanyId) {
    throw new DomainError('IC_SAME_COMPANY', 'IC transaction cannot be within the same company');
  }

  const sharedFields = {
    senderCompanyId: input.senderCompanyId,
    receiverCompanyId: input.receiverCompanyId,
    amountMinor: input.amountMinor,
    currency: input.currency,
    reference: input.reference,
  };

  return {
    kind: 'intent',
    intents: [
      buildIcMirrorIntent(
        { ...sharedFields, transactionId: input.senderTransactionId, side: 'sender' },
        stableCanonicalJson({
          transactionId: input.senderTransactionId,
          side: 'sender',
          reference: input.reference,
        }),
      ),
      buildIcMirrorIntent(
        { ...sharedFields, transactionId: input.receiverTransactionId, side: 'receiver' },
        stableCanonicalJson({
          transactionId: input.receiverTransactionId,
          side: 'receiver',
          reference: input.reference,
        }),
      ),
    ],
  };
}
