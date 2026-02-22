/**
 * @see FC-01 — Period-end close checklist with task ownership and evidence
 * Close Validation Calculator
 *
 * Pre-close validation checks: unposted journals, unreconciled accounts,
 * open sub-ledgers, and mandatory evidence completeness.
 */
import type { CalculatorResult } from 'afenda-canon';

export interface ValidationCheck {
  checkCode: string;
  label: string;
  passed: boolean;
  message: string;
}

export interface EvidenceRequirement {
  taskId: string;
  taskCode: string;
  evidenceCount: number;
  requiredCount: number;
}

/**
 * Validate that all mandatory evidence has been provided for close tasks.
 */
export function validateCloseEvidence(
  requirements: EvidenceRequirement[],
): CalculatorResult<ValidationCheck[]> {
  const result = requirements.map((req) => ({
    checkCode: `evidence.${req.taskCode}`,
    label: `Evidence for ${req.taskCode}`,
    passed: req.evidenceCount >= req.requiredCount,
    message:
      req.evidenceCount >= req.requiredCount
        ? `${req.evidenceCount}/${req.requiredCount} evidence items provided`
        : `Missing evidence: ${req.evidenceCount}/${req.requiredCount} provided`,
  }));

  const passed = result.filter((c) => c.passed).length;
  return {
    result,
    inputs: { requirementCount: requirements.length },
    explanation: `Validated ${requirements.length} evidence requirements: ${passed} passed, ${result.length - passed} failed`,
  };
}

export interface ValidationSummary {
  allPassed: boolean;
  passedCount: number;
  failedCount: number;
  failures: ValidationCheck[];
}

/**
 * Aggregate multiple validation checks into a summary.
 */
export function summarizeValidation(
  checks: ValidationCheck[],
): CalculatorResult<ValidationSummary> {
  const failures = checks.filter((c) => !c.passed);
  const result = {
    allPassed: failures.length === 0,
    passedCount: checks.length - failures.length,
    failedCount: failures.length,
    failures,
  };

  return {
    result,
    inputs: { checkCount: checks.length },
    explanation: `Validation summary: ${result.passedCount} passed, ${result.failedCount} failed — ${result.allPassed ? 'ALL PASSED' : 'FAILURES DETECTED'}`,
  };
}
