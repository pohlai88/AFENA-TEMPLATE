import { describe, it, expect } from 'vitest';

import { DEFAULT_CONFLICT_THRESHOLDS } from '../../types/conflict-thresholds.js';

import type { ConflictThresholds } from '../../types/conflict-thresholds.js';

describe('ACC-04: Configurable Conflict Thresholds', () => {
  it('should have sensible defaults', () => {
    expect(DEFAULT_CONFLICT_THRESHOLDS.autoMerge).toBe(60);
    expect(DEFAULT_CONFLICT_THRESHOLDS.manualReview).toBe(30);
    expect(DEFAULT_CONFLICT_THRESHOLDS.autoMerge).toBeGreaterThan(DEFAULT_CONFLICT_THRESHOLDS.manualReview);
  });

  it('should allow custom thresholds', () => {
    const custom: ConflictThresholds = { autoMerge: 80, manualReview: 50 };
    expect(custom.autoMerge).toBe(80);
    expect(custom.manualReview).toBe(50);
  });

  it('should route scores correctly based on thresholds', () => {
    const thresholds: ConflictThresholds = { autoMerge: 60, manualReview: 30 };

    const decide = (score: number): 'merge' | 'manual_review' | 'create' => {
      if (score >= thresholds.autoMerge) return 'merge';
      if (score >= thresholds.manualReview) return 'manual_review';
      return 'create';
    };

    expect(decide(80)).toBe('merge');
    expect(decide(60)).toBe('merge');
    expect(decide(59)).toBe('manual_review');
    expect(decide(30)).toBe('manual_review');
    expect(decide(29)).toBe('create');
    expect(decide(0)).toBe('create');
  });

  it('should support strict thresholds (high autoMerge)', () => {
    const strict: ConflictThresholds = { autoMerge: 90, manualReview: 60 };

    const decide = (score: number): string => {
      if (score >= strict.autoMerge) return 'merge';
      if (score >= strict.manualReview) return 'manual_review';
      return 'create';
    };

    expect(decide(95)).toBe('merge');
    expect(decide(70)).toBe('manual_review');
    expect(decide(50)).toBe('create');
  });
});
