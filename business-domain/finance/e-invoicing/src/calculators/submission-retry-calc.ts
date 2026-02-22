/**
 * E-Invoice Submission Retry Calculator
 *
 * Determines whether a failed e-invoice submission should be retried,
 * computes the next retry delay using exponential backoff, and
 * evaluates whether the maximum retry count has been exceeded.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type SubmissionRetryInput = {
  submissionId: string;
  attemptCount: number;
  maxRetries: number;
  baseDelayMs: number;
  lastErrorCode: string;
  isTransient: boolean;
};

export type SubmissionRetryResult = {
  shouldRetry: boolean;
  nextDelayMs: number;
  attemptsRemaining: number;
  reason: string;
  explanation: string;
};

export function evaluateSubmissionRetry(
  inputs: SubmissionRetryInput,
): CalculatorResult<SubmissionRetryResult> {
  const { attemptCount, maxRetries, baseDelayMs, lastErrorCode, isTransient } = inputs;

  if (attemptCount < 0) {
    throw DomainError.validation('Attempt count cannot be negative');
  }
  if (maxRetries < 1) {
    throw DomainError.validation('Max retries must be at least 1');
  }
  if (baseDelayMs < 0) {
    throw DomainError.validation('Base delay cannot be negative');
  }

  const attemptsRemaining = Math.max(0, maxRetries - attemptCount);
  const exhausted = attemptsRemaining === 0;

  let shouldRetry = false;
  let reason: string;

  if (exhausted) {
    reason = 'max_retries_exceeded';
  } else if (!isTransient) {
    reason = `permanent_error:${lastErrorCode}`;
  } else {
    shouldRetry = true;
    reason = 'transient_error_retryable';
  }

  const nextDelayMs = shouldRetry
    ? Math.min(baseDelayMs * Math.pow(2, attemptCount), 300_000)
    : 0;

  const explanation = shouldRetry
    ? `Retry scheduled: attempt ${attemptCount + 1}/${maxRetries}, delay ${nextDelayMs}ms (${reason})`
    : `No retry: ${reason}, attempts ${attemptCount}/${maxRetries}`;

  return {
    result: { shouldRetry, nextDelayMs, attemptsRemaining, reason, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
