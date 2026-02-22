import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { CreditCheckResult } from '../calculators/credit-check';
import { checkCreditLimit } from '../calculators/credit-check';
import type { ExposureResult, InvoiceBalance, OrderAmount } from '../calculators/credit-exposure';
import { computeCreditExposure } from '../calculators/credit-exposure';
import { buildCreditLimitUpdateIntent } from '../commands/credit-intent';
import { getCustomerCredit } from '../queries/credit-query';

export async function getCreditCheck(
  _db: DbSession,
  _ctx: DomainContext,
  input: { creditLimitMinor: number; currentExposureMinor: number; orderAmountMinor: number },
): Promise<DomainResult<CreditCheckResult>> {
  const calc = checkCreditLimit(
    input.creditLimitMinor,
    input.currentExposureMinor,
    input.orderAmountMinor,
  );
  return { kind: 'read', data: calc.result };
}

export async function checkCustomerCreditFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: { customerId: string; orderAmountMinor: number },
): Promise<DomainResult<CreditCheckResult>> {
  const credit = await getCustomerCredit(db, ctx, input.customerId);
  const calc = checkCreditLimit(
    credit.creditLimitMinor,
    credit.currentExposureMinor,
    input.orderAmountMinor,
  );
  return { kind: 'read', data: calc.result };
}

export async function getCreditExposure(
  _db: DbSession,
  _ctx: DomainContext,
  input: { openInvoices: InvoiceBalance[]; pendingOrders: OrderAmount[] },
): Promise<DomainResult<ExposureResult>> {
  const calc = computeCreditExposure(input.openInvoices, input.pendingOrders);
  return { kind: 'read', data: calc.result };
}

export async function updateCreditLimit(
  _db: DbSession,
  ctx: DomainContext,
  input: { customerId: string; newLimitMinor: number; effectiveAt: string; currency: string; reason: string },
): Promise<DomainResult> {
  const intent = buildCreditLimitUpdateIntent(
    {
      customerId: input.customerId,
      newLimitMinor: input.newLimitMinor,
      effectiveAt: input.effectiveAt,
      currency: input.currency,
      reason: input.reason,
      approvedBy: ctx.actor.userId,
    },
    stableCanonicalJson({ customerId: input.customerId, newLimit: input.newLimitMinor }),
  );
  return { kind: 'intent', intents: [intent] };
}

/**
 * @see FIN-CTRL-SOD-01 — Segregation of Duties evaluator.
 *
 * Checks whether a given actor can perform a given action, enforcing
 * that conflicting roles (e.g. creator vs approver) are not held by
 * the same person for the same document.
 */
export type SoDConflict = {
  actorId: string;
  conflictingRoles: string[];
  action: string;
  documentId: string;
  reason: string;
};

export type SoDEvaluationResult = {
  allowed: boolean;
  conflicts: SoDConflict[];
};

export function evaluateSoD(input: {
  actorId: string;
  actorRoles: string[];
  action: string;
  documentId: string;
  documentCreatorId: string;
  documentApproverId?: string;
}): SoDEvaluationResult {
  const conflicts: SoDConflict[] = [];

  if (
    (input.action === 'approve' || input.action === 'authorize') &&
    input.actorId === input.documentCreatorId
  ) {
    conflicts.push({
      actorId: input.actorId,
      conflictingRoles: ['creator', 'approver'],
      action: input.action,
      documentId: input.documentId,
      reason: 'Creator cannot approve their own document',
    });
  }

  if (
    input.action === 'release' &&
    input.documentApproverId &&
    input.actorId === input.documentApproverId
  ) {
    conflicts.push({
      actorId: input.actorId,
      conflictingRoles: ['approver', 'releaser'],
      action: input.action,
      documentId: input.documentId,
      reason: 'Approver cannot release the same document',
    });
  }

  return { allowed: conflicts.length === 0, conflicts };
}
