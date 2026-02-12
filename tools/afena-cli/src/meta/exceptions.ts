/**
 * Exceptions loader — loads, validates, and checks expiry/review cycle
 * for .afena/capability-exceptions.json.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { capabilityExceptionsFileSchema } from 'afena-canon';
import type { CapabilityException, ExceptionScope } from 'afena-canon';

export interface LoadedExceptions {
  exceptions: CapabilityException[];
  expired: CapabilityException[];
  reviewOverdue: CapabilityException[];
}

function toDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Check if a file path matches an exception scope.
 * Paths are normalized to forward-slash relative to repo root.
 */
export function matchesScope(scope: ExceptionScope, filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/').replace(/\/$/, '');
  switch (scope.kind) {
    case 'repo':
      return true;
    case 'package':
      return normalized.startsWith(scope.package.replace(/\\/g, '/').replace(/\/$/, '') + '/');
    case 'file':
      return normalized === scope.file.replace(/\\/g, '/');
  }
}

/**
 * Load and validate exceptions from .afena/capability-exceptions.json.
 */
export function loadExceptions(repoRoot: string): LoadedExceptions {
  const filePath = join(repoRoot, '.afena', 'capability-exceptions.json');

  if (!existsSync(filePath)) {
    return { exceptions: [], expired: [], reviewOverdue: [] };
  }

  const raw = readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  const result = capabilityExceptionsFileSchema.parse(parsed);

  const now = toDateOnly(new Date());
  const expired: CapabilityException[] = [];
  const reviewOverdue: CapabilityException[] = [];

  for (const exc of result.exceptions) {
    if (exc.expiresOn < now) {
      expired.push(exc);
    }

    const reviewBase = exc.lastReviewedOn ?? exc.createdAt;
    const reviewDate = new Date(reviewBase);
    reviewDate.setDate(reviewDate.getDate() + exc.reviewEveryDays);
    if (toDateOnly(reviewDate) < now) {
      reviewOverdue.push(exc);
    }
  }

  return { exceptions: result.exceptions, expired, reviewOverdue };
}

/**
 * Find an active (non-expired) exception for a given key + rule + file.
 */
export function findException(
  exceptions: CapabilityException[],
  key: string,
  rule: string,
  filePath: string,
): CapabilityException | undefined {
  const now = toDateOnly(new Date());
  return exceptions.find(
    (exc) =>
      exc.key === key &&
      exc.rule === rule &&
      exc.expiresOn >= now &&
      matchesScope(exc.scope, filePath),
  );
}
