import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FC-07 — Period-end close checklist automation
 * @see FC-09 — Management representation letter generation
 * @see SR-02 — Segment reporting (IFRS 8)
 * @see SR-03 — Earnings per share (IAS 33)
 * @see SR-05 — Notes: Accounting Policies, Estimates, Judgements (IAS 1 §117–124)
 * @see SR-08 — Going concern assessment disclosure
 *
 * Generates structured disclosure notes for financial statements covering
 * significant accounting policies, critical estimates, and key judgements.
 * Pure function — no I/O.
 */

export type AccountingPolicy = {
  policyId: string;
  title: string;
  standard: string;
  description: string;
  changeInPeriod: boolean;
};

export type SignificantEstimate = {
  estimateId: string;
  title: string;
  description: string;
  sensitivityDescription: string;
  carryingAmountMinor: number;
};

export type KeyJudgement = {
  judgementId: string;
  title: string;
  description: string;
  impactArea: string;
};

export type AccountingPoliciesNoteInput = {
  reportingEntityName: string;
  fiscalYear: string;
  policies: AccountingPolicy[];
  estimates: SignificantEstimate[];
  judgements: KeyJudgement[];
};

export type NoteSection = {
  sectionId: string;
  title: string;
  itemCount: number;
  items: { id: string; title: string; detail: string }[];
};

export type AccountingPoliciesNoteResult = {
  entityName: string;
  fiscalYear: string;
  sections: NoteSection[];
  totalPolicies: number;
  totalEstimates: number;
  totalJudgements: number;
  changedPoliciesCount: number;
};

export function generateAccountingPoliciesNote(input: AccountingPoliciesNoteInput): CalculatorResult<AccountingPoliciesNoteResult> {
  const { reportingEntityName, fiscalYear, policies, estimates, judgements } = input;

  if (!reportingEntityName) throw new DomainError('VALIDATION_FAILED', 'reportingEntityName is required');
  if (!fiscalYear) throw new DomainError('VALIDATION_FAILED', 'fiscalYear is required');

  const policySection: NoteSection = {
    sectionId: 'policies',
    title: 'Significant Accounting Policies (IAS 1 §117)',
    itemCount: policies.length,
    items: policies.map((p) => ({
      id: p.policyId,
      title: `${p.title} (${p.standard})`,
      detail: p.changeInPeriod ? `[CHANGED] ${p.description}` : p.description,
    })),
  };

  const estimateSection: NoteSection = {
    sectionId: 'estimates',
    title: 'Critical Accounting Estimates (IAS 1 §125)',
    itemCount: estimates.length,
    items: estimates.map((e) => ({
      id: e.estimateId,
      title: e.title,
      detail: `${e.description}. Sensitivity: ${e.sensitivityDescription}. Carrying amount: ${e.carryingAmountMinor}`,
    })),
  };

  const judgementSection: NoteSection = {
    sectionId: 'judgements',
    title: 'Key Judgements (IAS 1 §122)',
    itemCount: judgements.length,
    items: judgements.map((j) => ({
      id: j.judgementId,
      title: j.title,
      detail: `${j.description}. Impact area: ${j.impactArea}`,
    })),
  };

  const changedCount = policies.filter((p) => p.changeInPeriod).length;

  return {
    result: {
      entityName: reportingEntityName,
      fiscalYear,
      sections: [policySection, estimateSection, judgementSection],
      totalPolicies: policies.length,
      totalEstimates: estimates.length,
      totalJudgements: judgements.length,
      changedPoliciesCount: changedCount,
    },
    inputs: { reportingEntityName, fiscalYear },
    explanation: `Accounting policies note for ${reportingEntityName} FY${fiscalYear}: ${policies.length} policies (${changedCount} changed), ${estimates.length} estimates, ${judgements.length} judgements`,
  };
}
