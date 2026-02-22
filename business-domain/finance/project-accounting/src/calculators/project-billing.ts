import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * PA-06 — Project Billing: Milestone, Time-and-Material, Fixed-Fee (IFRS 15)
 * Pure function — no I/O.
 */

export type BillingType = 'milestone' | 'time_and_material' | 'fixed_fee';
export type Milestone = { milestoneId: string; description: string; amountMinor: number; completePct: number };
export type TimeEntry = { hours: number; rateMinor: number };

export type ProjectBillingInput = { projectId: string; billingType: BillingType; milestones?: Milestone[]; timeEntries?: TimeEntry[]; fixedFeeMinor?: number; percentComplete?: number };

export type ProjectBillingResult = { projectId: string; billingType: BillingType; billableMinor: number; lineItems: { description: string; amountMinor: number }[] };

export function computeProjectBilling(input: ProjectBillingInput): CalculatorResult<ProjectBillingResult> {
  const lineItems: { description: string; amountMinor: number }[] = [];

  if (input.billingType === 'milestone') {
    if (!input.milestones?.length) throw new DomainError('VALIDATION_FAILED', 'Milestones required for milestone billing');
    for (const m of input.milestones) {
      if (m.completePct >= 100) lineItems.push({ description: m.description, amountMinor: m.amountMinor });
    }
  } else if (input.billingType === 'time_and_material') {
    if (!input.timeEntries?.length) throw new DomainError('VALIDATION_FAILED', 'Time entries required for T&M billing');
    for (const t of input.timeEntries) lineItems.push({ description: `${t.hours}h @ ${t.rateMinor}`, amountMinor: Math.round(t.hours * t.rateMinor) });
  } else {
    if (!input.fixedFeeMinor || input.percentComplete === undefined) throw new DomainError('VALIDATION_FAILED', 'Fixed fee and percent complete required');
    const billable = Math.round(input.fixedFeeMinor * input.percentComplete / 100);
    lineItems.push({ description: `Fixed fee ${input.percentComplete}% complete`, amountMinor: billable });
  }

  const billableMinor = lineItems.reduce((s, l) => s + l.amountMinor, 0);
  return { result: { projectId: input.projectId, billingType: input.billingType, billableMinor, lineItems }, inputs: input, explanation: `Project billing (${input.billingType}): ${billableMinor}` };
}
