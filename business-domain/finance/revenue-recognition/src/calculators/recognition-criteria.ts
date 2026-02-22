import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see RR-05 — Percentage-of-completion (cost-to-cost method) for over-time
 * @see RR-09 — Milestone-based recognition (output method)
 * @see RR-10 — Subscription / SaaS: ratable recognition over service period
 * RR-04 — Point-in-Time vs Over-Time Recognition Criteria (IFRS 15 §35–38)
 *
 * Evaluates the three over-time criteria to determine whether revenue should
 * be recognised over time or at a point in time.
 * Pure function — no I/O.
 */

export type RecognitionInput = {
  contractId: string;
  performanceObligationId: string;
  /** Criterion 1: Customer simultaneously receives and consumes benefits (§35a) */
  customerReceivesBenefitSimultaneously: boolean;
  /** Criterion 2: Entity's performance creates/enhances asset customer controls (§35b) */
  customerControlsAssetAsCreated: boolean;
  /** Criterion 3: No alternative use + enforceable right to payment for performance to date (§35c) */
  noAlternativeUse: boolean;
  enforceableRightToPayment: boolean;
  /** For point-in-time: indicators of transfer of control (§38) */
  controlIndicators?: {
    rightToPayment: boolean;
    legalTitle: boolean;
    physicalPossession: boolean;
    risksAndRewards: boolean;
    customerAccepted: boolean;
  };
};

export type RecognitionResult = {
  contractId: string;
  performanceObligationId: string;
  recognitionMethod: 'over-time' | 'point-in-time';
  overTimeCriteriaMet: { criterion1: boolean; criterion2: boolean; criterion3: boolean };
  satisfiedCriteriaCount: number;
  controlIndicatorsMet: number;
  reasoning: string;
};

export function evaluateRecognitionCriteria(input: RecognitionInput): CalculatorResult<RecognitionResult> {
  const { contractId, performanceObligationId } = input;

  if (!contractId) throw new DomainError('VALIDATION_FAILED', 'contractId is required');
  if (!performanceObligationId) throw new DomainError('VALIDATION_FAILED', 'performanceObligationId is required');

  const c1 = input.customerReceivesBenefitSimultaneously;
  const c2 = input.customerControlsAssetAsCreated;
  const c3 = input.noAlternativeUse && input.enforceableRightToPayment;

  const criteriaCount = [c1, c2, c3].filter(Boolean).length;
  const isOverTime = c1 || c2 || c3;

  let controlIndicatorsMet = 0;
  let reasoning: string;

  if (isOverTime) {
    const reasons: string[] = [];
    if (c1) reasons.push('§35(a): customer simultaneously receives and consumes benefits');
    if (c2) reasons.push('§35(b): entity creates/enhances customer-controlled asset');
    if (c3) reasons.push('§35(c): no alternative use + right to payment for performance to date');
    reasoning = `Over-time recognition: ${reasons.join('; ')}`;
  } else {
    const ci = input.controlIndicators;
    if (ci) {
      controlIndicatorsMet = [ci.rightToPayment, ci.legalTitle, ci.physicalPossession, ci.risksAndRewards, ci.customerAccepted].filter(Boolean).length;
    }
    reasoning = `Point-in-time recognition: none of the 3 over-time criteria met. ${controlIndicatorsMet}/5 control transfer indicators satisfied.`;
  }

  return {
    result: {
      contractId,
      performanceObligationId,
      recognitionMethod: isOverTime ? 'over-time' : 'point-in-time',
      overTimeCriteriaMet: { criterion1: c1, criterion2: c2, criterion3: c3 },
      satisfiedCriteriaCount: criteriaCount,
      controlIndicatorsMet,
      reasoning,
    },
    inputs: { contractId, performanceObligationId },
    explanation: reasoning,
  };
}
