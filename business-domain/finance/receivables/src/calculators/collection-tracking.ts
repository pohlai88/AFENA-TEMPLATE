import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * AR-06 — Collection Action Tracking (Dunning Process)
 *
 * Determines next collection action based on aging and prior actions.
 * Escalates: reminder → phone call → formal letter → legal.
 *
 * Pure function — no I/O.
 */

export type CollectionAction = {
  actionType: 'reminder' | 'phone_call' | 'formal_letter' | 'legal';
  dateIso: string;
  notes: string;
};

export type OverdueInvoice = {
  invoiceId: string;
  customerId: string;
  amountMinor: number;
  dueDateIso: string;
  daysOverdue: number;
  priorActions: CollectionAction[];
};

export type CollectionPlan = {
  invoiceId: string;
  customerId: string;
  amountMinor: number;
  daysOverdue: number;
  nextAction: 'reminder' | 'phone_call' | 'formal_letter' | 'legal' | 'none';
  escalationLevel: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
};

export type CollectionPlanResult = {
  plans: CollectionPlan[];
  totalOverdueMinor: number;
  criticalCount: number;
};

export function planCollectionActions(
  invoices: OverdueInvoice[],
): CalculatorResult<CollectionPlanResult> {
  if (invoices.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'No overdue invoices provided');
  }

  const escalationOrder: CollectionPlan['nextAction'][] = ['reminder', 'phone_call', 'formal_letter', 'legal'];

  const plans: CollectionPlan[] = invoices.map((inv) => {
    const lastAction = inv.priorActions.length > 0
      ? inv.priorActions[inv.priorActions.length - 1]!.actionType
      : null;

    const lastIdx = lastAction ? escalationOrder.indexOf(lastAction) : -1;
    const nextIdx = Math.min(lastIdx + 1, escalationOrder.length - 1);
    const nextAction = escalationOrder[nextIdx]!;

    const priority: CollectionPlan['priority'] =
      inv.daysOverdue > 90 ? 'critical' :
      inv.daysOverdue > 60 ? 'high' :
      inv.daysOverdue > 30 ? 'medium' : 'low';

    return {
      invoiceId: inv.invoiceId,
      customerId: inv.customerId,
      amountMinor: inv.amountMinor,
      daysOverdue: inv.daysOverdue,
      nextAction,
      escalationLevel: nextIdx + 1,
      priority,
    };
  });

  const totalOverdueMinor = plans.reduce((s, p) => s + p.amountMinor, 0);
  const criticalCount = plans.filter((p) => p.priority === 'critical').length;

  return {
    result: { plans, totalOverdueMinor, criticalCount },
    inputs: { invoiceCount: invoices.length },
    explanation: `Collection plan: ${plans.length} invoices, ${criticalCount} critical, total overdue ${totalOverdueMinor}`,
  };
}
