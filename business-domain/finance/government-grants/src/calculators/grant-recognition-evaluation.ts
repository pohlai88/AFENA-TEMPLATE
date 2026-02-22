/**
 * IAS 20.7 — Grant Recognition Test
 *
 * A government grant shall not be recognised until there is reasonable
 * assurance that the entity will comply with the conditions and that
 * the grant will be received.
 */

import type { CalculatorResult } from 'afenda-canon';

export type GrantRecognitionTestInput = {
  conditionsMet: boolean;
  grantReceived: boolean;
  grantApproved: boolean;
  complianceEvidenceAvailable: boolean;
};

export type GrantRecognitionTestResult = {
  shouldRecognise: boolean;
  reason: string;
  explanation: string;
};

export function evaluateGrantRecognition(
  inputs: GrantRecognitionTestInput,
): CalculatorResult<GrantRecognitionTestResult> {
  const { conditionsMet, grantReceived, grantApproved, complianceEvidenceAvailable } = inputs;

  const reasonableAssurance = conditionsMet && complianceEvidenceAvailable && (grantReceived || grantApproved);

  const reason = !conditionsMet
    ? 'conditions_not_met'
    : !complianceEvidenceAvailable
      ? 'no_compliance_evidence'
      : !grantReceived && !grantApproved
        ? 'grant_not_received_or_approved'
        : 'criteria_met';

  const shouldRecognise = reasonableAssurance;

  const explanation = shouldRecognise
    ? 'Grant recognition criteria met — reasonable assurance of compliance and receipt (IAS 20.7)'
    : `Grant recognition deferred — ${reason} (IAS 20.7)`;

  return {
    result: { shouldRecognise, reason, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
