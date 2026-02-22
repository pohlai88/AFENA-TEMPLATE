import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see DE-05 — Posting status machine: draft → posted → reversed (no direct
 * IC-09 — User Access Review: Quarterly Role Certification (SOX §404, COSO)
 * Pure function — no I/O.
 */

export type UserAccess = { userId: string; role: string; lastReviewIso: string | null; isActive: boolean };

export type AccessReviewItem = { userId: string; role: string; status: 'current' | 'overdue' | 'never_reviewed'; daysSinceReview: number | null };

export type AccessReviewResult = { items: AccessReviewItem[]; overdueCount: number; neverReviewedCount: number; compliancePct: number };

const REVIEW_INTERVAL_DAYS = 90;

export function evaluateAccessReview(users: UserAccess[], asOfIso: string): CalculatorResult<AccessReviewResult> {
  if (users.length === 0) throw new DomainError('VALIDATION_FAILED', 'No users');
  const asOfMs = new Date(asOfIso).getTime();
  const items: AccessReviewItem[] = users.filter((u) => u.isActive).map((u) => {
    if (!u.lastReviewIso) return { userId: u.userId, role: u.role, status: 'never_reviewed' as const, daysSinceReview: null };
    const days = Math.floor((asOfMs - new Date(u.lastReviewIso).getTime()) / 86400000);
    return { userId: u.userId, role: u.role, status: days > REVIEW_INTERVAL_DAYS ? 'overdue' as const : 'current' as const, daysSinceReview: days };
  });
  const overdueCount = items.filter((i) => i.status === 'overdue').length;
  const neverReviewedCount = items.filter((i) => i.status === 'never_reviewed').length;
  const currentCount = items.filter((i) => i.status === 'current').length;
  const compliancePct = items.length > 0 ? Math.round((currentCount / items.length) * 100) : 100;
  return { result: { items, overdueCount, neverReviewedCount, compliancePct }, inputs: { userCount: users.length, asOfIso }, explanation: `Access review: ${compliancePct}% compliant, ${overdueCount} overdue, ${neverReviewedCount} never reviewed` };
}
