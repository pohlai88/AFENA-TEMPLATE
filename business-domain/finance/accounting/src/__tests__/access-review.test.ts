import { describe, expect, it } from 'vitest';
import { evaluateAccessReview } from '../calculators/access-review';

describe('evaluateAccessReview', () => {
  const users = [
    { userId: 'U1', role: 'admin', lastReviewIso: '2025-01-01', isActive: true },
    { userId: 'U2', role: 'viewer', lastReviewIso: '2025-06-01', isActive: true },
    { userId: 'U3', role: 'editor', lastReviewIso: null, isActive: true },
    { userId: 'U4', role: 'admin', lastReviewIso: '2025-03-01', isActive: false },
  ];

  it('identifies overdue and never-reviewed users', () => {
    const r = evaluateAccessReview(users, '2025-07-01');
    expect(r.result.overdueCount).toBe(1);
    expect(r.result.neverReviewedCount).toBe(1);
  });

  it('excludes inactive users', () => {
    const r = evaluateAccessReview(users, '2025-07-01');
    expect(r.result.items.length).toBe(3);
  });

  it('computes compliance percentage', () => {
    const r = evaluateAccessReview(users, '2025-07-01');
    expect(r.result.compliancePct).toBeGreaterThan(0);
    expect(r.result.compliancePct).toBeLessThan(100);
  });

  it('throws on empty users', () => {
    expect(() => evaluateAccessReview([], '2025-07-01')).toThrow();
  });
});
